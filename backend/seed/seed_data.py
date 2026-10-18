import sys
import os

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from extensions import db
from models.user import User
from models.heritage_topic import HeritageTopic
from models.story_chapter import StoryChapter
from models.quiz import QuizQuestion
from models.game import GameItem
from models.achievement import Achievement

def seed_database():
    app = create_app()
    with app.app_context():
        print("Recreating database tables...")
        db.drop_all()
        db.create_all()

        print("Seeding achievements...")
        achievements = [
            Achievement(
                id="heritage_explorer",
                name="Heritage Explorer",
                description="Completed 3 heritage story journeys",
                badge_image="🧭",
                requirement_type="stories_completed",
                requirement_value=3
            ),
            Achievement(
                id="culture_seeker",
                name="Culture Seeker",
                description="Completed 10 heritage story journeys",
                badge_image="🛕",
                requirement_type="stories_completed",
                requirement_value=10
            ),
            Achievement(
                id="heritage_guardian",
                name="Heritage Guardian",
                description="Completed 20 heritage story journeys",
                badge_image="👑",
                requirement_type="stories_completed",
                requirement_value=20
            ),
            Achievement(
                id="knowledge_master",
                name="Knowledge Master",
                description="Scored 100% in 5 cultural quizzes",
                badge_image="🎓",
                requirement_type="perfect_quizzes",
                requirement_value=5
            ),
            Achievement(
                id="heritage_gamer",
                name="Heritage Gamer",
                description="Completed both Artifact Match and Memory games",
                badge_image="🎮",
                requirement_type="games_completed",
                requirement_value=2
            ),
        ]
        db.session.add_all(achievements)

        print("Seeding default users...")
        admin = User(name="Admin User", role="admin", xp=1000)
        admin.set_password("admin123")

        user = User(name="Pratima", role="user", xp=320)
        user.set_password("password123")

        db.session.add_all([admin, user])

        print("Seeding heritage topics, chapters, quizzes, and game items...")

        topics_data = [
            {
                        "id": "shivaji-maratha-history",
                        "name": "Chhatrapati Shivaji Maharaj & Maratha Empire",
                        "category": "History",
                        "state": "Maharashtra",
                        "description": "The inspirational life of Chhatrapati Shivaji Maharaj, founder of the Maratha Empire, renowned for his administrative brilliance, naval fleet, and hill fort strategies.",
                        "historical_background": "Born at Shivneri Fort in 1630, Chhatrapati Shivaji Maharaj established Swarajya (self-rule) by challenging the Adilshahi Sultanate and Mughal Empire. He built a disciplined army, established the Ashta Pradhan council, developed a formidable navy, and was crowned Chhatrapati at Raigad Fort in 1674.",
                        "cover_image": "/shivaji-maratha.jpg",
                        "status": "Active",
                        "chapters": [
                                    {
                                                "chapter_number": 1,
                                                "title": "Early Life of Shivaji Maharaj",
                                                "content": "Chhatrapati Shivaji Maharaj was born on February 19, 1630 at Shivneri Fort. Guided by his mother Jijabai and mentor Dadoji Konddeo, he took an oath at Raireshwar Temple to establish Hindavi Swarajya\u2014self-rule based on justice and freedom from foreign dominance.",
                                                "image_url": "/shivaji-maratha.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 2,
                                                "title": "Foundation of Swarajya",
                                                "content": "Shivaji Maharaj captured Torna Fort at age 16, followed by Chakan, Kondhana (Sinhagad), and Rajgad. Facing Bijapur general Afzal Khan at Pratapgad in 1659, Shivaji used tactical brilliance and tiger claws (wagh nakh) to defeat him and secure Swarajya.",
                                                "image_url": "/shivaji-maratha.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 3,
                                                "title": "Maratha Forts & Military Strategy",
                                                "content": "Shivaji Maharaj pioneered \"Ganimi Kava\"\u2014tactical guerilla warfare that leveraged the rugged Sahyadri mountain terrain. He secured over 300 hill forts, sea forts, and land forts including Rajgad, Pratapgad, Sinhagad, and Sindhudurg to protect his sovereign borders.",
                                                "image_url": "/shivaji-maratha.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 4,
                                                "title": "Administration & Navy",
                                                "content": "Recognized as the Father of the Indian Navy, Shivaji Maharaj built sea fortresses like Sindhudurg and Vijaydurg with a powerful war fleet. He established the Ashta Pradhan (Council of Eight Ministers) for humane governance and tax reforms.",
                                                "image_url": "/shivaji-maratha.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 5,
                                                "title": "Legacy of Shivaji Maharaj",
                                                "content": "On June 6, 1674, Shivaji Maharaj was grandly crowned Chhatrapati at Raigad Fort. His legacy as a progressive, secular ruler who respected women, promoted Marathi and Sanskrit, and laid the bedrock of the Maratha Empire inspires generations.",
                                                "image_url": "/shivaji-maratha.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    }
                        ],
                        "quizzes": [
                                    {
                                                "question": "At which fort was Chhatrapati Shivaji Maharaj born on February 19, 1630?",
                                                "option_a": "A. Raigad Fort",
                                                "option_b": "B. Shivneri Fort",
                                                "option_c": "C. Pratapgad Fort",
                                                "option_d": "D. Sinhagad Fort",
                                                "correct_answer": "B. Shivneri Fort",
                                                "explanation": "Shivaji Maharaj was born at Shivneri Fort near Junnar in Pune district."
                                    },
                                    {
                                                "question": "What was the name of the guerilla warfare tactics pioneered by Shivaji Maharaj?",
                                                "option_a": "A. Ganimi Kava",
                                                "option_b": "B. Tulghuma Strategy",
                                                "option_c": "C. Chakravyuh Formation",
                                                "option_d": "D. Vyuha Battle",
                                                "correct_answer": "A. Ganimi Kava",
                                                "explanation": "Ganimi Kava was the Maratha guerilla strategy utilizing terrain, surprise speed, and local knowledge."
                                    },
                                    {
                                                "question": "Which sea fort fortress was constructed by Shivaji Maharaj off the Konkan coast?",
                                                "option_a": "A. Murud Janjira",
                                                "option_b": "B. Sindhudurg Fort",
                                                "option_c": "C. Aguada Fort",
                                                "option_d": "D. Diu Fort",
                                                "correct_answer": "B. Sindhudurg Fort",
                                                "explanation": "Sindhudurg Fort at Malvan was built by Shivaji Maharaj to secure Maratha maritime dominance."
                                    },
                                    {
                                                "question": "What was the administrative council of eight ministers instituted by Shivaji Maharaj called?",
                                                "option_a": "A. Navratna Council",
                                                "option_b": "B. Ashta Pradhan",
                                                "option_c": "C. Ashtadiggajas",
                                                "option_d": "D. Mantri Parishad",
                                                "correct_answer": "B. Ashta Pradhan",
                                                "explanation": "The Ashta Pradhan was a council of eight ministers headed by the Peshwa for governance."
                                    },
                                    {
                                                "question": "In which year was Chhatrapati Shivaji Maharaj crowned at Raigad Fort?",
                                                "option_a": "A. 1659 CE",
                                                "option_b": "B. 1666 CE",
                                                "option_c": "C. 1674 CE",
                                                "option_d": "D. 1680 CE",
                                                "correct_answer": "C. 1674 CE",
                                                "explanation": "Shivaji Maharaj was crowned Chhatrapati in a grand ceremony at Raigad Fort on June 6, 1674."
                                    }
                        ],
                        "game_items": [
                                    {
                                                "game_type": "artifact_match",
                                                "item_name": "Chhatrapati Shivaji Maharaj & Maratha Empire Item",
                                                "match_value": "History",
                                                "image_url": "/shivaji-maratha.jpg"
                                    },
                                    {
                                                "game_type": "memory",
                                                "item_name": "Chhatrapati Shivaji Maharaj & Maratha Empire Symbol",
                                                "match_value": "Chhatrapati Shivaji Maharaj & Maratha Empire Symbol",
                                                "image_url": "/shivaji-maratha.jpg"
                                    }
                        ]
            },
            {
                        "id": "raigad-hill-forts",
                        "name": "Raigad Fort & Maratha Hill Forts",
                        "category": "Monuments",
                        "state": "Maharashtra",
                        "description": "The strategic hill forts of the Sahyadri range, with Raigad Fort as the glorious capital of Chhatrapati Shivaji Maharaj's Swarajya.",
                        "historical_background": "Raigad Fort, originally known as Rairi, was renovated and expanded by Chhatrapati Shivaji Maharaj into the sovereign capital of the Maratha Empire. Perched at 2,700 feet, Raigad is supported by over 300 mountain forts creating an unbreachable defensive shield.",
                        "cover_image": "/raigad-fort.jpg",
                        "status": "Active",
                        "chapters": [
                                    {
                                                "chapter_number": 1,
                                                "title": "Raigad Fort",
                                                "content": "Perched 2,700 feet high in the Sahyadri mountains of Mahad, Raigad Fort was chosen by Chhatrapati Shivaji Maharaj as the capital of the Maratha Empire in 1674 due to its impregnable natural cliff defenses.",
                                                "image_url": "/raigad-fort.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 2,
                                                "title": "Geography of Hill Forts",
                                                "content": "The western ghats provided steep basaltic cliffs and deep valleys. Forts were categorized into Giri Durg (hill forts), Jala Durg (sea forts), and Vana Durg (forest forts) forming a strategic defensive shield.",
                                                "image_url": "/raigad-fort.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 3,
                                                "title": "Fort Architecture",
                                                "content": "Architect Hiroji Indulkar designed Raigad with double-fortified bastions, the iconic Maha Darwaja, Nagarkhana drum tower, public execution point Hirakani Buruj, and rain harvesting water tanks.",
                                                "image_url": "/raigad-fort.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 4,
                                                "title": "Life Inside the Forts",
                                                "content": "Inside Raigad was a thriving city with a royal court (Raj Sabha), mint, armory, granaries, and a unique 22-shop marketplace elevated above ground for horse-rider shopping.",
                                                "image_url": "/raigad-fort.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 5,
                                                "title": "Forts and Maratha Heritage",
                                                "content": "Maratha hill forts stand as proud symbols of freedom and engineering mastery. Nominated for UNESCO World Heritage status, they attract trekkers, historians, and devotees of Maratha history.",
                                                "image_url": "/raigad-fort.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    }
                        ],
                        "quizzes": [
                                    {
                                                "question": "Who was the chief architect responsible for the construction and layout of Raigad Fort?",
                                                "option_a": "A. Hiroji Indulkar",
                                                "option_b": "B. Baji Prabhu",
                                                "option_c": "C. Moropant Pingle",
                                                "option_d": "D. Annaji Datto",
                                                "correct_answer": "A. Hiroji Indulkar",
                                                "explanation": "Master architect Hiroji Indulkar designed the royal court, markets, and gates at Raigad."
                                    },
                                    {
                                                "question": "What unique feature was built into the market street inside Raigad Fort?",
                                                "option_a": "A. Underground Tunnels",
                                                "option_b": "B. Elevated Shops for Horse-Rider Shopping",
                                                "option_c": "C. Floating Wooden Stalls",
                                                "option_d": "D. Glass Roof Canopies",
                                                "correct_answer": "B. Elevated Shops for Horse-Rider Shopping",
                                                "explanation": "The 22 shops were raised on high stone plinths so merchants could serve customers on horseback."
                                    },
                                    {
                                                "question": "Which brave mother's legend is associated with scaling down Raigad's steep cliff after gates locked?",
                                                "option_a": "A. Tarabai",
                                                "option_b": "B. Hirakani",
                                                "option_c": "C. Umabai",
                                                "option_d": "D. Jijabai",
                                                "correct_answer": "B. Hirakani",
                                                "explanation": "Hirakani descended the steep cliff face at night to nurse her infant, earning a bastion built in her honor."
                                    },
                                    {
                                                "question": "What is a hill fort called in traditional Indian fort classification?",
                                                "option_a": "A. Jala Durg",
                                                "option_b": "B. Giri Durg",
                                                "option_c": "C. Vana Durg",
                                                "option_d": "D. Dhanva Durg",
                                                "correct_answer": "B. Giri Durg",
                                                "explanation": "Giri Durg refers specifically to hill mountain fortresses."
                                    },
                                    {
                                                "question": "Which main majestic gateway serves as the primary entrance to Raigad Fort?",
                                                "option_a": "A. Delhi Darwaja",
                                                "option_b": "B. Maha Darwaja",
                                                "option_c": "C. Ganesh Darwaja",
                                                "option_d": "D. Hanuman Darwaja",
                                                "correct_answer": "B. Maha Darwaja",
                                                "explanation": "The Maha Darwaja flanked by massive pentagonal bastions is the grand entrance of Raigad."
                                    }
                        ],
                        "game_items": [
                                    {
                                                "game_type": "artifact_match",
                                                "item_name": "Raigad Fort & Maratha Hill Forts Item",
                                                "match_value": "Monuments",
                                                "image_url": "/raigad-fort.jpg"
                                    },
                                    {
                                                "game_type": "memory",
                                                "item_name": "Raigad Fort & Maratha Hill Forts Symbol",
                                                "match_value": "Raigad Fort & Maratha Hill Forts Symbol",
                                                "image_url": "/raigad-fort.jpg"
                                    }
                        ]
            },
            {
                        "id": "lavani-dance",
                        "name": "Lavani Dance",
                        "category": "Dance",
                        "state": "Maharashtra",
                        "description": "Sensual and rhythmic folk dance of Maharashtra performed to the fast beats of Dholak in traditional Nauvari sarees.",
                        "historical_background": "Originating in 18th-century Maharashtra during the Peshwa rule, Lavani combined song, dance, and theater. It was performed to boost the morale of tired Maratha soldiers and evolved into a celebrated traditional art form.",
                        "cover_image": "/lavani-dance.jpg",
                        "status": "Active",
                        "chapters": [
                                    {
                                                "chapter_number": 1,
                                                "title": "Origins of Lavani",
                                                "content": "Lavani originated in 18th-century Maharashtra as a vibrant folk dance combining music, rhythm, and expressive storytelling, boosting the morale of Maratha soldiers during wartime campaigns.",
                                                "image_url": "/lavani-dance.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 2,
                                                "title": "Lavani Music and Rhythm",
                                                "content": "Driven by the energetic beats of the Dholak drum and Manjira cymbals, Lavani compositions range from soulful Nirguni spiritual lyrics to high-tempo Shringari romantic folk songs.",
                                                "image_url": "/lavani-dance.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 3,
                                                "title": "Traditional Costume",
                                                "content": "Dancers wear a nine-yard Nauvari saree tucked gracefully between the legs, adorned with heavy gold jewelry, Kamarpatta waist chain, hair bun with gajra flowers, and dark ghungroos on ankles.",
                                                "image_url": "/lavani-dance.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 4,
                                                "title": "Dance and Performance",
                                                "content": "Lavani features rapid footwork, rhythmic hip movements, expressive eye gestures (Abhinaya), and dramatic facial expressions performed live on stage across Maharashtra.",
                                                "image_url": "/lavani-dance.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 5,
                                                "title": "Lavani in Modern Maharashtra",
                                                "content": "Today, Lavani has transitioned from traditional sangeet bari folk theaters to mainstream Indian cinema, global cultural festivals, and modern theatrical dance productions.",
                                                "image_url": "/lavani-dance.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    }
                        ],
                        "quizzes": [
                                    {
                                                "question": "What traditional percussion instrument is essential to Lavani performances?",
                                                "option_a": "A. Tabla",
                                                "option_b": "B. Dholak",
                                                "option_c": "C. Mridangam",
                                                "option_d": "D. Sitar",
                                                "correct_answer": "B. Dholak",
                                                "explanation": "The fast syncopated beats of the Dholak provide the primary rhythm for Lavani."
                                    },
                                    {
                                                "question": "What length of saree is traditionally worn by Lavani dancers?",
                                                "option_a": "A. 6-yard Saree",
                                                "option_b": "B. 9-yard Nauvari Saree",
                                                "option_c": "C. 5-yard Chanderi Saree",
                                                "option_d": "D. 12-yard Saree",
                                                "correct_answer": "B. 9-yard Nauvari Saree",
                                                "explanation": "The 9-yard Nauvari saree tucked trouser-style allows free movement and dramatic turns."
                                    },
                                    {
                                                "question": "What is the seated form of Lavani that focuses heavily on facial expression called?",
                                                "option_a": "A. Phad Lavani",
                                                "option_b": "B. Baithak Lavani",
                                                "option_c": "C. Koli Lavani",
                                                "option_d": "D. Tamasha Lavani",
                                                "correct_answer": "B. Baithak Lavani",
                                                "explanation": "Baithak Lavani is performed while seated before an intimate audience focusing on vocal nuance."
                                    },
                                    {
                                                "question": "During which historical era did Lavani receive major royal patronage in Maharashtra?",
                                                "option_a": "A. Chola Empire",
                                                "option_b": "B. Peshwa Era",
                                                "option_c": "C. Maurya Dynasty",
                                                "option_d": "D. Gupta Empire",
                                                "correct_answer": "B. Peshwa Era",
                                                "explanation": "Peshwa rulers in the 18th century patronized Lavani artists across Pune and Satara."
                                    },
                                    {
                                                "question": "Which Sanskrit root word gave rise to the name 'Lavani'?",
                                                "option_a": "A. Lavanya (Beauty & Grace)",
                                                "option_b": "B. Laya (Rhythm)",
                                                "option_c": "C. Natya (Drama)",
                                                "option_d": "D. Nritya (Dance)",
                                                "correct_answer": "A. Lavanya (Beauty & Grace)",
                                                "explanation": "'Lavani' is derived from 'Lavanya', signifying aesthetic beauty and grace."
                                    }
                        ],
                        "game_items": [
                                    {
                                                "game_type": "artifact_match",
                                                "item_name": "Lavani Dance Item",
                                                "match_value": "Dance",
                                                "image_url": "/lavani-dance.jpg"
                                    },
                                    {
                                                "game_type": "memory",
                                                "item_name": "Lavani Dance Symbol",
                                                "match_value": "Lavani Dance Symbol",
                                                "image_url": "/lavani-dance.jpg"
                                    }
                        ]
            },
            {
                        "id": "warli-art",
                        "name": "Warli Tribal Art",
                        "category": "Traditional Art",
                        "state": "Maharashtra",
                        "description": "Ancient tribal art of Maharashtra created using basic geometric shapes like circles, triangles, and lines on mud walls.",
                        "historical_background": "Originating around 3000 BCE in North Sahyadri region, Warli art is created mostly by women during sacred ritualistic harvest and wedding events using rice paste and gum on reddish mud walls.",
                        "cover_image": "/warli-art.jpg",
                        "status": "Active",
                        "chapters": [
                                    {
                                                "chapter_number": 1,
                                                "title": "Origins of Warli Art",
                                                "content": "Warli painting is an ancient tribal art form created by the Warli tribe in the Sahyadri mountains of Maharashtra. Dating back to 2500\u20133000 BCE, these paintings adorn mud walls of village homes.",
                                                "image_url": "/warli-art.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 2,
                                                "title": "Traditional Painting Materials",
                                                "content": "Walls are coated with Gairu (red ochre clay) mixed with mud and cow dung. White paint is made from ground rice paste mixed with water and natural gum, applied using chewed bamboo sticks.",
                                                "image_url": "/warli-art.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 3,
                                                "title": "Geometric Symbols and Figures",
                                                "content": "Warli motifs use fundamental geometry: circles represent the sun and moon, triangles stem from mountains and trees, and squares depict sacred space and mother earth goddess Palaghata.",
                                                "image_url": "/warli-art.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 4,
                                                "title": "Stories and Community Life",
                                                "content": "A famous motif is the spiral Tarpa dance, where villagers join hands around a musician playing the Tarpa wind horn instrument made from dried gourd, celebrating harvest and life.",
                                                "image_url": "/warli-art.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 5,
                                                "title": "Warli Art Today",
                                                "content": "Pioneered by master artist Jivya Soma Mashe in the 1970s, Warli art expanded from tribal walls to modern paper, textiles, fashion, murals, and international art galleries.",
                                                "image_url": "/warli-art.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    }
                        ],
                        "quizzes": [
                                    {
                                                "question": "Which basic geometric shape in Warli art represents the Sun and Moon?",
                                                "option_a": "A. Square",
                                                "option_b": "B. Circle",
                                                "option_c": "C. Triangle",
                                                "option_d": "D. Hexagon",
                                                "correct_answer": "B. Circle",
                                                "explanation": "The circle is used to depict celestial bodies like the Sun and Moon."
                                    },
                                    {
                                                "question": "What natural ingredient is mixed to prepare white paint pigment in Warli art?",
                                                "option_a": "A. Chalk Powder",
                                                "option_b": "B. Ground Rice Paste",
                                                "option_c": "C. White Lime",
                                                "option_d": "D. Flour",
                                                "correct_answer": "B. Ground Rice Paste",
                                                "explanation": "Ground rice paste mixed with natural gum provides the white pigment."
                                    },
                                    {
                                                "question": "Which wind instrument made from dried gourd is central to the Warli spiral dance motif?",
                                                "option_a": "A. Shehnai",
                                                "option_b": "B. Tarpa Horn",
                                                "option_c": "C. Flute",
                                                "option_d": "D. Pungi",
                                                "correct_answer": "B. Tarpa Horn",
                                                "explanation": "The Tarpa is a tribal wind instrument played during harvest community dances."
                                    },
                                    {
                                                "question": "Who was the master Warli artist honored with Padma Shri for popularizing the art globally?",
                                                "option_a": "A. Jivya Soma Mashe",
                                                "option_b": "B. Jamini Roy",
                                                "option_c": "C. Raja Ravi Varma",
                                                "option_d": "D. Tyeb Mehta",
                                                "correct_answer": "A. Jivya Soma Mashe",
                                                "explanation": "Jivya Soma Mashe revolutionized Warli art by painting on canvas and paper."
                                    },
                                    {
                                                "question": "How are human bodies traditionally depicted in Warli geometric drawings?",
                                                "option_a": "A. Two Inverted Triangles",
                                                "option_b": "B. Concentric Circles",
                                                "option_c": "C. Parallel Rectangles",
                                                "option_d": "D. Single Lines",
                                                "correct_answer": "A. Two Inverted Triangles",
                                                "explanation": "Human torsos are drawn using two triangles joined at the waist."
                                    }
                        ],
                        "game_items": [
                                    {
                                                "game_type": "artifact_match",
                                                "item_name": "Warli Tribal Art Item",
                                                "match_value": "Traditional Art",
                                                "image_url": "/heritage/warli/warli.png"
                                    },
                                    {
                                                "game_type": "memory",
                                                "item_name": "Warli Tribal Art Symbol",
                                                "match_value": "Warli Tribal Art Symbol",
                                                "image_url": "/heritage/warli/warli.png"
                                    }
                        ]
            },
            {
                        "id": "tn-brihadeeswarar",
                        "name": "Brihadeeswarar Temple & Chola Civilization",
                        "category": "Civilization",
                        "state": "Tamil Nadu",
                        "description": "The Great Living Chola Temple at Thanjavur in Tamil Nadu, built by Emperor Raja Raja Chola I with a 216-foot solid granite Vimana tower.",
                        "historical_background": "Completed in 1010 CE, Brihadeeswarar Temple (Big Temple) is a UNESCO World Heritage site and an engineering marvel constructed entirely of solid granite in Dravidian style without mortar.",
                        "cover_image": "/brihadeeswarar.jpg",
                        "status": "Active",
                        "chapters": [
                                    {
                                                "chapter_number": 1,
                                                "title": "Brihadeeswarar Temple",
                                                "content": "Built over 1,000 years ago by Emperor Raja Raja Chola I in Thanjavur, Brihadeeswarar Temple (Big Temple) stands as a monumental masterpiece of Tamil Dravidian architecture.",
                                                "image_url": "/brihadeeswarar.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 2,
                                                "title": "Chola Architecture",
                                                "content": "Constructed completely of interlocking granite without mortar, the Vimana tower rises 216 feet high, topped by an 80-ton single granite stone cap (Kumbam) rolled up a 6 km ramp.",
                                                "image_url": "/brihadeeswarar.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 3,
                                                "title": "Temple Sculptures",
                                                "content": "The temple complex houses a giant 20-ton monolithic Nandi bull sculpture, intricate relief carvings of 108 Bharatanatyam dance poses, and vibrant fresco mural paintings on inner corridors.",
                                                "image_url": "/brihadeeswarar.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 4,
                                                "title": "Chola Society and Culture",
                                                "content": "The Chola Empire managed advanced agrarian irrigation, overseas trade with Southeast Asia, democratic village assemblies (Kudavolai system), and world-famous lost-wax bronze sculptures.",
                                                "image_url": "/brihadeeswarar.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 5,
                                                "title": "Chola Legacy",
                                                "content": "Designated as a UNESCO World Heritage Site under \"Great Living Chola Temples\", Brihadeeswarar remains an active place of worship celebrating Tamil cultural pride and architectural brilliance.",
                                                "image_url": "/brihadeeswarar.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    }
                        ],
                        "quizzes": [
                                    {
                                                "question": "Which famous Chola emperor constructed Brihadeeswarar Temple?",
                                                "option_a": "A. Rajendra Chola I",
                                                "option_b": "B. Raja Raja Chola I",
                                                "option_c": "C. Karikala Chola",
                                                "option_d": "D. Kulottunga Chola",
                                                "correct_answer": "B. Raja Raja Chola I",
                                                "explanation": "Emperor Raja Raja Chola I commissioned the temple in 1002 CE and completed it in 1010 CE."
                                    },
                                    {
                                                "question": "What building material was exclusively used to build Brihadeeswarar Temple?",
                                                "option_a": "A. Red Sandstone",
                                                "option_b": "B. Solid Granite",
                                                "option_c": "C. Marble",
                                                "option_d": "D. Terracotta Bricks",
                                                "correct_answer": "B. Solid Granite",
                                                "explanation": "It is the world's first temple completely built out of solid granite rock."
                                    },
                                    {
                                                "question": "In which Tamil Nadu city is Brihadeeswarar Temple located?",
                                                "option_a": "A. Madurai",
                                                "option_b": "B. Thanjavur",
                                                "option_c": "C. Kanchipuram",
                                                "option_d": "D. Mahabalipuram",
                                                "correct_answer": "B. Thanjavur",
                                                "explanation": "Brihadeeswarar Temple is located in Thanjavur on the banks of the Kaveri River."
                                    },
                                    {
                                                "question": "How heavy is the single granite block dome (Kumbam) at the apex of the Vimana tower?",
                                                "option_a": "A. 20 Tons",
                                                "option_b": "B. 40 Tons",
                                                "option_c": "C. 80 Tons",
                                                "option_d": "D. 120 Tons",
                                                "correct_answer": "C. 80 Tons",
                                                "explanation": "The top cap stone Kumbam weighs approximately 80 metric tons."
                                    },
                                    {
                                                "question": "Brihadeeswarar Temple is dedicated to which primary deity?",
                                                "option_a": "A. Lord Vishnu",
                                                "option_b": "B. Lord Shiva",
                                                "option_c": "C. Lord Murugan",
                                                "option_d": "D. Goddess Meenakshi",
                                                "correct_answer": "B. Lord Shiva",
                                                "explanation": "The temple is dedicated to Lord Shiva in the form of a massive Lingam."
                                    }
                        ],
                        "game_items": [
                                    {
                                                "game_type": "artifact_match",
                                                "item_name": "Brihadeeswarar Temple & Chola Civilization Item",
                                                "match_value": "Civilization",
                                                "image_url": "/brihadeeswarar.jpg"
                                    },
                                    {
                                                "game_type": "memory",
                                                "item_name": "Brihadeeswarar Temple & Chola Civilization Symbol",
                                                "match_value": "Brihadeeswarar Temple & Chola Civilization Symbol",
                                                "image_url": "/brihadeeswarar.jpg"
                                    }
                        ]
            },
            {
                        "id": "bihu-folk-music",
                        "name": "Bihu Folk Music",
                        "category": "Music",
                        "state": "Assam",
                        "description": "Joyful seasonal folk music of Assam celebrating spring harvest, youth, and love with Dhol, Pepa horn, and bamboo flutes.",
                        "historical_background": "Bihu is the quintessential cultural spirit of Assam. Associated with three seasonal festivals\u2014Bohag Bihu (spring), Kati Bihu (autumn), and Magh Bihu (winter harvest)\u2014the folk music reflects agricultural rhythms and rural love stories.",
                        "cover_image": "/bihu-music.jpg",
                        "status": "Active",
                        "chapters": [
                                    {
                                                "chapter_number": 1,
                                                "title": "Origins of Bihu",
                                                "content": "Bihu folk music is the heart of Assam, associated with the three seasonal Bihu festivals: Bohag (spring harvest), Kati (autumn crop protection), and Magh (winter harvest bonfires).",
                                                "image_url": "/bihu-music.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 2,
                                                "title": "Bihu Musical Instruments",
                                                "content": "The music relies on traditional instruments including the Dhol (twin-headed drum), Pepa (buffalo horn flute), Taal (cymbals), Gagana (bamboo jaw harp), and Tokari (stringed lute).",
                                                "image_url": "/bihu-music.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 3,
                                                "title": "Bihu Songs and Rhythms",
                                                "content": "Bihu songs (Bihu Naam) express themes of love, nature's beauty, farming life, and youth joy, composed in catchy pentatonic scales with energetic syncopated beats.",
                                                "image_url": "/bihu-music.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 4,
                                                "title": "Traditional Celebrations",
                                                "content": "Dancers in Muga silk Mekhela Chador dance in circles (Husori), swaying hips and clapping hands alongside musicians under blooming orchids during Bohag Bihu.",
                                                "image_url": "/bihu-music.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 5,
                                                "title": "Bihu in Modern Assam",
                                                "content": "Today, Bihu holds Guinness World Records for massive ensemble performances, uniting communities across Assam and showcasing Indian folk music on global stages.",
                                                "image_url": "/bihu-music.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    }
                        ],
                        "quizzes": [
                                    {
                                                "question": "Which Bihu festival celebrated in mid-April marks the Assamese Spring New Year?",
                                                "option_a": "A. Magh Bihu",
                                                "option_b": "B. Bohag Bihu (Rongali Bihu)",
                                                "option_c": "C. Kati Bihu",
                                                "option_d": "D. Kongali Bihu",
                                                "correct_answer": "B. Bohag Bihu (Rongali Bihu)",
                                                "explanation": "Bohag Bihu or Rongali Bihu celebrates spring and the new agricultural cycle."
                                    },
                                    {
                                                "question": "What horn instrument made from buffalo horn is played during Bihu music?",
                                                "option_a": "A. Pepa",
                                                "option_b": "B. Tarpa",
                                                "option_c": "C. Shehnai",
                                                "option_d": "D. Nagaswaram",
                                                "correct_answer": "A. Pepa",
                                                "explanation": "The Pepa is crafted from buffalo horn and bamboo."
                                    },
                                    {
                                                "question": "What indigenous golden silk of Assam is used for Bihu dance Mekhela Chador attire?",
                                                "option_a": "A. Tussar Silk",
                                                "option_b": "B. Muga Silk",
                                                "option_c": "C. Mulberry Silk",
                                                "option_d": "D. Eri Silk",
                                                "correct_answer": "B. Muga Silk",
                                                "explanation": "Muga silk is exclusive to Assam, known for its natural golden gloss."
                                    },
                                    {
                                                "question": "What is the traditional village door-to-door group musical performance during Bihu called?",
                                                "option_a": "A. Husori",
                                                "option_b": "B. Lavani",
                                                "option_c": "C. Ghoomar",
                                                "option_d": "D. Garba",
                                                "correct_answer": "A. Husori",
                                                "explanation": "Husori is the ritual group singing and dancing performed in village courtyards."
                                    },
                                    {
                                                "question": "What twin-headed wooden drum is the primary rhythm instrument in Bihu music?",
                                                "option_a": "A. Assamese Dhol",
                                                "option_b": "B. Tabla",
                                                "option_c": "C. Pakhawaj",
                                                "option_d": "D. Khol",
                                                "correct_answer": "A. Assamese Dhol",
                                                "explanation": "The Assamese Dhol played with bamboo sticks provides the signature fast Bihu beat."
                                    }
                        ],
                        "game_items": [
                                    {
                                                "game_type": "artifact_match",
                                                "item_name": "Bihu Folk Music Item",
                                                "match_value": "Music",
                                                "image_url": "/bihu_folk_music_hero_reference.png"
                                    },
                                    {
                                                "game_type": "memory",
                                                "item_name": "Bihu Folk Music Symbol",
                                                "match_value": "Bihu Folk Music Symbol",
                                                "image_url": "/bihu_folk_music_hero_reference.png"
                                    }
                        ]
            },
            {
                        "id": "pashmina-weaving",
                        "name": "Pashmina Weaving",
                        "category": "Crafts",
                        "state": "Jammu & Kashmir",
                        "description": "Exquisite Kashmiri handicraft of hand-spinning and handweaving ultra-fine Changthangi cashmere wool into luxurious warm shawls.",
                        "historical_background": "Introduced to Kashmir in the 15th century by saint Mir Sayyid Ali Hamadani and patronized by Sultan Zain-ul-Abidin, Pashmina weaving is an iconic art form. The wool comes from Changthangi goats living at altitudes above 14,000 feet in Ladakh.",
                        "cover_image": "/pashmina-weaving.jpg",
                        "status": "Active",
                        "chapters": [
                                    {
                                                "chapter_number": 1,
                                                "title": "The Pashmina Tradition",
                                                "content": "Pashmina is Kashmir's world-famous luxury textile art. Patronized by Mughal Emperors and European royalty, Pashmina shawls are celebrated for unmatched softness, warmth, and elegance.",
                                                "image_url": "/pashmina-weaving.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 2,
                                                "title": "Pashmina Wool",
                                                "content": "Raw wool is harvested from Changthangi goats grazing at 14,000 feet in Ladakh. The undercoat fiber measures just 12\u201315 microns\u20146 times finer than human hair.",
                                                "image_url": "/pashmina-weaving.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 3,
                                                "title": "Traditional Weaving",
                                                "content": "Artisans painstakingly hand-spin fine yarn on traditional spinning wheels (Charkha) and hand-weave soft fabric on wooden handlooms across Srinagar workshops.",
                                                "image_url": "/pashmina-weaving.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 4,
                                                "title": "Kashmiri Patterns and Craftsmanship",
                                                "content": "Kashmiri craftsmen decorate shawls with Sozni needle embroidery, Kani twill weaving with wooden spools, and classic paisley (Badam) floral motifs.",
                                                "image_url": "/pashmina-weaving.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 5,
                                                "title": "Pashmina Heritage Today",
                                                "content": "Protected by Geographical Indication (GI) certification, authentic Kashmiri Pashmina remains a prized global symbol of sustainable luxury handicraft.",
                                                "image_url": "/pashmina-weaving.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    }
                        ],
                        "quizzes": [
                                    {
                                                "question": "Which high-altitude goat breed produces the raw fleece for authentic Kashmiri Pashmina?",
                                                "option_a": "A. Jamnapari Goat",
                                                "option_b": "B. Changthangi Goat",
                                                "option_c": "C. Barbari Goat",
                                                "option_d": "D. Boer Goat",
                                                "correct_answer": "B. Changthangi Goat",
                                                "explanation": "Changthangi goats native to the high-altitude Ladakh plateau produce fine Pashmina fleece."
                                    },
                                    {
                                                "question": "How fine is a fiber of pure Pashmina wool compared to human hair?",
                                                "option_a": "A. 2 Times Finer",
                                                "option_b": "B. 6 Times Finer (12\u201315 Microns)",
                                                "option_c": "C. Same Thickness",
                                                "option_d": "D. 10 Times Thicker",
                                                "correct_answer": "B. 6 Times Finer (12\u201315 Microns)",
                                                "explanation": "Pashmina fibers measure 12-15 microns, roughly six times finer than human hair."
                                    },
                                    {
                                                "question": "Which intricate Kashmiri weaving technique uses small wooden spools called 'Tuji'?",
                                                "option_a": "A. Kani Weaving",
                                                "option_b": "B. Chikankari",
                                                "option_c": "C. Zardozi",
                                                "option_d": "D. Bandhani",
                                                "correct_answer": "A. Kani Weaving",
                                                "explanation": "Kani shawls are woven using wooden spools called Tuji according to coded pattern scripts."
                                    },
                                    {
                                                "question": "Which 15th-century ruler of Kashmir patronized and expanded the Pashmina weaving industry?",
                                                "option_a": "A. Akbar",
                                                "option_b": "B. Sultan Zain-ul-Abidin",
                                                "option_c": "C. Shah Jahan",
                                                "option_d": "D. Hari Singh",
                                                "correct_answer": "B. Sultan Zain-ul-Abidin",
                                                "explanation": "Sultan Zain-ul-Abidin invited Persian master weavers to settle and train artisans in Kashmir."
                                    },
                                    {
                                                "question": "What formal certification protects authentic hand-spun Kashmiri Pashmina from imitations?",
                                                "option_a": "A. Hallmark",
                                                "option_b": "B. Geographical Indication (GI) Tag",
                                                "option_c": "C. ISO 9001",
                                                "option_d": "D. Agmark",
                                                "correct_answer": "B. Geographical Indication (GI) Tag",
                                                "explanation": "The GI tag guarantees that the shawl is genuine hand-spun Kashmiri Pashmina."
                                    }
                        ],
                        "game_items": [
                                    {
                                                "game_type": "artifact_match",
                                                "item_name": "Pashmina Weaving Item",
                                                "match_value": "Crafts",
                                                "image_url": "/pashmina-weaving.jpg"
                                    },
                                    {
                                                "game_type": "memory",
                                                "item_name": "Pashmina Weaving Symbol",
                                                "match_value": "Pashmina Weaving Symbol",
                                                "image_url": "/pashmina-weaving.jpg"
                                    }
                        ]
            },
            {
                        "id": "mp-sanchi-stupa",
                        "name": "Sanchi Buddhist Culture",
                        "category": "Culture",
                        "state": "Madhya Pradesh",
                        "description": "The Great Stupa at Sanchi, commissioned by Emperor Ashoka, representing ancient Buddhist cultural heritage and peace.",
                        "historical_background": "Founded by Mauryan Emperor Ashoka in the 3rd Century BCE, Sanchi contains sacred Buddhist stupas, carved stone gateways (Toranas), and monasteries reflecting peace and enlightened art.",
                        "cover_image": "/sanchi-stupa.jpg",
                        "status": "Active",
                        "chapters": [
                                    {
                                                "chapter_number": 1,
                                                "title": "Sanchi Stupa",
                                                "content": "Commissioned by Mauryan Emperor Ashoka in 3rd Century BCE, the Great Stupa at Sanchi in Madhya Pradesh is India's oldest surviving stone monument and a sanctuary of peace.",
                                                "image_url": "/sanchi-stupa.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 2,
                                                "title": "Buddhist Architecture",
                                                "content": "The hemispherical stone dome (Anda) symbolizes the celestial vault, surrounded by a circumambulatory pathway (Pradakshina Path) and topped by a triple umbrella Harmika.",
                                                "image_url": "/sanchi-stupa.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 3,
                                                "title": "Toranas and Sculptures",
                                                "content": "Four carved stone gateways (Toranas) added during the Satavahana period depict Jataka tales, Salabhanjika tree nymphs, and life stories of Lord Buddha in vivid stone relief.",
                                                "image_url": "/sanchi-stupa.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 4,
                                                "title": "Buddhist Stories and Symbols",
                                                "content": "Early Buddhist art used aniconic symbols: the Lotus flower (birth), Bodhi Tree (enlightenment), Wheel of Law (Dharmachakra), and Footprints (Presence) instead of human figures.",
                                                "image_url": "/sanchi-stupa.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 5,
                                                "title": "Sanchi's Cultural Legacy",
                                                "content": "Recognized as a UNESCO World Heritage Site, Sanchi stands as a timeless beacon of Buddhist art, peaceful philosophy, and ancient Indian architectural genius.",
                                                "image_url": "/sanchi-stupa.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    }
                        ],
                        "quizzes": [
                                    {
                                                "question": "Which Mauryan Emperor originally commissioned the Great Stupa at Sanchi?",
                                                "option_a": "A. Chandragupta Maurya",
                                                "option_b": "B. Emperor Ashoka",
                                                "option_c": "C. Bindusara",
                                                "option_d": "D. Brihadratha",
                                                "correct_answer": "B. Emperor Ashoka",
                                                "explanation": "Emperor Ashoka commissioned the Great Stupa in the 3rd Century BCE."
                                    },
                                    {
                                                "question": "What are the four ornate stone gateways surrounding the Sanchi Stupa called?",
                                                "option_a": "A. Gopurams",
                                                "option_b": "B. Toranas",
                                                "option_c": "C. Vimanas",
                                                "option_d": "D. Shikharas",
                                                "correct_answer": "B. Toranas",
                                                "explanation": "Toranas are the four grand stone gateways facing North, South, East, and West."
                                    },
                                    {
                                                "question": "In which Indian state is the Sanchi Buddhist complex located?",
                                                "option_a": "A. Bihar",
                                                "option_b": "B. Madhya Pradesh",
                                                "option_c": "C. Uttar Pradesh",
                                                "option_d": "D. Maharashtra",
                                                "correct_answer": "B. Madhya Pradesh",
                                                "explanation": "Sanchi is located in Raisen district of Madhya Pradesh."
                                    },
                                    {
                                                "question": "In early Sanchi carvings, how was Lord Buddha symbolically depicted?",
                                                "option_a": "A. Human Statues",
                                                "option_b": "B. Sacred Symbols like Bodhi Tree & Wheel",
                                                "option_c": "C. Gold Idols",
                                                "option_d": "D. Bronze Figures",
                                                "correct_answer": "B. Sacred Symbols like Bodhi Tree & Wheel",
                                                "explanation": "Early Theravada art used aniconic symbols rather than human images."
                                    },
                                    {
                                                "question": "What year was Sanchi designated as a UNESCO World Heritage Site?",
                                                "option_a": "A. 1989",
                                                "option_b": "B. 1972",
                                                "option_c": "C. 2001",
                                                "option_d": "D. 1965",
                                                "correct_answer": "A. 1989",
                                                "explanation": "UNESCO inscribed the Buddhist monuments at Sanchi in 1989."
                                    }
                        ],
                        "game_items": [
                                    {
                                                "game_type": "artifact_match",
                                                "item_name": "Sanchi Buddhist Culture Item",
                                                "match_value": "Culture",
                                                "image_url": "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=800&q=80"
                                    },
                                    {
                                                "game_type": "memory",
                                                "item_name": "Sanchi Buddhist Culture Symbol",
                                                "match_value": "Sanchi Buddhist Culture Symbol",
                                                "image_url": "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=800&q=80"
                                    }
                        ]
            },
            {
                        "id": "mp-khajuraho-festival",
                        "name": "Khajuraho Heritage & Festivals",
                        "category": "Festivals",
                        "state": "Madhya Pradesh",
                        "description": "The World-renowned Khajuraho Temple festival celebrating Indian classical dance forms against ancient stone carvings.",
                        "historical_background": "Built by Chandela rulers between 950 and 1050 CE in Chhatarpur district of Madhya Pradesh, Khajuraho temples celebrate life, art, and spirituality.",
                        "cover_image": "/khajuraho-temple.jpg",
                        "status": "Active",
                        "chapters": [
                                    {
                                                "chapter_number": 1,
                                                "title": "Khajuraho Temples",
                                                "content": "Constructed between 950 and 1050 CE by Chandela Dynasty kings in Madhya Pradesh, Khajuraho temples represent the pinnacle of medieval Indian Nagara temple architecture.",
                                                "image_url": "/khajuraho-temple.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 2,
                                                "title": "Temple Architecture",
                                                "content": "Built from sandstone on elevated plinths, temples like Kandariya Mahadeva feature soaring curvilinear towers (Shikharas) mirroring mountain peaks towards the divine.",
                                                "image_url": "/khajuraho-temple.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 3,
                                                "title": "Sculptures and Stories",
                                                "content": "Stone carvings depict celestial nymphs (Apsaras), musicians, deities, battles, and everyday human emotions with expressive grace and fluid artistic detail.",
                                                "image_url": "/khajuraho-temple.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 4,
                                                "title": "Khajuraho Dance Festival",
                                                "content": "Held every February, the festival features world-renowned dancers performing Kathak, Bharatanatyam, Odissi, and Kuchipudi against illuminated thousand-year-old temples.",
                                                "image_url": "/khajuraho-temple.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    },
                                    {
                                                "chapter_number": 5,
                                                "title": "Khajuraho as World Heritage",
                                                "content": "As a UNESCO World Heritage Site, Khajuraho celebrates India's artistic freedom, spiritual philosophy, and cultural harmony through architectural mastery.",
                                                "image_url": "/khajuraho-temple.jpg",
                                                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_background.ogg"
                                    }
                        ],
                        "quizzes": [
                                    {
                                                "question": "Which royal dynasty built the Khajuraho temple complex between 950 and 1050 CE?",
                                                "option_a": "A. Chandela Dynasty",
                                                "option_b": "B. Chola Empire",
                                                "option_c": "C. Solanki Dynasty",
                                                "option_d": "D. Rashtrakuta Dynasty",
                                                "correct_answer": "A. Chandela Dynasty",
                                                "explanation": "Chandela rulers constructed Khajuraho as their religious capital."
                                    },
                                    {
                                                "question": "What is the largest and most grand temple in the Khajuraho group?",
                                                "option_a": "A. Kandariya Mahadeva Temple",
                                                "option_b": "B. Lakshmana Temple",
                                                "option_c": "C. Chitragupta Temple",
                                                "option_d": "D. Vishwanatha Temple",
                                                "correct_answer": "A. Kandariya Mahadeva Temple",
                                                "explanation": "Kandariya Mahadeva stands 117 feet high with breathtaking sculpted walls."
                                    },
                                    {
                                                "question": "In which month is the famous Khajuraho Dance Festival held annually?",
                                                "option_a": "A. February",
                                                "option_b": "B. October",
                                                "option_c": "C. May",
                                                "option_d": "D. August",
                                                "correct_answer": "A. February",
                                                "explanation": "The festival takes place every February in the open-air temple grounds."
                                    },
                                    {
                                                "question": "What architectural style is displayed by the Khajuraho temple towers?",
                                                "option_a": "A. Nagara Style",
                                                "option_b": "B. Dravidian Style",
                                                "option_c": "C. Vesara Style",
                                                "option_d": "D. Hoysala Style",
                                                "correct_answer": "A. Nagara Style",
                                                "explanation": "Khajuraho is a prime example of North Indian Nagara temple architecture."
                                    },
                                    {
                                                "question": "In which year was Khajuraho designated a UNESCO World Heritage Site?",
                                                "option_a": "A. 1986",
                                                "option_b": "B. 1975",
                                                "option_c": "C. 1999",
                                                "option_d": "D. 2005",
                                                "correct_answer": "A. 1986",
                                                "explanation": "UNESCO added Khajuraho to its World Heritage list in 1986."
                                    }
                        ],
                        "game_items": [
                                    {
                                                "game_type": "artifact_match",
                                                "item_name": "Khajuraho Heritage & Festivals Item",
                                                "match_value": "Festivals",
                                                "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
                                    },
                                    {
                                                "game_type": "memory",
                                                "item_name": "Khajuraho Heritage & Festivals Symbol",
                                                "match_value": "Khajuraho Heritage & Festivals Symbol",
                                                "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
                                    }
                        ]
            }
]

        for tdata in topics_data:
            topic = HeritageTopic(
                id=tdata["id"],
                name=tdata["name"],
                category=tdata["category"],
                state=tdata["state"],
                description=tdata["description"],
                historical_background=tdata["historical_background"],
                cover_image=tdata["cover_image"],
                status=tdata["status"]
            )
            db.session.add(topic)

            for cdata in tdata["chapters"]:
                chapter = StoryChapter(
                    topic_id=tdata["id"],
                    chapter_number=cdata["chapter_number"],
                    title=cdata["title"],
                    content=cdata["content"],
                    image_url=cdata["image_url"],
                    audio_url=cdata["audio_url"]
                )
                db.session.add(chapter)

            for qdata in tdata["quizzes"]:
                quiz = QuizQuestion(
                    topic_id=tdata["id"],
                    question=qdata["question"],
                    option_a=qdata["option_a"],
                    option_b=qdata["option_b"],
                    option_c=qdata["option_c"],
                    option_d=qdata["option_d"],
                    correct_answer=qdata["correct_answer"],
                    explanation=qdata["explanation"]
                )
                db.session.add(quiz)

            for gdata in tdata["game_items"]:
                gitem = GameItem(
                    topic_id=tdata["id"],
                    game_type=gdata["game_type"],
                    item_name=gdata["item_name"],
                    match_value=gdata["match_value"],
                    image_url=gdata["image_url"]
                )
                db.session.add(gitem)

        db.session.commit()
        print("Database seed completed successfully!")

if __name__ == '__main__':
    seed_database()
