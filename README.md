# Austin Croucher — Portfolio

My personal site. React 18 + Vite, plain CSS with custom properties, no UI libraries.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to /build
```

## Layout

- `src/data/content.js` holds all copy and project data. Edit this to change what the site says.
- `src/components/` has one component per section.
- `src/styles/tokens.css` has the colour, type and spacing tokens for light and dark themes.
- `public/games/` holds the two playable Retro Rumble games (plain canvas, no build step).
- `public/media/` holds the demo videos.
