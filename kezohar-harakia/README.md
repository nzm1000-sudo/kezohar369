# כְּזֹהַר הָרָקִיעַ — מרכז תורה, תפילה וטהרה

Landing page in **Bright Minimal Luxury Sacred** style — cream canvas, restrained gold accents, dignified Hebrew typography.

## Quick Start

No build step required. Serve the folder with any static server:

```bash
cd kezohar-harakia
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

> ES modules and Three.js require HTTP — opening `index.html` directly via `file://` will not work.

## File Structure

```
kezohar-harakia/
├── index.html          # Semantic RTL page, all Hebrew content
├── style.css           # Design system + components
├── main.js             # Lenis, GSAP, nav, cursor, clipboard
├── three-hero.js       # Subtle Hero Star of David wireframe
├── assets/icons/       # Minimal gold line-art SVGs
└── README.md
```

## Dependencies (CDN)

| Library    | Version | Purpose                          |
|-----------|---------|----------------------------------|
| Google Fonts | —    | Frank Ruhl Libre, Heebo, Cormorant Garamond |
| Three.js  | 0.160.0 | Hero ambient 3D wireframe        |
| GSAP      | 3.12.5  | Scroll reveals, hero stagger     |
| ScrollTrigger | 3.12.5 | Scroll-driven animations     |
| Lenis     | 1.1.18  | Smooth momentum scroll           |

## Contact & Donation Details

| Field | Value |
|-------|-------|
| Phone | 058-5555530, 053-5470052 |
| Bank | מזרחי טפחות, סניף 428, חשבון 294319 |
| Account name | עמותת חסד יסובבנו |
| Online donation | [נדרים פלוס](https://www.matara.pro/nedarimplus/online/?mosad=5776132) |
| Email | info@zoharharakia.org.il |

## Features

- Full RTL Hebrew layout
- Fixed nav with blur on scroll
- Hero Three.js wireframe Star of David (disabled under `prefers-reduced-motion`)
- GSAP scroll reveals with staggered cards
- Donation amount count-up on scroll
- Bank details copy-to-clipboard with gold toast
- Custom gold cursor (desktop only)
- Mobile fullscreen overlay menu
- WCAG focus states

## Browser Support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). WebGL required for Hero 3D; page degrades gracefully without it.

## License

© 2025 עמותת חסד יסובבנו · כל הזכויות שמורות