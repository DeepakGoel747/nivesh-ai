# 🚀 NIVESH AI - SETUP WITHOUT DOCKER (Windows 10 Pro)

## ✅ For VMware Users Who Can't Run Docker

This guide sets up the project using **local PostgreSQL** instead of Docker.

---

## 📋 PART 1: INSTALL POSTGRESQL (30 minutes)

### Step 1.1: Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click **"Download the installer"**
3. Download **PostgreSQL 15.x** (latest 15 version)
4. File will be named like: `postgresql-15.x-windows-x64.exe`

### Step 1.2: Install PostgreSQL

1. **Run the installer** (as Administrator)
2. **Installation Directory**: Accept default (`C:\Program Files\PostgreSQL\15`)
3. **Select Components**: Check all (PostgreSQL Server, pgAdmin, Command Line Tools)
4. **Data Directory**: Accept default
5. **Password**: Set a password you'll remember
   - Example: `postgres` (simple for local dev)
   - **WRITE THIS DOWN!** ✍️
6. **Port**: Keep default `5432`
7. **Locale**: Default (your language)
8. Click **Next** through rest, then **Finish**

### Step 1.3: Verify PostgreSQL is Running

1. Open **Services** (Win + R, type `services.msc`)
2. Find **postgresql-x64-15** in the list
3. Status should be **Running**
4. If not, right-click → **Start**

### Step 1.4: Test Connection

Open **Command Prompt** (cmd):

```cmd
cd "C:\Program Files\PostgreSQL\15\bin"
psql -U postgres
```

Enter the password you set.

If you see `postgres=#`, it works! Type `\q` to exit.

---

## 📋 PART 2: CREATE DATABASE (5 minutes)

### Option A: Using Command Line

```cmd
cd "C:\Program Files\PostgreSQL\15\bin"
psql -U postgres
```

Then in psql:
```sql
CREATE DATABASE nivesh_ai;
\q
```

### Option B: Using pgAdmin (GUI)

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Connect to **PostgreSQL 15**
3. Right-click **Databases** → **Create** → **Database**
4. Name: `nivesh_ai`
5. Click **Save**

### Step 2.2: Verify Database Exists

```cmd
cd "C:\Program Files\PostgreSQL\15\bin"
psql -U postgres -l
```

You should see `nivesh_ai` in the list.

---

## 📋 PART 3: UPDATE BACKEND CONFIGURATION (5 minutes)

### Step 3.1: Edit .env File

Navigate to your project folder:
```cmd
cd C:\Projects\nivesh-ai\backend
```

Edit the `.env` file (use Notepad, VS Code, or any text editor):

**OLD (Docker version):**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nivesh_ai
```

**NEW (Your version):**
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/nivesh_ai
```

**Replace `YOUR_PASSWORD`** with the password you set during PostgreSQL installation.

Example:
```
DATABASE_URL=postgresql://postgres:mypassword123@localhost:5432/nivesh_ai
```

### Step 3.2: Remove Redis Configuration

In the same `.env` file, comment out or remove Redis:

```
# REDIS_URL=redis://localhost:6379/0
```

