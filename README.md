# FARMAKING AUTOMATION

Premium agri-tech website for customer review video uploads in original HD quality (no WhatsApp compression).

## Stack
- **Frontend:** TanStack Start (React 19) + Tailwind v4 + Framer Motion
- **Backend / DB / Storage / Auth:** Lovable Cloud (Supabase)
- **CDN:** Supabase Storage public bucket (`customer-videos`) — globally distributed

## Pages
| Route | Purpose |
|---|---|
| `/` | Hero, products, testimonials, latest reels |
| `/upload` | Drag-drop video upload (up to 2GB, MP4/MOV/AVI/WEBM) |
| `/gallery` | Public Instagram-style reels grid with autoplay-on-scroll |
| `/contact` | WhatsApp, Instagram, email, embedded map, inquiry form |
| `/admin` | Admin login + dashboard (stats, search, filter, download, delete) |

## Admin credentials (pre-seeded)
```

```
Change it immediately in production from the Lovable Cloud → Users panel.

## Database schema
- `videos` — review submissions (customer_name, mobile, tractor_model, location, written_review, video_url, video_path, file_size, created_at)
- `user_roles` — admin role assignments (uses `has_role()` security-definer function)
- Storage bucket `customer-videos` — public read, public insert, admin-only delete; 5GB max per file.

## Local development
```bash
bun install
bun run dev
```
The `.env` is auto-managed by Lovable Cloud. Required vars:
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

## Deployment

### Vercel
1. Push to GitHub.
2. Import the repo in Vercel.
3. Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Deploy. `vercel.json` handles SPA routing.

### Netlify
- Build command: `vite build`
- Publish directory: `dist`
- Add a `_redirects` file with `/* /index.html 200` for SPA fallback (or use the same `vercel.json` rewrite pattern).
- Add the same env vars.

### Cloudflare / Lovable hosting
Click **Publish** in Lovable — it deploys to a global edge worker automatically.

## Security
- Row-Level Security on all tables.
- Admin actions guarded by `has_role()` SECURITY DEFINER check.
- File type & size validation on upload (client + storage bucket policy).
- Admin signup is disabled (`disable_signup: true`).
- HIBP password leak check enabled.

## Roadmap / Bonus
- AI subtitle generation (wire to Lovable AI Gateway `google/gemini-2.5-flash`)
- Multi-language support (i18n-ready folder structure)
- PWA manifest (drop one in `public/`)
- QR code generator pointing to `/upload`
- Admin push notifications via realtime channel on `videos` table
