# Deploy Guide

## Local Run

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Recommended Deployment Shape

- Runtime: Node.js 18+
- Entry point: `server.js`
- Static files: `index.html`, `styles.css`, `app.js`, `assets/*`
- API routes:
  - `/api/market`
  - `/api/news`

## Notes

- This dashboard should be opened through the Node server, not with `file:///.../index.html`.
- Latest market/news values are fetched on the server side first, which is more deployment-friendly than direct browser scraping.
- Some external data sources can still rate-limit or change structure, so production deployment should add caching and monitoring later.
