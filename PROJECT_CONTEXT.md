# Project Context: Social Capital Analyzer (Relationship Manager)

**Last Updated:** 2026-01-31
**Status:** Local Development Focus (Web Deployment paused)

## 1. Project Overview
This project is a **Relationship Management System** designed to visualize social capital in a 3D space. It allows users to track contacts based on three specific dimensions, helping to analyze and categorize relationships.

**Core Philosophy:**
- **Visual Analytics:** Using a 3D scatter plot to intuitively understand relationship distribution.
- **Three Dimensions of Relationship:**
  - **Value (X-axis):** What value does this relationship bring? (0-10)
  - **Energy (Y-axis):** How much energy does this relationship require/provide? (0-10)
  - **Access (Z-axis):** How accessible is this person? (0-10)

## 2. Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS, Framer Motion (animations)
- **Icons:** Lucide React
- **3D Visualization:** 
  - `three` (Three.js)
  - `@react-three/fiber` (React renderer for Three.js)
  - `@react-three/drei` (Helpers for R3F)

### Backend (Local Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (`server/database.sqlite`)
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt

## 3. Architecture & Data Flow

**Client-Server Model:**
- **Frontend:** Runs on port `5173` (default Vite). Proxies API requests to backend.
- **Backend:** Runs on port `3001`. Serves API endpoints at `/api/...`.

**Data Flow:**
1.  **Auth:** User logs in/registers -> Token stored in React Context (`AuthContext`).
2.  **State:** `ContactsContext` fetches data from `/api/contacts` using the token.
3.  **Visualization:** `ThreeScene.jsx` reads from `ContactsContext` to render 3D spheres.
4.  **Logic:** `utils/logic.js` handles categorization (e.g., "High Value", "Draining") based on X,Y,Z thresholds managed in `SettingsContext`.

## 4. Database Schema (`server/db.js`)

- **Users:** `id` (PK), `username`, `password_hash`, `created_at`
- **Contacts:** 
  - `id` (PK, UUID)
  - `user_id` (FK)
  - `name` (Text)
  - `x`, `y`, `z` (Real, 0-10 scores)
  - `note` (Text)
  - `category` (Text, calculated field stored for caching)
- **Settings:**
  - `user_id` (FK)
  - `config` (JSON string containing thresholds for categorization)

## 5. Key Components

- **`src/components/ThreeScene.jsx`**: 
  - The core visualization.
  - Renders a 3D coordinate system (GridBox).
  - Maps Contact X/Y/Z data (0-10) to World Coordinates (-5 to +5).
  - Interactive spheres (`DataPoint`) display details on hover.
- **`src/context/ContactsContext.jsx`**:
  - Manages CRUD operations.
  - Syncs state with Backend API.
  - Optimistic UI updates for better performance.
- **`src/context/SettingsContext.jsx`**:
  - Manages custom thresholds for categorization (e.g., what defines "High Value"?).

## 6. Development Workflow

**Starting the Project:**
1.  **Backend:** `cd server && npm start` (or `node index.js`) -> Port 3001
2.  **Frontend:** `npm run dev` -> Port 5173

**Note on Mobile/Network Access:**
To access from mobile on the same network:
1.  Find local IP (e.g., `ipconfig` -> `192.168.x.x`).
2.  Update `src/config.js` to point `API_BASE_URL` to `http://<YOUR_IP>:3001`.
3.  Access via `http://<YOUR_IP>:5173`.

## 7. Future Deployment Strategy
*Originally attempted web deployment via Netlify/Render, but faced complexity issues. Current strategy is to perfect the application locally first.*
- **Cleaned Up:** Removed `netlify.toml`, `render.yaml`.
- **Goal:** Develop fully as a local web-app first. Deployment will be revisited later, possibly as a self-hosted Docker container or a packaged Electron app if web hosting remains problematic.
