import os
import sys
import unittest
from unittest.mock import patch

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class TestBackendConfig(unittest.TestCase):
    def setUp(self):
        # Clear config from sys.modules to allow re-importing under test
        if 'config' in sys.modules:
            del sys.modules['config']

    def test_missing_all_required_variables_raises_runtime_error(self):
        with patch.dict(os.environ, {}, clear=True), patch('dotenv.load_dotenv', return_value=None):
            with self.assertRaises(RuntimeError) as ctx:
                import config
            error_msg = str(ctx.exception)
            self.assertIn("Missing required environment variable(s)", error_msg)
            self.assertIn("SECRET_KEY", error_msg)
            self.assertIn("DATABASE_URL", error_msg)
            self.assertIn("JWT_SECRET_KEY", error_msg)

    def test_missing_secret_key_raises_runtime_error(self):
        env = {
            'DATABASE_URL': 'postgresql://test_user:test_pass@localhost:5432/test_db',
            'JWT_SECRET_KEY': 'test_jwt_secret'
        }
        with patch.dict(os.environ, env, clear=True), patch('dotenv.load_dotenv', return_value=None):
            with self.assertRaises(RuntimeError) as ctx:
                import config
            self.assertIn("SECRET_KEY", str(ctx.exception))

    def test_missing_database_url_raises_runtime_error(self):
        env = {
            'SECRET_KEY': 'test_secret',
            'JWT_SECRET_KEY': 'test_jwt_secret'
        }
        with patch.dict(os.environ, env, clear=True), patch('dotenv.load_dotenv', return_value=None):
            with self.assertRaises(RuntimeError) as ctx:
                import config
            self.assertIn("DATABASE_URL", str(ctx.exception))

    def test_missing_jwt_secret_key_raises_runtime_error(self):
        env = {
            'SECRET_KEY': 'test_secret',
            'DATABASE_URL': 'postgresql://test_user:test_pass@localhost:5432/test_db'
        }
        with patch.dict(os.environ, env, clear=True), patch('dotenv.load_dotenv', return_value=None):
            with self.assertRaises(RuntimeError) as ctx:
                import config
            self.assertIn("JWT_SECRET_KEY", str(ctx.exception))

    def test_valid_configuration_loads_and_normalizes_postgres_scheme(self):
        env = {
            'SECRET_KEY': 'test_secret',
            'DATABASE_URL': 'postgresql://test_user:test_pass@localhost:5432/test_db',
            'JWT_SECRET_KEY': 'test_jwt_secret',
            'PORT': '5001'
        }
        with patch.dict(os.environ, env, clear=True), patch('dotenv.load_dotenv', return_value=None):
            import config
            self.assertEqual(config.Config.SECRET_KEY, 'test_secret')
            self.assertEqual(config.Config.JWT_SECRET_KEY, 'test_jwt_secret')
            self.assertEqual(config.Config.PORT, 5001)
            self.assertEqual(
                config.Config.SQLALCHEMY_DATABASE_URI,
                'postgresql+psycopg2://test_user:test_pass@localhost:5432/test_db'
            )

if __name__ == '__main__':
    unittest.main()