The project will work fine without Redis (it's only for caching, which is optional).

---

## 📋 PART 4: INSTALL PYTHON & DEPENDENCIES (20 minutes)

### Step 4.1: Install Python 3.11

1. Go to: https://www.python.org/downloads/
2. Download **Python 3.11.x** (latest 3.11)
3. Run installer
4. ✅ **IMPORTANT: Check "Add Python to PATH"**
5. Click **Install Now**

Verify:
```cmd
python --version
```
Should show: `Python 3.11.x`

### Step 4.2: Create Virtual Environment

```cmd
cd C:\Projects\nivesh-ai\backend
python -m venv venv
```

### Step 4.3: Activate Virtual Environment

```cmd
venv\Scripts\activate
```

You should see `(venv)` in your command prompt.

### Step 4.4: Install Dependencies

```cmd
pip install --upgrade pip
pip install -r requirements.txt
```

**This takes 5-10 minutes.**

**If you get errors:**
- Make sure venv is activated (you see `(venv)`)
- Try: `pip install -r requirements.txt --no-cache-dir`

---

## 📋 PART 5: INITIALIZE DATABASE (5 minutes)

With venv activated:

```cmd
cd C:\Projects\nivesh-ai\backend
python -c "from app.database import init_db; init_db()"
```

**No output = success!**

### Step 5.1: Verify Tables Created

```cmd
cd "C:\Program Files\PostgreSQL\15\bin"
psql -U postgres -d nivesh_ai
```

Then:
```sql
\dt
```

You should see tables like:
- stocks
- price_data
- features
- predictions
- model_metadata

Type `\q` to exit.

---

## 📋 PART 6: CREATE MODELS FOLDER (1 minute)

```cmd
cd C:\Projects\nivesh-ai\backend
mkdir models
```

---

## 📋 PART 7: INSTALL NODE.JS & FRONTEND (15 minutes)

### Step 7.1: Install Node.js

1. Go to: https://nodejs.org/
2. Download **LTS version** (18.x or 20.x)
3. Run installer
4. Accept all defaults

Verify:
```cmd
node --version
npm --version
```

### Step 7.2: Install Frontend Dependencies

```cmd
cd C:\Projects\nivesh-ai\frontend
npm install
```

Takes 3-5 minutes.

---

## 📋 PART 8: RUN THE APPLICATION (5 minutes)

### Step 8.1: Start Backend

**Terminal 1** (Command Prompt):

```cmd
cd C:\Projects\nivesh-ai\backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Should show:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

✅ **Backend is running!**

Test: Open browser → `http://localhost:8000/docs`

### Step 8.2: Start Frontend

**Terminal 2** (New Command Prompt):

```cmd
cd C:\Projects\nivesh-ai\frontend
npm run dev
```

Should show:
```
- ready started server on 0.0.0.0:3000
```

✅ **Frontend is running!**

Test: Open browser → `http://localhost:3000`

---

## 📋 PART 9: LOAD DATA & GENERATE PREDICTIONS

### Step 9.1: Fetch Stock Data

1. Open `http://localhost:8000/docs`
2. Find **POST /api/v1/data/fetch-multiple**
3. Click **"Try it out"**
4. Click **"Execute"**
5. **Wait 2-3 minutes**

### Step 9.2: Train Model

**Terminal 3**:

```cmd
cd C:\Projects\nivesh-ai\backend
venv\Scripts\activate
cd app\ml
python model_trainer.py
```

Wait for model to train (1-2 minutes).

### Step 9.3: Generate Predictions

1. Go to `http://localhost:8000/docs`
2. **POST /api/v1/predictions/RELIANCE.NS/generate**
3. Execute

### Step 9.4: View in Frontend

1. Go to `http://localhost:3000`
2. Refresh (F5)
3. Click on **RELIANCE.NS**
4. See predictions! 🎉

---

## ✅ VERIFICATION CHECKLIST

- [ ] PostgreSQL installed and running
- [ ] Database `nivesh_ai` created
- [ ] Python 3.11 installed
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Database initialized (tables created)
- [ ] Node.js installed
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Stock data loaded (20 stocks)
- [ ] Model trained
- [ ] Predictions visible

---

## 🆘 TROUBLESHOOTING

### PostgreSQL Won't Start

**Check Services:**
1. Win + R → `services.msc`
2. Find `postgresql-x64-15`
3. Right-click → **Start**

**If still fails:**
- Reboot computer
- Reinstall PostgreSQL

### Can't Connect to Database

**Wrong Password:**
```
DATABASE_URL=postgresql://postgres:CORRECT_PASSWORD@localhost:5432/nivesh_ai
```

**PostgreSQL Not Running:**
- Check Services (Win + R → `services.msc`)
- Start `postgresql-x64-15`

### Python Import Errors

**Make sure venv is activated:**
```cmd
venv\Scripts\activate
```

You should see `(venv)` before your prompt.

**Reinstall dependencies:**
```cmd
pip install -r requirements.txt --force-reinstall
```

### Frontend Errors

**Delete and reinstall:**
```cmd
cd C:\Projects\nivesh-ai\frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Port Already in Use

**Backend (8000):**
```cmd
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /F /PID <PID>
```

**Frontend (3000):**
```cmd
# Use different port
npm run dev -- -p 3001
```

---

## 🎯 KEY DIFFERENCES FROM DOCKER VERSION

| Feature | Docker Version | Your Version |
|---------|---------------|--------------|
| PostgreSQL | Docker container | Local Windows install |
| Redis | Docker container | Disabled (optional) |
| Setup | `docker-compose up` | Install PostgreSQL manually |
| Portability | Easy (Docker) | Windows-specific |

---

## 💡 ADVANTAGES OF THIS SETUP

✅ **No Docker conflicts** with VMware
✅ **Better performance** (native Windows)
✅ **Easier debugging** (direct access to DB)
✅ **Persistent data** (survives restarts)
✅ **pgAdmin included** (visual DB management)

---

## 🚀 YOU'RE ALL SET!

Your project now runs **WITHOUT Docker** using:
- Local PostgreSQL on Windows
- Python virtual environment
- Node.js for frontend

Everything else works exactly the same!

---

## 📝 QUICK REFERENCE

**Start Backend:**
```cmd
cd C:\Projects\nivesh-ai\backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

**Start Frontend:**
```cmd
cd C:\Projects\nivesh-ai\frontend
npm run dev
```

**Access Database:**
```cmd
cd "C:\Program Files\PostgreSQL\15\bin"
psql -U postgres -d nivesh_ai
```

**Check PostgreSQL Status:**
- Win + R → `services.msc` → Find `postgresql-x64-15`

---

**Ready to start?** Follow this guide step-by-step and you'll have everything running without Docker! 🎉
