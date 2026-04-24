# baby-monitor-frontend

Angular (PWA) frontend for **Luna** — a self-hosted baby tracking application.
Log feedings, sleep, diaper changes, growth, medications and more, all from a
mobile-friendly Progressive Web App that talks to a .NET Web API backend.

> This repository contains **only** the frontend. The API and database live in
> [`baby-monitor-backend`](../baby-monitor-backend).

---

## Tech stack

| Layer       | Technology          |
| ----------- | ------------------- |
| Framework   | Angular 17+         |
| Language    | TypeScript          |
| UI          | Angular Material (planned) |
| PWA         | `@angular/pwa`      |
| HTTP client | Angular `HttpClient`|
| Auth        | JWT stored client-side |
| Package mgr | npm                 |
| Container   | Docker (multi-stage build, served via Nginx) |

## Features (planned)

- Feedings (bottle / left breast / right breast / formula, amount, duration)
- Sleep sessions (start / end, location, notes)
- Diaper changes (pee, poo, mixed)
- Growth tracking (weight, height) with charts
- Medication log (dose, time, reminders)
- Temperature history
- Mood / behaviour log (colic, happy, fussy, etc.)
- Bath log
- PDF export for pediatrician visits
- PWA push notifications (feeding reminders)
- Multi-user support (e.g., mom + dad share the same baby)

## Prerequisites

- Node.js 20+
- npm 10+
- Angular CLI (`npm i -g @angular/cli`)
- A running instance of [`baby-monitor-backend`](../baby-monitor-backend)

## Getting started

> The project scaffold is not committed yet — this is the initial repository
> skeleton. Steps below reflect the planned setup.

```bash
# install dependencies
npm install

# run the dev server (defaults to http://localhost:4200)
ng serve

# production build
ng build --configuration production
```

### Configure the backend URL

Set the API base URL in `src/environments/environment.ts` (dev) and
`src/environments/environment.prod.ts` (prod). Default for local development:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api'
};
```

## Docker

The image is a multi-stage build (Node → Nginx). Build and run locally:

```bash
docker build -t baby-monitor-frontend .
docker run --rm -p 8080:80 baby-monitor-frontend
```

In production the frontend is served together with the backend via the
`docker-compose.yml` in the backend repo.

## Project structure (planned)

```
baby-monitor-frontend/
├── src/
│   ├── app/
│   │   ├── core/           # auth, interceptors, guards
│   │   ├── shared/         # shared components, pipes, directives
│   │   ├── features/       # feedings, sleep, diapers, growth, ...
│   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   └── manifest.webmanifest
├── angular.json
├── package.json
├── Dockerfile
└── README.md
```

## Contributing

This is a personal project, but suggestions and pull requests are welcome.
Please open an issue before starting any significant work.

## License

MIT — see [LICENSE](./LICENSE).
