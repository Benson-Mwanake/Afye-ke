# AfyaLink KE — Full-Stack Health Management Application

## Learning Goals

- Understand and implement a full-stack architecture using Flask (backend) and React (frontend).

-Learn how to structure, connect, and deploy a production-grade full-stack application.

-Practice managing APIs, authentication, and UI/UX integration for healthcare management.


---

## Introduction
AfyaLink KE is a full-stack health management system built using Flask and React, designed to connect patients, clinics, and administrators in one seamless platform.

#It allows
-Patients to find nearby clinics, book appointments, and check symptoms.
-Clinics to manage appointments, patients, and reports.
-Admins to approve new clinics, manage users, and publish health articles.

```console
$ tree -L 2
$ # the -L argument limits the depth at which we look into the directory structure
.
.
├── client
│   ├── build                # Production-ready compiled React app
│   ├── public               # Static assets and HTML template
│   ├── src
│   │   ├── components       # Reusable UI and feature components
│   │   ├── context          # Global AuthContext for user authentication
│   │   ├── features         # Feature-specific UI like Articles and Profiles
│   │   ├── hooks            # Layouts and protected route utilities
│   │   ├── pages            # All React pages for patients, clinics & admin
│   │   ├── routes           # Routing configuration
│   │   └── services         # API service layer and integrations (e.g., OpenAI)
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── package.json         # React dependencies
├── server
│   ├── app.py               # Flask application entry point
│   ├── config.py            # Flask, SQLAlchemy, and CORS configuration
│   ├── extensions.py        # Flask extensions like db, migrate, api
│   ├── models.py            # SQLAlchemy models (Users, Clinics, Appointments, etc.)
│   ├── routes/              # Modular route files for each resource
│   ├── schemas.py           # Marshmallow schemas for serialization
│   ├── seed.py              # Database seeding script
│   ├── utils.py             # Helper utilities
│   ├── migrations/          # Auto-generated Flask-Migrate versions
│   ├── requirements.txt     # Python package dependencies
│   ├── Procfile             # Deployment process (Gunicorn)
│   └── runtime.txt          # Python version for deployment
└── LICENSE.md, CONTRIBUTING.md, Pipfile

```




## Setup

### `server/`
-Navigate into the server directory and install dependencies:
-To download the dependencies for the backend server, run:

```console
pipenv install
pipenv shell
```

You can run your Flask API on [`localhost:5555`](http://localhost:5555) by
running:

```console
python server/app.py
```

Check that your server serves the default route `http://localhost:5555`. You
should see a web page with the heading "Project Server".

### `client/`

The `client/` directory contains all of your frontend code. The file
`package.json` has been configured with common React application dependencies,
include `react-router-dom`. The file also sets the `proxy` field to forward
requests to `"http://localhost:5555". Feel free to change this to another port-
just remember to configure your Flask app to use another port as well!

To download the dependencies for the frontend client, run:

```console
npm install --prefix client
```

You can run your React app on [`localhost:3000`](http://localhost:3000) by
running:

```sh
npm start --prefix client
```

Check that your the React client displays a default page
`http://localhost:3000`. You should see a web page with the heading "Afya-Link KE".

## Generating Your Database

```sh
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

```
## Seed initial data
```sh
python seed.py

```


```console
cd server
```

Then enter the commands to create the `instance` and `migrations` folders and
the database `app.db` file:

```
flask db init
flask db upgrade head
```

##Key Technologies

#Backend
Flask

Flask-RESTful

Flask-Migrate

Flask-CORS

SQLAlchemy

Marshmallow

#Frontend
React (Vite)

React Router DOM

Tailwind CSS

Context API

Lucide Icons

Axios

##Deployment
-This was deployed on Render(backend) and Netlify(frontend)

#Backend
Push your Flask app to GitHub.

Create a new Render Web Service.

Use pip install -r requirements.txt for build.

Set environment variables (DATABASE_URL, etc.).

#Frontend
Push the React app to GitHub.

Create a new Vercel project.

Ensure the build command is npm run build and output directory is client/build.

##License
This project is licensed under the MIT License — see the LICENSE.md
 file for details.

 ##Author
 AfyaLink KE — Built  by Benson Mwanake, Lillian Cherono and Jesse Mwendwa Ndunda
Empowering healthcare through technology.


