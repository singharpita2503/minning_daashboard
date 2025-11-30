from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import requests
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Control room ESP endpoint (configurable via environment variable)
CONTROL_ROOM_ESP_URL = os.getenv('CONTROL_ROOM_ESP_URL', 'http://localhost:5000/alert')

@app.route('/ingest', methods=['POST'])
def ingest():
    data = request.get_json(force=True)
    print(f"📦 Received: {data}")

    # 🔥 Emit to frontend LIVE
    socketio.emit("esp_event", data)

    return jsonify({"status": "ok", "received": data}), 200

@app.route('/send_alert', methods=['POST'])
def send_alert():
    """Send alert or neutral status to control room ESP"""
    try:
        data = request.get_json(force=True)
        alert_type = data.get('type', 'alert')  # 'alert' or 'neutral'
        
        # Prepare alert payload
        alert_payload = {
            'type': alert_type,
            'source': 'dashboard',
            'timestamp': data.get('timestamp'),
            'message': f'Control room alert: {alert_type.upper()} status activated'
        }
        
        # Send to control room ESP
        print(f"🚨 Sending {alert_type} to control room ESP at {CONTROL_ROOM_ESP_URL}")
        response = requests.post(
            CONTROL_ROOM_ESP_URL,
            json=alert_payload,
            timeout=5
        )
        
        # Also emit via socketio for frontend notification
        socketio.emit("control_room_alert", alert_payload)
        
        return jsonify({
            "status": "ok",
            "type": alert_type,
            "sent": alert_payload,
            "esp_response_status": response.status_code
        }), 200
        
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Failed to send alert to control room ESP: {e}")
        # Still emit via socketio even if ESP request fails
        alert_payload = {
            'type': data.get('type', 'alert'),
            'source': 'dashboard',
            'timestamp': data.get('timestamp'),
            'message': f'Control room alert: {data.get("type", "alert").upper()} status activated',
            'error': 'ESP unreachable, but alert logged'
        }
        socketio.emit("control_room_alert", alert_payload)
        
        return jsonify({
            "status": "warning",
            "type": data.get('type', 'alert'),
            "sent": alert_payload,
            "error": str(e)
        }), 200
        
    except Exception as e:
        print(f"❌ Error sending alert: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return {"status": "alive"}

if __name__ == '__main__':
    print("✅ Server running on port 5001")
    print(f"🔗 Control room ESP URL: {CONTROL_ROOM_ESP_URL}")
    socketio.run(app, host='0.0.0.0', port=5001)
