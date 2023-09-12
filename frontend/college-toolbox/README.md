# Frontend Overview

## 🚀 Project Structure

Inside of the project, you'll see the following folders and files:

```
/
🛬
├── 💧 data
│   └── **/*.json                        # Satic data sources for REST etc.
│
└── src
    │
    ├── 🧱 app
    │   └── **/*.astro                   # Application-wide components
    │
    ├── 🌠 assets
    │   └── **/*.{svg,…}                 # Transformable assets
    │
    ├── 🧱 components
    │   └── **/*.astro                   # Simple, atomic UI elements
    │
    ├── 📚 lib
    │   └── **/*.ts                      # Utilities (Databases, APIs…)
    │
    ├── 🧱 modules
    │   └── **/*.astro                   # Complex views made of elements
    │
    ├── 📑 pages
    │   ├── **/*.astro                   # File-based client routes
    │   │
    │   └── 🌐 api
    │        └── [...entities].ts        # Catch-all endpoint for CRUD ops.
    │
    ├── 🚀 services
    │   └── *.ts                         # Server-side CRUD operations
    │
    └── 📐 types
        └── *.ts                         # Data entities typings

```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `assets/` directory.

## 🧞 Commands

All commands are run from the root of the project (frontend/college-toolbox), from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Installation Steps
### Option 1: Local Development
1. cd into `frontend/college-toolbox`
2. run `npm i`
3. run `npm run dev`
### Option 2: Docker Build
TBA

## Developer Recommendations
1.This project makes extensive use of [Flowbite](https://flowbite.com/docs/getting-started/astro/) for styling and pre-made component. Check if what you need is available on Flowbite before you make it yourself.
2. Familiarize yourself with the ideas behind Astro [Astro in 100 seconds](https://www.youtube.com/watch?v=dsTXcSeAZq8)
