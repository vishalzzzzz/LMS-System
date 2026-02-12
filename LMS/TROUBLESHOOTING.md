# Troubleshooting Guide

## Common Issues and Solutions

### 1. Port Already in Use Error

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution (Windows PowerShell):**
```powershell
# Find and kill the process using port 5000
$port = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($port) { Stop-Process -Id $port -Force }
```

**Solution (Alternative - Change Port):**
Edit `backend/.env` and change the port:
```env
PORT=5001
```

### 2. Frontend Port Already in Use

**Error:** Vite can't start on port 5173

**Solution:**
Vite will automatically try the next available port (5174, 5175, etc.)

### 3. MongoDB Connection Error

**Error Message:**
```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solutions:**
1. Make sure MongoDB is running:
   ```bash
   # Start MongoDB service (Windows)
   net start MongoDB
   ```

2. Check your MongoDB URI in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://admin:admin@127.0.0.1:27017/MyLMS?authSource=admin
   ```

3. If using MongoDB Atlas, update the connection string with your credentials

### 4. CSS Tailwind Warnings in VSCode

**Warning:** "Unknown at rule @tailwind"

**Solution:**
These are just IntelliSense warnings and won't affect the app. To suppress them:

1. Install Tailwind CSS IntelliSense extension
2. Or add to `.vscode/settings.json`:
```json
{
  "css.lint.unknownAtRules": "ignore"
}
```

### 5. Dependencies Issues

**Error:** Module not found or dependency issues

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 6. Cannot Login/Signup

**Issue:** Getting 401 or connection errors

**Checklist:**
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] MongoDB is connected
- [ ] Check browser console for errors

### 7. CORS Errors

**Error:** "Access-Control-Allow-Origin" error

**Solution:**
The backend is configured for `http://localhost:5173`. If your frontend is on a different port, update `backend/server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:5174', // Update to your frontend port
  credentials: true
}));
```

### 8. JWT Token Issues

**Error:** "Not authorized" or token expired

**Solution:**
1. Logout and login again
2. Clear browser localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```

## Quick Health Check

### Check Backend
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### Check Frontend
Open browser: `http://localhost:5173`

Should see the login page.

## Startup Checklist

1. ✅ MongoDB is running
2. ✅ Port 5000 is free (backend)
3. ✅ Port 5173 is free (frontend)
4. ✅ `.env` file exists in backend
5. ✅ `node_modules` installed in both folders

## Starting the Application

**Option 1: Using separate terminals**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**Option 2: Using PowerShell script**

Create `start.ps1` in the LMS root folder:
```powershell
# Start backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
# Start frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

Then run:
```bash
.\start.ps1
```

## Clean Restart

If everything is broken, try this:

```bash
# Stop all Node processes
taskkill /F /IM node.exe

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Frontend (new terminal)
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Getting Help

1. Check the console output in both terminals
2. Check browser developer console (F12)
3. Verify all environment variables in `.env`
4. Ensure MongoDB is accessible

## Success Indicators

### Backend Running Successfully:
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
📚 Books initialized successfully
```

### Frontend Running Successfully:
```
  VITE v5.0.8  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

If you see both of these, your application is ready to use! 🎉
