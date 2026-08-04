# Lesson Room

Lesson Room gives teachers password-protected lesson libraries and provides students with public, unguessable links to published lessons. Lesson records live in PocketBase on this VM. Backgrounds and objects are versioned static assets described by JSON manifests.

## Run locally

Install the PocketBase 0.39.8 Linux binary at `.pocketbase/pocketbase`, then run these in separate terminals:

```bash
bun run db
bun run dev
```

The website runs on port `8000`. Vite proxies `/api` and the PocketBase dashboard at `/_/` to PocketBase on `127.0.0.1:8090`.

Create the first PocketBase administrator with:

```bash
./.pocketbase/pocketbase superuser create EMAIL PASSWORD --dir=./pb_data
```

Teacher accounts can register through the website. Administrators configure lesson records through `http://localhost:8000/_/`.

## Lesson records

Choose a teacher, enter a name and short description, and reference IDs from the static manifests. Generate a share token with at least 20 URL-safe characters. Only published records can be opened by students.

Example values:

```json
{
  "backgroundId": "riverside-living-room",
  "objects": [
    { "objectId": "shirt", "x": 57, "y": 32 },
    { "objectId": "knife", "x": 42, "y": 66, "scale": 1.1, "rotation": -12 }
  ],
  "shareToken": "riverside-demo-V7kP2x9LmQ4w",
  "published": true
}
```

Coordinates are percentages relative to the background. Optional `scale` and `rotation` values adjust individual objects.

## Static assets

- Background metadata: `public/assets/backgrounds/manifest.json`
- Background images: `public/assets/backgrounds/<id>/`
- Object metadata: `public/assets/objects/manifest.json`
- Object images: `public/assets/objects/<id>/`

Add an asset folder and its manifest entry together. Lesson records store only stable asset IDs.

## Persistence and backup

PocketBase stores its SQLite database and uploaded files in the ignored `pb_data/` directory. Stop PocketBase before manually copying this directory for a consistent backup. The committed `pb_migrations/` directory reproduces the collection schema but does not contain account or lesson data.
