from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from routers.router import router
from logging_utils import init_request_logging

load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(","))

init_request_logging(app, "soa-login")
app.register_blueprint(router)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    app.run(host="0.0.0.0", port=port, debug=False)
