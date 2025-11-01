# Project Reorganization - Migration Notes

## Date: October 30, 2025

## Summary of Changes

This document outlines the reorganization of the Mining Dashboard project into separate frontend and backend folders.

## New Project Structure

```
minning_dashboard/
├── frontend/                    # All frontend-related files
│   ├── src/                    # React source code
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/                 # Static assets
│   ├── static/dist/            # Build output
│   ├── node_modules/           # Node dependencies
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── README.md              # Frontend documentation
│
├── backend/                    # All backend-related files
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── templates/             # Flask templates
│   └── README.md             # Backend documentation
│
├── setup.bat                  # Setup script (updated)
├── run.bat                    # Production run script (updated)
├── run-dev.bat               # NEW: Development mode script
├── README.md                  # Main documentation (updated)
├── QUICKSTART.md             # Quick start guide (updated)
└── MIGRATION_NOTES.md        # This file

```

## Files Moved

### To Frontend Folder:
- `src/` → `frontend/src/`
- `public/` → `frontend/public/`
- `static/` → `frontend/static/`
- `node_modules/` → `frontend/node_modules/`
- `package.json` → `frontend/package.json`
- `package-lock.json` → `frontend/package-lock.json`
- `index.html` → `frontend/index.html`
- `vite.config.js` → `frontend/vite.config.js`
- `tailwind.config.js` → `frontend/tailwind.config.js`
- `postcss.config.js` → `frontend/postcss.config.js`

### To Backend Folder:
- `app.py` → `backend/app.py`
- `requirements.txt` → `backend/requirements.txt`
- `templates/` → `backend/templates/`

## Configuration Updates

### 1. backend/app.py
- Updated static folder path: `static_folder='../frontend/static/dist'`
- Now correctly points to the frontend build output

### 2. setup.bat
- Updated to navigate into backend folder for Python setup
- Updated to navigate into frontend folder for Node setup
- Builds the frontend in the correct location

### 3. run.bat
- Updated to navigate into backend folder before running
- Maintains same functionality for production mode

### 4. run-dev.bat (NEW)
- Created new script for development mode
- Starts backend server on port 5000
- Starts frontend dev server on port 3000
- Opens both in separate command windows

## New Files Created

1. **frontend/README.md** - Frontend-specific documentation
2. **backend/README.md** - Backend-specific documentation
3. **run-dev.bat** - Development mode runner
4. **MIGRATION_NOTES.md** - This file

## Updated Files

1. **README.md** - Updated with new project structure
2. **QUICKSTART.md** - Updated with new commands
3. **setup.bat** - Updated paths
4. **run.bat** - Updated paths
5. **backend/app.py** - Updated static folder path

## How to Use the New Structure

### For Production:
```bash
# Setup (first time)
setup.bat

# Run
run.bat

# Access at http://localhost:8080
```

### For Development:
```bash
# Setup (first time)
setup.bat

# Run in dev mode
run-dev.bat

# Access frontend at http://localhost:3000
# Backend API at http://localhost:5000
```

### Manual Commands:

**Frontend:**
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Development server
npm run build        # Build for production
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt  # Install dependencies
python app.py                    # Start server
```

## Benefits of New Structure

1. **Clear Separation** - Frontend and backend code is clearly separated
2. **Independent Development** - Each part can be developed independently
3. **Easier Deployment** - Can deploy frontend and backend separately if needed
4. **Better Organization** - Easier to find files and understand project structure
5. **Scalability** - Easier to add new features or microservices in the future

## Backward Compatibility

- All existing functionality remains the same
- Same URLs and ports
- Same API endpoints
- No changes to the actual application code (only file locations)

## Important Notes

1. **Path References**: All path references have been updated in configuration files
2. **Build Output**: Frontend builds to `frontend/static/dist/`
3. **Backend Serves**: Backend serves files from `../frontend/static/dist/`
4. **Development**: Use `run-dev.bat` for active development
5. **Production**: Use `run.bat` for production deployment

## Testing Checklist

- [x] Setup script installs all dependencies
- [x] Production mode (run.bat) works correctly
- [x] Development mode (run-dev.bat) works correctly
- [x] Frontend builds successfully
- [x] Backend serves frontend correctly
- [x] API endpoints work correctly
- [x] Dark/light mode toggle works
- [x] Worker name updates work
- [x] All pages load correctly

## Troubleshooting

### Issue: "Module not found" errors
**Solution:** Run setup.bat again to reinstall dependencies in correct locations

### Issue: Backend can't find static files
**Solution:** Ensure you've built the frontend with `cd frontend && npm run build`

### Issue: Port conflicts
**Solution:** Check if ports 3000, 5000, or 8080 are already in use

## Next Steps (Optional)

Consider these improvements for the future:

1. Add environment variables for configuration
2. Create Docker containers for easy deployment
3. Add automated tests for both frontend and backend
4. Set up CI/CD pipeline
5. Add database integration
6. Implement real-time WebSocket communication

---

**Note:** All original functionality has been preserved. This is purely a structural reorganization for better project management.








