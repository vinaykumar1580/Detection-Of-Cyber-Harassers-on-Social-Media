from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack
import string

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model and vectorizer
model = joblib.load(r'C:\Users\Public\cyberharenessinstgaram\flask\model.pkl')
vectorizer = joblib.load(r'C:\Users\Public\cyberharenessinstgaram\flask\vectorizer.pkl')

# Define text preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = text.strip()
    return text

# Map predictions to labels
class_mapping = {0: "Hate Speech", 1: "Offensive", 2: "Neither"}

safe_words = [
    "you are looking cool bro",
    "nice photo bro", "great picture",
    "hello","hi","good morning",
    "good evening",
    "have a nice day",
    "how are you","thank you",
    "please","sorry",
    "gorgeous","beautiful","awesome",
    "You are looking beautiful today",
    "You are looking gorgeous today",
    "fantastic work"
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if not request.is_json:
            return jsonify({"error": "Invalid request. Expected JSON format"}), 400
        
        data = request.get_json()
        if "tweet" not in data:
            return jsonify({"error": "Missing 'tweet' field in request"}), 400
        
        tweet = data["tweet"].strip()
        if not tweet:
            return jsonify({"error": "Tweet text cannot be empty"}), 400

        # Preprocess and vectorize text
        tweet = preprocess_text(tweet)
        
        if tweet in safe_words:
         return jsonify({"prediction": "Neither"})
# Check safe sentences first
        tweet_vectorized = vectorizer.transform([tweet])
        numeric_features = [0, 0, 0]  # Default numeric features
        X_combined = hstack([tweet_vectorized, pd.DataFrame([numeric_features])])

        prediction = model.predict(X_combined)[0]
        return jsonify({"prediction": class_mapping.get(prediction, "Unknown")})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)