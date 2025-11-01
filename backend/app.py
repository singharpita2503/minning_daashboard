from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/ingest', methods=['POST'])
def ingest():
    data = request.get_json(force=True)
    print(f"📦 Received: {data}")

    # 🔥 Emit to frontend LIVE
    socketio.emit("esp_event", data)

    return jsonify({"status": "ok", "received": data}), 200

@app.route('/health', methods=['GET'])
def health():
    return {"status": "alive"}

if __name__ == '__main__':
    print("✅ Server running on port 5001")
    socketio.run(app, host='0.0.0.0', port=5001)
