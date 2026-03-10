# Location + Weather Saver (Vercel Ready)

This project:
- gets the user's current location automatically,
- finds place name + weather,
- saves entries through API routes,
- shows an eye-catching weather card + map.

## Project Structure

- `index.html` — frontend UI and auto location flow
- `server.js` — local Express server (for `npm start`)
- `api/locations.js` — serverless GET locations route
- `api/save-location.js` — serverless POST save route
- `api/weather.js` — serverless weather route (OpenWeather with Open-Meteo fallback)
- `api/_storage.js` — storage helper (Vercel KV or memory fallback)
- `vercel.json` — Vercel config

## Local Run

1. Install dependencies:

```bash
npm install
```

2. (Optional) Set OpenWeather key in PowerShell:

```powershell
$env:OPENWEATHER_API_KEY="YOUR_OPENWEATHER_KEY"
```

3. Start app:

```bash
npm start
```

4. Open:

- `http://localhost:3000/index.html`

## Deploy to Vercel

1. Push this folder to GitHub.
2. In Vercel, **Add New Project** and import the repo.
3. (Optional but recommended) Add environment variables in Vercel Project Settings:

- `OPENWEATHER_API_KEY` (optional)
- `KV_REST_API_URL` (required for persistent location storage)
- `KV_REST_API_TOKEN` (required for persistent location storage)

4. Deploy.

## Storage Behavior

- **With Vercel KV configured**: saved locations persist across deployments/restarts.
- **Without Vercel KV**: API uses in-memory fallback (data resets on cold start/redeploy).

## Weather Behavior

- Uses **OpenWeather** when `OPENWEATHER_API_KEY` exists.
- Falls back to **Open-Meteo** if key is missing or provider call fails.

## API Endpoints

- `GET /api/locations`
- `POST /api/save-location`
- `GET /api/weather?lat=<value>&lon=<value>`
