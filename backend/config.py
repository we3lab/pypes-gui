import os

UPLOAD_DATA_TYPES = ["other_data", "scada_data"]
FOLDER_STRUCTURE = ["billing_data", "other_data", "processing_data", "networks_data", "params_data", "scada_data",
                    "models_data", "simulation_results"]

ENV = os.environ.get("ENV", "dev")

if ENV == "dev":
    API_KEY = "mysecretapi"
    JWT_SECRET = "mysecretkey"
    DB_HOST = "localhost"
    DB_PORT = "5432"
    DB_NAME = "stanford_local"
    DB_USER = "postgres"
    DB_PASS = "pwd12345"
else:
    API_KEY = os.environ.get("API_KEY")
    JWT_SECRET = os.environ.get("JWT_SECRET")
    DB_HOST = os.environ.get("DB_HOST")
    DB_PORT = os.environ.get("DB_PORT")
    DB_NAME = os.environ.get("DB_NAME")
    DB_USER = os.environ.get("DB_USER")
    DB_PASS = os.environ.get("DB_PASS")