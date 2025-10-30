from flask import Flask, send_from_directory, jsonify
import random
import datetime
import os

app = Flask(__name__, static_folder='../frontend/static/dist', static_url_path='')

# Simulate mining safety data
def generate_mock_data():
    """Generate realistic mock data for mining safety parameters"""
    return {
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "heartRate": random.randint(70, 100),  # Normal range: 60-100 bpm
        "spo2": random.randint(95, 100),       # Normal range: 95-100%
        "temperature": round(random.uniform(36.0, 37.5), 1),  # Normal range: 36-37.5°C
        "mq9": random.randint(100, 200),       # Gas sensor reading
        "mq135": random.randint(200, 400)      # Air quality sensor reading
    }

@app.route('/')
def index():
    """Serve the React application"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files from React build"""
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # For React Router - serve index.html for all non-existing paths
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/latest')
def latest():
    """API endpoint that returns the latest mining safety data"""
    return jsonify(generate_mock_data())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)



