# 📋 NIVESH AI - COMPLETE SETUP GUIDE

## ⏱️ Estimated Time: 2-3 hours

Follow these steps EXACTLY in order. Don't skip any step.

---

## ✅ PART 1: PRE-REQUISITES (30 minutes)

### Step 1.1: Install Python 3.11

**Windows:**
1. Go to https://www.python.org/downloads/
2. Download Python 3.11.x (latest 3.11 version)
3. Run installer
4. ✅ CHECK "Add Python to PATH"
5. Click "Install Now"
6. Verify:
   ```cmd
   python --version
   ```
   Should show: `Python 3.11.x`

**Mac:**
```bash
brew install python@3.11
```

**Linux:**
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv
```

### Step 1.2: Install Node.js 18+

**Windows:**
1. Go to https://nodejs.org/
2. Download LTS version (18.x or higher)
3. Run installer
4. Accept all defaults
5. Verify:
   ```cmd
   node --version
   npm --version
   ```

**Mac:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 1.3: Install PostgreSQL

**Option A: Using Docker (Recommended - Easiest)**

1. Install Docker Desktop:
   - Windows/Mac: https://www.docker.com/products/docker-desktop/
   - Linux: https://docs.docker.com/engine/install/

2. Verify Docker:
   ```bash
   docker --version
   ```

**Option B: Direct Install**

- Windows: https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql@15`
- Linux: `sudo apt install postgresql-15`

### Step 1.4: Install Git

**Windows:**
- Download from https://git-scm.com/download/win

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

Verify:
```bash
git --version
```

---

## ✅ PART 2: GET THE CODE (5 minutes)

### Step 2.1: Download Project

**Option A: From ZIP (if you have the files)**
1. Extract nivesh-ai.zip to a folder (e.g., `C:\Projects\nivesh-ai`)

**Option B: From GitHub**
```bash
git clone https://github.com/yourusername/nivesh-ai.git
cd nivesh-ai
```

### Step 2.2: Verify Files

Make sure you have these folders:
```
nivesh-ai/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

---

## ✅ PART 3: START DATABASE (10 minutes)

### Step 3.1: Start PostgreSQL with Docker

Open terminal in `nivesh-ai` folder:

```bash
docker-compose up -d
```

Wait 30 seconds, then verify:
```bash
docker ps
```

You should see `nivesh-postgres` running.

### Step 3.2: Test Database Connection

**Windows:**
```cmd
docker exec -it nivesh-postgres psql -U postgres -d nivesh_ai -c "SELECT 1;"
```

**Mac/Linux:**
```bash
docker exec -it nivesh-postgres psql -U postgres -d nivesh_ai -c "SELECT 1;"
```

Should show:
```
 ?column? 
----------
        1
```

**If Database Won't Start:**
- Check Docker Desktop is running
- Try: `docker-compose down` then `docker-compose up -d` again

---

## ✅ PART 4: SETUP BACKEND (30 minutes)

### Step 4.1: Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### Step 4.2: Activate Virtual Environment

**Windows Command Prompt:**
```cmd
venv\Scripts\activate
```

**Windows PowerShell:**
```powershell
venv\Scripts\Activate.ps1
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal.

### Step 4.3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

This takes 5-10 minutes. If errors:
- Try: `pip install --upgrade pip` first
- Then: `pip install -r requirements.txt` again

### Step 4.4: Create .env File

```bash
cp .env.example .env
```

