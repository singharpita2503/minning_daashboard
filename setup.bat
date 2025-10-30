@echo off
echo ========================================
echo Mining Dashboard Setup Script
echo ========================================
echo.

echo Installing Python dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo Error installing Python dependencies!
    pause
    exit /b 1
)
echo Python dependencies installed successfully!
cd ..
echo.

echo Installing Node.js dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Error installing Node.js dependencies!
    pause
    exit /b 1
)
echo Node.js dependencies installed successfully!
echo.

echo Building React application...
call npm run build
if errorlevel 1 (
    echo Error building React application!
    pause
    exit /b 1
)
echo React application built successfully!
cd ..
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the application, run: run.bat
echo Then open http://localhost:8080 in your browser
echo.
pause





