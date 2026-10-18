import sys
import os
import unittest
import json

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from extensions import db
from seed.seed_data import seed_database

class HeritageStorytellerAPITestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        with cls.app.app_context():
            seed_database()

    def test_01_auth_flow(self):
        print("\n--- Testing Auth Flow ---")
        # 1. Register User
        res = self.client.post('/api/auth/register', json={
            'name': 'Test Student',
            'password': 'password123',
            'confirmPassword': 'password123',
            'role': 'user'
        })
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertIn('token', data['data'])

        token = data['data']['token']

        # 2. Login User
        res_login = self.client.post('/api/auth/login', json={
            'name': 'Test Student',
            'password': 'password123'
        })
        self.assertEqual(res_login.status_code, 200)
        login_data = res_login.get_json()
        self.assertTrue(login_data['success'])

        # 3. GET /api/auth/me
        res_me = self.client.get('/api/auth/me', headers={
            'Authorization': f'Bearer {token}'
        })
        self.assertEqual(res_me.status_code, 200)
        self.assertEqual(res_me.get_json()['data']['user']['name'], 'Test Student')

    def test_02_topics_flow(self):
        print("\n--- Testing Topics Flow ---")
        # GET all topics
        res = self.client.get('/api/topics')
        self.assertEqual(res.status_code, 200)
        topics = res.get_json()['data']
        self.assertGreaterEqual(len(topics), 5)

        # GET filter category
        res_cat = self.client.get('/api/topics?category=Crafts')
        self.assertEqual(res_cat.status_code, 200)
        for t in res_cat.get_json()['data']:
            self.assertIn('craft', t['category'].lower())

        # GET single topic
        res_single = self.client.get('/api/topics/warli-art')
        self.assertEqual(res_single.status_code, 200)
        topic = res_single.get_json()['data']
        self.assertEqual(topic['id'], 'warli-art')
        self.assertEqual(len(topic['chapters']), 5)

    def test_03_stories_and_progress_flow(self):
        print("\n--- Testing Stories and Complete Story Flow ---")
        # Login
        res_login = self.client.post('/api/auth/login', json={
            'name': 'Pratima',
            'password': 'password123'
        })
        token = res_login.get_json()['data']['token']
        headers = {'Authorization': f'Bearer {token}'}

        # GET chapters
        res_ch = self.client.get('/api/topics/warli-art/chapters')
        self.assertEqual(res_ch.status_code, 200)
        chapters = res_ch.get_json()['data']
        self.assertEqual(len(chapters), 5)
        self.assertEqual(chapters[0]['chapter_number'], 1)

        # Complete Story
        res_comp = self.client.post('/api/topics/warli-art/complete-story', headers=headers)
        self.assertEqual(res_comp.status_code, 200)
        comp_data = res_comp.get_json()['data']
        self.assertTrue(comp_data['story_completed'])

    def test_04_quiz_flow(self):
        print("\n--- Testing Quiz Flow ---")
        res_login = self.client.post('/api/auth/login', json={
            'name': 'Pratima',
            'password': 'password123'
        })
        token = res_login.get_json()['data']['token']
        headers = {'Authorization': f'Bearer {token}'}

        # GET quiz (verify no correct_answer exposed)
        res_q = self.client.get('/api/topics/warli-art/quiz')
        self.assertEqual(res_q.status_code, 200)
        questions = res_q.get_json()['data']
        self.assertEqual(len(questions), 5)
        self.assertNotIn('correct_answer', questions[0])

        # Submit Quiz with answers
        # For topic 'warli-art', answers: 1: 'B. Circle', 2: 'B. Ground Rice Paste', 3: 'B. Tarpa Horn', 4: 'A. Jivya Soma Mashe', 5: 'A. Two Inverted Triangles'
        q_ids = [q['id'] for q in questions]
        answers = {
            str(q_ids[0]): 'B. Circle',
            str(q_ids[1]): 'B. Ground Rice Paste',
            str(q_ids[2]): 'B. Tarpa Horn',
            str(q_ids[3]): 'A. Jivya Soma Mashe',
            str(q_ids[4]): 'A. Two Inverted Triangles'
        }

        res_sub = self.client.post('/api/topics/warli-art/quiz/submit', headers=headers, json={'answers': answers})
        self.assertEqual(res_sub.status_code, 200)
        quiz_res = res_sub.get_json()['data']
        self.assertEqual(quiz_res['score'], 5)
        self.assertEqual(quiz_res['percentage'], 100.0)
        self.assertGreater(quiz_res['xp_earned'], 0)

    def test_05_games_flow(self):
        print("\n--- Testing Games Flow ---")
        res_login = self.client.post('/api/auth/login', json={
            'name': 'Pratima',
            'password': 'password123'
        })
        token = res_login.get_json()['data']['token']
        headers = {'Authorization': f'Bearer {token}'}

        # GET Artifact match game
        res_art = self.client.get('/api/games/artifact-match/warli-art')
        self.assertEqual(res_art.status_code, 200)

        # Submit Artifact match game
        res_art_sub = self.client.post('/api/games/artifact-match/warli-art/submit', headers=headers, json={'score': 100})
        self.assertEqual(res_art_sub.status_code, 200)

        # GET Memory game
        res_mem = self.client.get('/api/games/memory/warli-art')
        self.assertEqual(res_mem.status_code, 200)

        # Submit Memory game
        res_mem_sub = self.client.post('/api/games/memory/warli-art/submit', headers=headers, json={'score': 100})
        self.assertEqual(res_mem_sub.status_code, 200)
        self.assertIn('unlocked_achievements', res_mem_sub.get_json()['data'])

    def test_06_dashboard_and_admin_flow(self):
        print("\n--- Testing User Dashboard and Admin APIs ---")
        # User Dashboard
        res_login = self.client.post('/api/auth/login', json={
            'name': 'Pratima',
            'password': 'password123'
        })
        user_token = res_login.get_json()['data']['token']

        res_dash = self.client.get('/api/dashboard', headers={'Authorization': f'Bearer {user_token}'})
        self.assertEqual(res_dash.status_code, 200)
        dash_data = res_dash.get_json()['data']
        self.assertIn('xp', dash_data)
        self.assertIn('stories_completed', dash_data)
        self.assertIn('quizzes_completed', dash_data)
        self.assertIn('games_completed', dash_data)
        self.assertIn('badges', dash_data)

        # Admin Dashboard
        res_admin_login = self.client.post('/api/auth/login', json={
            'name': 'Admin User',
            'password': 'admin123'
        })
        admin_token = res_admin_login.get_json()['data']['token']

        res_admin_dash = self.client.get('/api/admin/dashboard', headers={'Authorization': f'Bearer {admin_token}'})
        self.assertEqual(res_admin_dash.status_code, 200)
        admin_dash = res_admin_dash.get_json()['data']
        self.assertGreaterEqual(admin_dash['total_heritage_topics'], 5)

if __name__ == '__main__':
    unittest.main()