**On Windows (if cp doesn't work):**
```cmd
copy .env.example .env
```

### Step 4.5: Initialize Database

```bash
python -c "from app.database import init_db; init_db()"
```

Should show: No errors (silence is success)

### Step 4.6: Create Models Folder

```bash
mkdir models
```

**On Windows:**
```cmd
md models
```

---

## ✅ PART 5: SETUP FRONTEND (15 minutes)

### Step 5.1: Install Node Modules

```bash
cd ../frontend
npm install
```

Takes 3-5 minutes.

**If errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Step 5.2: Create .env.local (Optional)

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

---

## ✅ PART 6: RUN THE APPLICATION (10 minutes)

### Step 6.1: Start Backend

Open **Terminal 1** in `backend` folder:

```bash
# Activate venv first
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Run server
uvicorn app.main:app --reload
```

Should show:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

✅ Backend is running!

### Step 6.2: Test Backend

Open browser: `http://localhost:8000/docs`

You should see FastAPI Swagger UI.

### Step 6.3: Start Frontend

Open **Terminal 2** in `frontend` folder:

```bash
npm run dev
```

Should show:
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

✅ Frontend is running!

### Step 6.4: Test Frontend

Open browser: `http://localhost:3000`

You should see Nivesh AI homepage (even if empty initially).

---

## ✅ PART 7: LOAD INITIAL DATA (30 minutes)

### Step 7.1: Fetch Stock Data

1. Open `http://localhost:8000/docs`
2. Find section: **Data Management**
3. Click on **POST /api/v1/data/fetch-multiple**
4. Click **"Try it out"**
5. Leave request body empty (uses default NIFTY stocks)
6. Click **"Execute"**

**Wait 2-3 minutes** - it's downloading 5 years of data!

### Step 7.2: Check Results

Scroll down to Response. Should show:
```json
{
  "total_stocks": 20,
  "successful": 20,
  "failed": 0,
  "results": [...]
}
```

### Step 7.3: Refresh Frontend

1. Go to `http://localhost:3000`
2. Refresh page (F5)
3. You should now see 20 stocks!

---

## ✅ PART 8: TRAIN MODEL & GENERATE PREDICTIONS (30 minutes)

### Step 8.1: Train Initial Model

In **Terminal 3** (backend folder, venv activated):

```bash
cd app/ml
python model_trainer.py
```

This will:
1. Download RELIANCE.NS data
2. Calculate features
3. Train Linear Regression model
4. Save model to `models/` folder

Should see output like:
```
Training samples: 800, Test samples: 200
Linear Regression - MAE: 2.4567, RMSE: 3.1234, Accuracy: 68%
Model saved to: ./models/linear_regression_day_20240207_153045.joblib
```

### Step 8.2: Generate Predictions via API

1. Go to `http://localhost:8000/docs`
2. Find **POST /api/v1/predictions/{ticker}/generate**
3. Try it out
4. Enter ticker: `RELIANCE.NS`
5. Execute

Should show:
```json
{
  "ticker": "RELIANCE.NS",
  "predictions_generated": 2,
  "predictions": [...]
}
```

### Step 8.3: View Predictions on Frontend

1. Go to `http://localhost:3000`
2. Click on **RELIANCE.NS**
3. You should see:
   - Price chart
   - Next Day Prediction
   - Next Week Prediction

🎉 **SUCCESS! Your platform is fully working!**

---

## ✅ PART 9: PUSH TO GITHUB (15 minutes)

### Step 9.1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `nivesh-ai`
3. Description: `AI-Powered Stock Market Prediction Platform`
4. Select: **Public** (for portfolio)
5. DO NOT initialize with README (we have one)
6. Click **"Create repository"**

### Step 9.2: Initialize Git

In `nivesh-ai` folder:

```bash
git init
git add .
git commit -m "Initial commit: Nivesh AI Stock Prediction Platform"
```

### Step 9.3: Push to GitHub

Replace `yourusername` with your GitHub username:

```bash
git remote add origin https://github.com/yourusername/nivesh-ai.git
git branch -M main
git push -u origin main
```

### Step 9.4: Verify on GitHub

1. Go to https://github.com/yourusername/nivesh-ai
2. Refresh page
3. You should see all your files!

---

## 🎯 TESTING CHECKLIST

Before you say "it works", verify ALL of these:

- [ ] Backend runs without errors: `http://localhost:8000/docs` works
- [ ] Frontend loads: `http://localhost:3000` shows homepage
- [ ] At least 20 stocks appear on homepage
- [ ] Can click on a stock (e.g., RELIANCE.NS)
- [ ] Stock detail page shows price chart
- [ ] Can generate predictions (button works)
- [ ] Predictions display correctly
- [ ] No console errors in browser (F12 → Console tab)
- [ ] GitHub repo is public and visible

---

## 🆘 TROUBLESHOOTING

### Backend won't start
```bash
# Check Python version
python --version  # Must be 3.11.x

# Check if venv is activated
# You should see (venv) in terminal

# Try reinstalling dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install

# Try different port
npm run dev -- -p 3001
```

### Database connection error
```bash
# Restart Docker containers
docker-compose down
docker-compose up -d

# Check if running
docker ps
```

### "No stocks appearing"
```bash
# Make sure you ran data fetch
# Check backend terminal for errors
# Try fetching again via API docs
```

### Model training fails
```bash
# Make sure models folder exists
mkdir models

# Try with single stock first
cd backend/app/ml
python -c "from data_fetcher import DataFetcher; df = DataFetcher().fetch_stock_data('RELIANCE.NS'); print(len(df))"

# Should show: Fetched XXX records
```

---

## 📞 NEED HELP?

If stuck, check:
1. All terminal windows for error messages
2. Browser console (F12) for JavaScript errors
3. README.md for additional troubleshooting

---

## ✅ NEXT STEPS (After Setup Works)

1. **Add more stocks:**
   - Use API to fetch individual tickers
   - Explore NSE stock list

2. **Train more models:**
   - Experiment with Random Forest
   - Try different time horizons

3. **Customize frontend:**
   - Change colors in `globals.css`
   - Add more charts

4. **Deploy online:**
   - Heroku, Railway, or Render for backend
   - Vercel or Netlify for frontend

---

**Remember:** If something doesn't work, DON'T PANIC!
- Read error messages carefully
- Check you followed ALL steps
- Google the specific error
- Try the troubleshooting section

Good luck! 🚀
