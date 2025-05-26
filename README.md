# Mushroom Identification Frontend

Vue 3 / Vite / Tailwind CSS interface for the Mushroom Identification System  
(Bachelor thesis – Anders Emil Bergan & Jens Martin Jahle)

---
## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
  - [Step 1 – Configure env.js](#step-1--configure-envjs)
  - [Step 2 – Install Dependencies](#step-2--install-dependencies)
  - [Step 3 – Start Dev Server](#step-3--start-dev-server)
- [Production Deployment (Docker)](#production-deployment-docker)
  - [Recipe A – Default (fallback)](#recipe-a--default-fallback)
  - [Recipe B – Override API URL](#recipe-b--override-api-url)
- [Route Overview](#route-overview)
- [Running Tests](#running-tests)
- [License](#license)


---

## Features
- Submit mushroom ID requests with multi‑image upload & comments
- Anonymous tracking via reference codes
- Admin dashboard: review, classify, export statistics
- i18n (English / Norwegian) & light/dark theme

## Tech Stack
| Layer            | Choice                    |
| ---------------- | ------------------------- |
| Framework        | Vue 3                     |
| Build Tool       | Vite                     |
| State            | Pinia                    |
| Styling          | Tailwind CSS             |
| Charts           | Chart.js + vue‑chartjs   |
| Notifications    | Vue Toastification       |
| Tests            | Vitest & Cypress         |
| Containerisation | Docker & Docker Compose  |

## Project Structure
```
public/            # Static assets ‑‑ env.js lives here
src/               # Vue components, views, store, router …
runtime-env.sh     # Only runs in Docker to OPTIONAL override env.js
Dockerfile         # Multi‑stage build (builder + slim runtime)
docker-compose.yml # Production recipe
```

---

## Running Locally

### Step 1 – Configure env.js
`public/env.js` holds the **fallback** backend URL:
```js
window.env = {
  VITE_API_URL: 'http://localhost:8080'   // change if your backend runs elsewhere
};
```

### Step 2 – Install Dependencies
```bash
npm install
```

### Step 3 – Start Dev Server
```bash
npm run dev
```
Open <http://localhost:5173>.

---

## Production Deployment (Docker)

### Recipe A – Default (fallback)
Uses the value already baked into `dist/env.js`.

```bash
docker compose up --build -d   # build image, start container
```
open http://localhost:5173     # app talks to URL from env.js

### Recipe B – Override API URL
Only if the backend URL is **not** the one in `env.js`.
>Note: For production, it is recommended to set the backend URL via environment variable in the operation system.

```bash
# Bash / zsh
export VITE_API_URL=https://api.my‑backend.com
docker compose up --build -d

# PowerShell
$Env:VITE_API_URL = 'https://api.my‑backend.com'
docker compose up --build -d
```

- `runtime-env.sh` detects `VITE_API_URL` and rewrites `/app/env.js` **once** at container start.
- No variable → script exits → fallback remains.

---
## Route Overview

### Public / User Routes
| Path                           | Name           | Guards          | Description                          |
| ------------------------------ | -------------- | --------------- | ------------------------------------ |
| `/`                            | home           | –               | Landing page                         |
| `/new`                         | new‑request    | –               | Submit a new identification request  |
| `/request/:userRequestId`      | user‑request   | requiresUser    | View status & chat for a request     |
| `/become-member`               | become‑member  | –               | Membership information               |
| `/support`                     | support        | –               | FAQ & support                        |
| `/login`                       | user‑login     | –               | Retrieve request via reference code  |

### Admin Routes (under `/admin`) – requireAdmin
| Path                                    | Name                    | Description                          |
| --------------------------------------- | ----------------------- | ------------------------------------ |
| `/admin/dashboard`                      | admin‑dashboard         | Admin overview & quick actions       |
| `/admin/requests/:userRequestId`        | admin‑request           | Review & complete a specific request |
| `/admin/requests`                       | admin‑all‑requests      | List all pending requests            |
| `/admin/statistics`                     | admin‑statistics        | Processing statistics & exports      |
| `/admin/management`                     | admin‑management        | Administrator accounts               |
| `/admin/new`                            | admin‑new‑administrator | Create a new administrator           |
| `/admin/settings`                       | admin‑settings          | Application & account settings       |

### Stand‑alone Admin Login
| Path            | Name        |
| --------------- | ----------- |
| `/admin/login`  | admin‑login |

### Catch‑All Redirect
`/:pathMatch(.*)*` → `/`

## Running Tests

### 1 – Unit & Component Tests (Vitest)

| Action            | Command                                   |
| ----------------- | ----------------------------------------- |
| Run all tests     | npm run test:unit                         |
| Watch mode        | npm run test:unit -- --watch              |
| Coverage report   | npm run test:unit -- --coverage           |
| Open coverage UI  | open coverage/index.html   # mac / Linux  |
|                   | start coverage\index.html  # Windows     |

### 2 – End‑to‑End Tests (Cypress)

Prerequisite: the frontend (or a built preview) must be running on **http://localhost:5173**.

| Mode            | Command                                                | Notes                                |
| --------------- | ------------------------------------------------------ | ------------------------------------ |
| Interactive GUI | npm run cypress:open                                   | Opens Cypress Test Runner            |
| Headless        | npm run cypress:run                                    | Runs all specs in terminal           |
| Single spec     | npm run cypress:run -- --spec "cypress/e2e/login.cy.js" | Run one test file                    |

---

## License
This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for full details.
