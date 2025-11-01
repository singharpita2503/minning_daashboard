# Mining Dashboard - Backend

This is the backend API for the Mining Dashboard, built with Flask.

## Features

- RESTful API endpoints
- Mock data generation for mining safety parameters
- Serves the built React frontend
- CORS support for development

## Technology Stack

- **Flask** - Python web framework
- **Python 3.x** - Programming language

## Getting Started

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

### Running the Server

```bash
# Start the Flask server (http://localhost:8080)
python app.py
```

The server will start on `http://localhost:8080` and serve both the API and the frontend application.

## API Endpoints

### GET /latest

Returns the latest mining safety data for all workers.

**Response:**
```json
{
  "timestamp": "2025-10-30 12:40:12",
  "heartRate": 85,
  "spo2": 98,
  "temperature": 36.8,
  "mq9": 145,
  "mq135": 287
}
```

### GET /

Serves the React frontend application.

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
└── templates/          # HTML templates (if needed)
```

## Configuration

The backend is configured to:
- Run on port 8080
- Serve static files from `../frontend/static/dist`
- Enable debug mode for development
- Listen on all network interfaces (0.0.0.0)

## Development

For development, you can modify the mock data generation in `app.py` or add new API endpoints as needed.

### Adding New Endpoints

```python
@app.route('/your-endpoint')
def your_endpoint():
    return jsonify({"data": "your data"})
```

## Production Deployment

For production deployment:

1. Set `debug=False` in `app.py`
2. Use a production WSGI server like Gunicorn
3. Configure proper environment variables
4. Set up HTTPS/SSL
5. Configure firewall rules

Example with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:8080 app:app
```





