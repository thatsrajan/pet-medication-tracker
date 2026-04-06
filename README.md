# Pet Medication Tracker

A local-first mobile web app for tracking medication schedules across multiple pets.

## What works
- Add pet profiles with medication instructions
- Auto-generate dose windows from simple schedules
- Mark doses complete for today
- Persist everything in browser localStorage

## Run locally
```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

## Meaningful user path
1. Add a pet and medication schedule
2. See today's dose windows
3. Mark each dose complete without leaving the page

## Known gaps
- No notifications yet
- Photo uploads are not implemented in this MVP
- Data stays in the browser, no sync
