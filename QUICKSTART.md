# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Run Setup (First Time Only)
Double-click `setup.bat` or run in terminal:
```bash
setup.bat
```

This will:
- Install Python dependencies
- Install Node.js dependencies  
- Build the React application

### Step 2: Start the Server

**Production Mode (Recommended):**
```bash
run.bat
```

**Development Mode (for coding):**
```bash
run-dev.bat
```

Or manually:
```bash
cd backend
python app.py
```

### Step 3: Open Your Browser
Navigate to: **http://localhost:8080**

---

## 📱 Navigation

The dashboard has three main sections accessible from the sidebar:

### 🏠 Dashboard
- Real-time safety monitoring
- Heart rate, SpO₂, temperature tracking
- Gas level monitoring
- Live charts and graphs

### 📊 Analytics  
- Key Performance Indicators
- Revenue and expense tracking
- Site performance metrics
- Worker statistics

### 👷 Workers
- Complete worker directory
- Real-time status updates
- Safety score tracking
- Search and filter capabilities

---

## 🛠️ Development Mode

For active development with hot reload:

**Terminal 1** - Backend:
```bash
python app.py
```

**Terminal 2** - Frontend:
```bash
npm run dev
```

Then open: **http://localhost:3000**

---

## ❓ Common Issues

### Port Already in Use?
Edit `app.py` and change the port number:
```python
app.run(debug=True, host='0.0.0.0', port=8080)  # Change 8080 to another port
```

### Build Errors?
Try cleaning and rebuilding:
```bash
rmdir /s /q node_modules
rmdir /s /q static\dist
npm install
npm run build
```

### API Not Working?
Make sure Flask is running on port 8080 (or update the proxy in `vite.config.js`)

---

## 📞 Need Help?

Check the full README.md for detailed documentation.

---

**Mine Gaurd Dashboard** - Built with ❤️ using React + Flask





