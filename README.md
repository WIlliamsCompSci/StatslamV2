## StatSlam

StatSlam is a cloud-powered web application designed for the Ateneo Golden Knights to track, store, and analyze basketball statistics with speed, accuracy, and accessibility. It modernizes the team’s workflow by replacing traditional paper-based and Excel-dependent methods with a centralized, cloud-hosted platform that ensures secure and real-time data access anytime, anywhere.

With StatSlam, coaches, players, and game officials can record detailed in-game stats such as field goals, three-pointers, free throws, rebounds, assists, turnovers, and steals. These statistics are stored in a cloud database, ensuring data integrity, automatic backup, and multi-user accessibility.

### Project structure

- **Root (`StatSlam/`)**
  - npm workspace root (`package.json`) with workspaces: `frontend`, `backend`
  - Shared dev tooling (Vite, Tailwind, PostCSS, etc.)
  - Firebase Hosting configuration (`firebase.json`)
- **`frontend/`**
  - Vite + React app (UI, routing, dashboards)
  - Uses Firebase Firestore for data
- **`backend/`**
  - Node/Express API with MongoDB (optional; used for server-side operations under `/api/…`)

### Environment variables (Vite + Firebase)

Create a `.env` file in `frontend/` (already gitignored) with:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

These are consumed in `frontend/src/firebase.js` using `import.meta.env.*` and are required for the app to connect to your Firebase project.

### Firestore data model

The frontend currently reads from two Firestore collections:

- **Collection: `players`**
  - Used by `SearchPlayer` for roster search.
  - Suggested document fields:
    - `name`: string – player full name (e.g. `"Gil Jose Penaflor"`)
    - `email`: string – contact email (e.g. `"gpenaflor@gbox.adnu.edu.ph"`)
    - `position`: string – position label (e.g. `"Center"`)
    - `number`: number – jersey number (e.g. `26`)
    - `lastGame`: string – last game date or descriptor (e.g. `"02/06/25"`)

- **Collection: `masterStats`**
  - Used by `MasterStats` to render the stats table.
  - Each document should contain:
    - `name`: string – player name and/or jersey tag (e.g. `"Abrasaldo #10"`)
    - `team`: string – team name (e.g. `"USI FALCONS"`)
    - `pts`: number – total points
    - `fga`: number – field goals attempted
    - `fgm`: number – field goals made
    - `fgPct`: string or number – field goal percentage (e.g. `"20.0%"` or `0.2`)
    - `threePa`: number – 3-point attempts
    - `threePm`: number – 3-point makes
    - `threePct`: string or number – 3P percentage
    - `fta`: number – free throws attempted

You can adapt/add fields as needed; the frontend currently expects the keys above and displays them in the Master Stats table.

### Development

Backend (Express + MongoDB):

```bash
cd backend
npm install       # first time only
npm run dev       # http://localhost:4000
```

Frontend (Vite + React):

```bash
cd frontend
npm install       # first time only
npm run dev       # http://localhost:5173
```

### Build and deploy (Firebase Hosting)

Build the frontend:

```bash
cd frontend
npm run build
```

Deploy from the project root (after `firebase login` and selecting your project):

```bash
firebase deploy
```
