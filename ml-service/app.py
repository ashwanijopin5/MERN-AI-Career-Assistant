from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

CORS(app, origins=[
    "http://localhost:8000",
    "http://localhost:5173"
])


from routes.score import score_bp
from routes.similarity import similarity_bp
app.register_blueprint(score_bp, url_prefix='/ml')
app.register_blueprint(similarity_bp, url_prefix='/ml')

@app.route('/health')
def health():
    return {
        "status": "ML service running",
        "success": True
    }

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port)