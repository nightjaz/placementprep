# PlacementQuest

A local-first, gamified study tracker for placement preparation across DSA, CS fundamentals, and electronics.

PlacementQuest rewards consistent preparation with XP, levels, streaks, calendars, and revision cues. Progress stays in the browser and can be exported as a portable JSON backup. No account or backend is required.

## Features

- DSA problems by topic, difficulty, platform, and revision status
- CS fundamentals: operating systems, DBMS, computer networks, and system design
- Electronics topics, confidence, formulas, subtopics, and numericals
- Daily goals, XP, streaks, heatmap, and all-time progress
- Optional curated 35-day starter curriculum
- Optional strict-mode roasts and accountability views

The default experience is supportive: missing a day can reset a streak, but it never deletes earned XP. The old bootcamp workflow has been retired; historical entries remain readable.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validate changes

```bash
npm run lint
npm run build
```

## Data and privacy

Data is stored under `pq_*` keys in browser `localStorage`. Use **Settings → Your data → Export backup** before clearing browser data or switching devices. Imports accept only PlacementQuest's known storage keys.

## Contributing

Issues and pull requests are welcome. Keep migrations backward-compatible: users may have months of progress in older local-storage shapes. Avoid making a hosted service mandatory for core tracking.

Before publishing publicly, choose and add an explicit open-source license (MIT is a common permissive option) and replace the default favicon/assets.
