# The Story We Once Wrote 📖

A premium, cinematic, romantic digital memory book dedicated to the journey of you and **Dinsagi ❤️**. 

This website is designed with a dark, theater-like atmosphere, utilizing warm gold accents, romantic pink highlights, elegant serif headings, and interactive scrolling animations. It is completely responsive, lightweight, and built using semantic HTML5, modern CSS3 transitions, and vanilla JavaScript.

---

## 📂 Project Structure

```
/lovestory
│
├── index.html          # Core layout & textual narrative
├── style.css           # Styling system, responsive masonry grid & keyframes
├── script.js           # Particle engine, typewriter, scroll reveals & lightbox modal
│
├── assets/
│   ├── images/         # Placeholders for photos (meeting, tea, memories)
│   ├── videos/         # Placeholders for videos
│   └── music/          # Ambient background music track (ambient/instrumental)
│
└── README.md           # This instruction document
```

---

## 🎨 Design System & Animation Details
- **Colors**: Deep obsidian dark backgrounds (`#0a0a0a`), soft pink accents (`#ff8da1`), and glowing gold highlights (`#d4af37`).
- **Typography**: Google Fonts loaded automatically:
  - *Playfair Display* for cinematic, emotional serif headings.
  - *Plus Jakarta Sans* for clean, legible body text.
  - *Caveat* for a natural handwriting look in the letter section.
- **Micro-animations**:
  - **Canvas Starfield**: Slow floating particle engine that reacts subtly to mouse movements.
  - **Typewriter Effect**: The love letter types itself letter-by-letter only when scrolled into view.
  - **Divergent Path split**: Custom CSS vector line splits to represent separating directions.
  - **Lazy-Load SVG overlays**: If photos are missing or loading slowly, custom modern vector drawings display instantly to keep the site looking beautiful.

---

## 📸 How to Add Your Photos, Videos, and Music

To replace the placeholders with your actual memories, simply save your files in the `assets/` folders using the names and formats specified below:

### 1. Photos (`assets/images/`)
Drop your JPG or PNG files into `assets/images/` and name them exactly as shown:
* `gallery-1.jpg` – Presec Tamale Campus days (vertical portrait preferred)
* `gallery-2.jpg` – Warm tea sharing memory (tall vertical portrait preferred)
* `gallery-3.jpg` – Walk in Tamale evenings (landscape or square preferred)
* `gallery-4.jpg` – Caring eyes / tears of joy when sick (vertical portrait preferred)
* `gallery-5.jpg` – Nursing college transition / Gushiegu (square or vertical preferred)
* `gallery-6.jpg` – Sweet simplicity / laughing together (tall vertical portrait preferred)

*Note: The gallery uses a Pinterest-style masonry layout, meaning a mix of tall portraits and wider landscape images will look incredibly beautiful.*

### 2. Short Video Memories (`assets/videos/`)
Save your video clips in MP4 format here:
* `memory-1.mp4` – Walks / Outskirts of campus clip
* `memory-2.mp4` – Shared laughter / silly selfie recording clip

### 3. Background Music (`assets/music/`)
Save an ambient piano or romantic instrumental track here:
* `romantic-piano.mp3`

*(Once you drop this file in, visitors can click the floating music icon in the bottom-right corner to hear the soundtrack play in the background.)*

---

## 💻 How to Run the Website Locally

You do not need a compiler or database. You can run it immediately in two ways:
1. **Directly**: Double-click `index.html` to open it in your browser.
2. **Local Server (Recommended)**: Use a tool like VS Code's "Live Server" extension, or run `npx serve` in this directory to serve it locally.

---

## 🚀 How to Deploy the Website Online (For Free)

To share this link or save it permanently on the web, choose one of these simple hosting methods:

### Option A: Vercel (Easiest)
1. Go to [Vercel's drag-and-drop deploy](https://vercel.com/import/project).
2. Drag the entire `/lovestory` folder directly into the web interface.
3. Vercel will build and launch your site, providing you with a free public URL (e.g., `our-story.vercel.app`) in under 30 seconds.

### Option B: Netlify (Drag and Drop)
1. Visit [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the `/lovestory` folder into the box.
3. Your site is instantly live with a custom shareable link.

### Option C: GitHub Pages
1. Push this folder to a public repository on GitHub.
2. Go to **Settings** -> **Pages** in your repository.
3. Under **Build and deployment**, set the source to **Deploy from a branch**, choose `main` (or `master`), and click **Save**.
