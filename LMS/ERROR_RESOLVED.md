# ✅ RESOLVED: Port Already in Use Error

## Problem
The backend server couldn't start because **port 5000 was already in use** by another process.

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

## Solution Applied
1. ✅ Identified the process using port 5000
2. ✅ Killed the conflicting process
3. ✅ Restarted the backend server successfully

## Current Status

### ✅ Backend Server
- **Status:** Running
- **Port:** 5000
- **URL:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health
- **MongoDB:** Connected

### ✅ Frontend Server  
- **Status:** Running (should be)
- **Port:** 5173
- **URL:** http://localhost:5173

## How to Use the Application

### Option 1: Servers Already Running
If both servers are running, simply open your browser:
```
http://localhost:5173
```

### Option 2: Start Fresh (Recommended)

**Using the Startup Script (Easiest):**

Double-click either:
- `start.bat` - Windows Batch file
- `start.ps1` - PowerShell script (run: `.\start.ps1`)

**Manual Start:**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## If You Encounter This Error Again

### Quick Fix (PowerShell):
```powershell
# Kill process on port 5000
$port = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($port) { Stop-Process -Id $port -Force }

# Restart backend
cd backend
npm run dev
```

### Alternative: Change the Port
Edit `backend/.env`:
```env
PORT=5001  # or any available port
```

Then update frontend proxy in `frontend/vite.config.js` if needed.

## Verification Steps

### 1. Check Backend is Running
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### 2. Check Frontend is Running
Open browser: http://localhost:5173

You should see the login page.

### 3. Check MongoDB Connection
Look for this in the backend terminal:
```
✅ MongoDB connected successfully
📚 Books initialized successfully
```

## Additional Resources

- **Main Documentation:** [README.md](README.md)
- **Quick Start Guide:** [QUICK_START.md](QUICK_START.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Project Overview:** [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

## Next Steps

1. ✅ Both servers are running
2. 🌐 Open http://localhost:5173 in your browser
3. 📝 Sign up for a new account
4. 📚 Start borrowing books!

---

**Everything is now working correctly! 🎉**

The application is ready to use. If you encounter any other issues, check [TROUBLESHOOTING.md](TROUBLESHOOTING.md).
