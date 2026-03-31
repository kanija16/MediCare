# MediCare - Full Stack Hospital Management System

This project is a complete Full Stack application fulfilling all given syllabus requirements for Web Programming including Vanilla web technologies and ReactJS, alongside a Python FastAPI backend.

## Project Structure

- `backend/` - Python FastAPI backend & SQLite database.
- `frontend-vanilla/` - HTML, CSS, Vanilla JS frontend connecting to the backend.
- `frontend-react/` - Simplified single-file React SPA using CDNs, identical in style.

## Technologies Used

- **Backend**: Python 3, FastAPI, SQLAlchemy, SQLite (Serverless simple DB).
- **Frontend (Vanilla)**: HTML5 Semantic tags, CSS3 (Flexbox/Grid), JavaScript (DOM manipulation, Fetch API).
- **Frontend (React)**: React 18, React Router v6, ES6+ features, functional components, Hooks (`useState`, `useEffect`).

## How to Run the Project Locally

### 1. Setup the Backend
The backend requires Python to be installed on your system.
1. Open up a terminal and navigate to the `backend/` directory.
2. Create a virtual environment (optional but recommended): `python -m venv venv`
3. Activate the environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux).
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn main:app --reload`
The API will run on `http://127.0.0.1:8000`. You can test endpoints via `http://127.0.0.1:8000/docs`.

### 2. Run the Vanilla Frontend
Since this purely uses HTML/CSS/JS, you can simply open the `index.html` file inside the `frontend-vanilla/` directory directly in your web browser. Make sure your FastAPI backend is running!

### 3. Run the React Frontend
This is a simplified React implementation without Node.js tooling.
Due to CORS policies for loading external scripts, you should serve this directory via a local web server (opening the file directly might block `app.js` fetching).
If you have Python installed, navigate to the `MediCare` directory and run:
`python -m http.server 3000`
Then open `http://127.0.0.1:3000/frontend-react/index.html` in your browser.

## Deployment Instructions

### Backend (Render or Railway)
1. Push your code to a GitHub repository.
2. Sign up on [Render.com](https://render.com/).
3. Create a new "Web Service" and link your GitHub repo.
4. Set the Root Directory to `backend`, Build Command to `pip install -r requirements.txt`, and Start Command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.

### Frontends (Netlify or Vercel)
1. Both `frontend-vanilla` and `frontend-react` can be deployed easily since they are static sites.
2. Go to [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/) and link your repository.
3. Configure your Build settings. Set the Publish Directory to `frontend-vanilla` or `frontend-react`.
4. *Remember to change `API_BASE_URL` in both `script.js` and `app.js` to your deployed Render URL before pushing.*
