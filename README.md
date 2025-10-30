# Mining Dashboard - Mine Gaurd

A modern, real-time mining safety dashboard built with React and Flask.

## Features

- 🎨 Modern UI with sidebar navigation and top navbar
- 📊 Real-time monitoring of mining safety parameters
- 📈 Interactive charts and analytics
- 👷 Worker management and tracking
- 🔍 Advanced filtering and search capabilities
- 📱 Fully responsive design
- 🎯 Mining company logo integration

## Tech Stack

### Frontend
- React 18.3
- Vite (Build tool)
- Tailwind CSS (Styling)
- React Router (Navigation)
- Recharts (Data visualization)
- Lucide React (Icons)

### Backend
- Flask (Python web framework)
- Real-time data simulation

## Project Structure

```
minning_dashboard/
├── frontend/           # Frontend application
│   ├── src/           # React source files
│   │   ├── components/  # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/      # Page components
│   │   │   ├── Analytics.jsx
│   │   │   ├── Workers.jsx
│   │   │   └── WorkerDetail.jsx
│   │   ├── App.jsx     # Main app component
│   │   ├── main.jsx    # Entry point
│   │   └── index.css   # Global styles
│   ├── public/         # Static assets
│   │   └── logo.png    # Mine Gaurd logo
│   ├── static/         # Build output
│   ├── package.json    # Node dependencies
│   ├── vite.config.js  # Vite configuration
│   └── tailwind.config.js
├── backend/            # Backend application
│   ├── app.py         # Flask backend
│   ├── requirements.txt # Python dependencies
│   └── templates/     # HTML templates
├── setup.bat          # Setup script
├── run.bat            # Production run script
└── run-dev.bat        # Development run script
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- npm or yarn

### Quick Setup (Windows)

Simply run the setup script:
```bash
setup.bat
```

This will automatically:
- Install Python dependencies
- Install Node.js dependencies
- Build the React application

### Manual Setup

1. **Install Backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

2. **Install Frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Build the React application**
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

## Running the Application

### Production Mode (Recommended)

Run the application with the built React frontend:
```bash
run.bat
```
Then open http://localhost:8080 in your browser.

### Development Mode

Run both frontend and backend in development mode:
```bash
run-dev.bat
```
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

**Or manually:**

Terminal 1 - Start Flask backend:
```bash
cd backend
python app.py
```

Terminal 2 - Start Vite dev server:
```bash
cd frontend
npm run dev
```

## Pages

### Dashboard
- Real-time monitoring of heart rate, SpO₂, temperature, and gas levels
- Interactive line charts showing trends
- Live data updates every 2 seconds
- Status indicators for all metrics

### Analytics
- Key Performance Indicators (KPIs)
- Site performance comparison
- Revenue and expense tracking
- Worker statistics
- Advanced filtering options

### Workers
- Complete worker directory
- Real-time status tracking
- Safety score monitoring
- Contact information
- Certification tracking
- Advanced search and filtering

## API Endpoints

### GET /latest
Returns the latest mining safety data in JSON format.

**Response:**
```json
{
  "timestamp": "2025-10-29 12:30:45",
  "heartRate": 85,
  "spo2": 98,
  "temperature": 36.8,
  "mq9": 150,
  "mq135": 320
}
```

## Customization

### Changing Colors
Edit `frontend/tailwind.config.js` to customize the color scheme:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Adding New Pages
1. Create a new component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add menu item in `frontend/src/components/Sidebar.jsx`

## Building for Production

```bash
cd frontend
npm run build
```

This will create optimized production files in `frontend/static/dist/` directory.

## Troubleshooting

### Port Already in Use
If port 8080 is already in use, modify `backend/app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=YOUR_PORT)
```

### React Build Issues
Clear the build cache:
```bash
cd frontend
rm -rf static/dist
npm run build
```

### Module Not Found Errors
Reinstall dependencies:
```bash
cd frontend
rm -rf node_modules
npm install
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

## Support

For support, contact your system administrator.

---

**Mine Gaurd** - Real-time Mining Safety Monitoring System
