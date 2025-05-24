# mushroom-identification-frontend

A Vue 3/Vite/Tailwind CSS frontend for mushroom identification, created as a bachelor project by Anders Emil Bergan and Jens Martin Jahle.

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Environment Variables](#environment-variables)
* [Installation](#installation)
* [Running Locally](#running-locally)
* [Running with Docker](#running-with-docker)
* [Building for Production](#building-for-production)
* [Previewing Production Build](#previewing-production-build)
* [Running Tests](#running-tests)
* [Project Structure](#project-structure)
* [Routes](#routes)
* [Contributing](#contributing)
* [License](#license)

## Features

* Submit mushroom identification requests with multi-step image uploads and comments.
* Anonymous user tracking via reference codes.
* Admin dashboard for processing requests, managing administrators, and exporting statistics.
* Role-based authentication for users and admins.
* Internationalization (Norwegian & English).
* Light and dark theme support.
* Toast notifications for real-time feedback.

## Tech Stack

* **Framework:** Vue 3
* **Build Tool:** Vite
* **State Management:** Pinia
* **Routing:** Vue Router 4
* **Styling:** Tailwind CSS
* **Charts:** Chart.js & vue-chartjs
* **HTTP Client:** Axios
* **Notifications:** Vue Toastification
* **Testing:** Vitest & Testing Library
* **Containerization:** Docker & Docker Compose

## Prerequisites

* [Node.js](https://nodejs.org) v16+ and npm v8+ (or Yarn)
* [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)

## Environment Variables

Copy the example `.env` files and adjust for your setup:

```bash
cp .env
```

Then edit:

```dotenv
# .env.local (development)
VITE_API_URL=http://localhost:8080  # Backend API URL for development
```

## Installation

Install dependencies:

```bash
npm install
```

## Running Locally

Start the dev server with hot reloading:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

## Running with Docker

### Production-like (no hot reloading)

Build and run with Docker Compose:

```bash
docker-compose up --build
```

Access the app at `http://localhost:5173`.

## Building for Production

Generate optimized static assets:

```bash
npm run build
```

## Previewing Production Build

Locally preview the production build:

```bash
npm run preview
```

## Running Tests

### Unit Tests

We use Vitest and Testing Library for unit and component tests.

- Run tests:
    ```bash
    npm run test:unit
    ```
- Coverage report:
    ```bash
    npm run test:unit -- --coverage
    ```

### End-to-End Tests (Cypress)

Cypress is used for end-to-end testing to ensure the application works across full user flows.
>Note: The frontend must be running for Cypress tests to work.

- Install Cypress:
    ```bash
    npm install cypress --save-dev
    ```


- Interactive Mode (opens the Cypress Test Runner GUI):
    ```bash
    npm run cypress:open
    ```

- Headless Mode (runs all tests in the terminal):
    ```bash
    npm run cypress:run
    ```

## Project Structure

```
.
├── public/                # Static assets (index.html, favicon, etc.)
├── src/
│   ├── assets/            # Fonts, CSS, images
│   ├── components/        # Reusable Vue components
│   ├── composables/       # Vue 3 composition utilities
│   ├── layouts/           # AppUserLayout & AppAdminLayout
│   ├── locales/           # i18n setup and translation files
│   ├── router/            # Vue Router configuration
│   ├── store/             # Pinia stores
│   ├── utils/             # Helper functions and formatters
│   ├── views/             # Page-level components (user & admin)
│   ├── App.vue            # Root component
│   └── main.js            # Entry point
├── .env                   # Dev environment variables
├── docker-compose.yml     # Docker Compose config
├── package.json           # Scripts & dependencies
└── README.md              # This documentation
```

## Routes

### Public (User)

| Path             | Name          | Description                                   |
| ---------------- | ------------- | --------------------------------------------- |
| `/`              | home          | Landing page                                  |
| `/new`           | new-request   | Submit a new mushroom request                 |
| `/request/:id`   | user-request  | View status & chat for a submitted request    |
| `/login`         | user-login    | Enter reference code to retrieve your request |
| `/become-member` | become-member | Membership signup page                        |
| `/support`       | support       | Support & FAQ page                            |

### Admin

| Path                    | Name                    | Description                          |
| ----------------------- | ----------------------- | ------------------------------------ |
| `/admin/login`          | admin-login             | Admin login page                     |
| `/admin/dashboard`      | admin-dashboard         | Admin overview & quick actions       |
| `/admin/all-requests`   | admin-all-requests      | List of all pending requests         |
| `/admin/request/:id`    | admin-request           | Review & complete a specific request |
| `/admin/statistics`     | admin-statistics        | Stats dashboard & CSV export         |
| `/admin/management`     | admin-management        | List of administrators               |
| `/admin/management/new` | admin-new-administrator | Create a new administrator           |
| `/admin/settings`       | admin-settings          | Account & application settings       |

## Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
