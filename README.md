# Happy 25th Nishma! — Birthday Website

**Notion-style version** (current): Sidebar navigation, clean blocks, and a softer palette (lavender, pink, sky blue, cream, mint). Same three sections and all wish videos.

**Backup (original):** The previous dark theme with tab bar is in the **`backup/`** folder. Open `backup/index.html` to view it.

---

A three-section birthday site for Nishma:

1. **Home** — "Happy Birthday Nishma!" with 25 celebratory emojis and popping text.
2. **Iconic Moments** — Photos and videos of Nishma over the years.
3. **Wishes & Music** — Spotify playlist + 20 birthday wish videos (click a card to play in a modal).

---

## How to view the site

1. **Open in browser**  
   Double-click `index.html` or drag it into Chrome, Safari, or Firefox.

2. **Optional: local server** (needed if videos don't play from file://)  
   ```bash
   cd birthday-website
   npx serve .
   ```  
   Then open the URL it prints (e.g. http://localhost:3000).

---

## The three tabs

- **Home** — Full-screen greeting with "Happy Birthday Nishma!" and 25 emojis in the background. Text pops in on load.
- **Iconic Moments** — Grid of photos and videos from the **Nishma through the years** folder (all integrated).
- **Wishes & Music** — Spotify playlist at the top, then 20 clickable cards for birthday wish videos. Click a card to play that video in a modal. Each card can have a **cover photo** (see below). The modal video has **play, pause, and rewind** controls.

You can also link to a tab with a hash: `index.html#moments` or `index.html#wishes`.

---

## Customize the whole website

### 1. Home tab (title and emojis)

- In `index.html`, find **#panel-home**.
- Change the three **pop-word** spans to edit "Happy", "Birthday", "Nishma!".
- To change the background color, edit **--home-bg** in `style.css` (e.g. #1a0e1a is blackish-purple).
- The 25 emojis are in the **home-emojis** div; you can replace or reorder them.

### 2. Iconic Moments tab

- The grid is filled with all images and videos from the **Nishma through the years** folder (jpg, jpeg, png, gif, webp, mp4, mov). Paths are `Nishma through the years/filename`.
- To add or remove items, edit the **#moments-grid** in `index.html` (add `<img … class="moment-img notion-block" loading="lazy">` or `<video … controls playsinline preload="metadata" class="moment-vid notion-block">`).

### 3. Wishes & Music tab (Spotify + wish videos)

- **Spotify:** The playlist is embedded with the iframe in **#panel-wishes**. To use a different playlist, replace the iframe `src` with your playlist's embed URL from Spotify.
- **Wish videos:** Put files in the **videos/** folder. For each **wish-card** in `index.html`, set **data-video** to the file path and **data-from** (and the visible "From: …" text) to the sender's name.
- **Cover photo for a wish video:** Add **data-poster="path/to/cover.jpg"** to the wish-card. The image will show on the card and as the video poster in the modal. Example: `data-video="videos/Srika.mp4" data-poster="covers/srika-cover.jpg"`. The card already has an `<img class="wish-card-poster">`; the script sets its `src` from `data-poster`.
- **Video controls:** The modal uses the browser’s native video controls (play, pause, seek/rewind). No extra setup needed.
- **More or fewer than 20:** Delete extra wish-card blocks or copy/paste one and update data-video, data-from, and optional data-poster.

### 4. Colors and fonts

- In **style.css**, **:root** has **--home-bg**, **--home-text**, **--home-accent** for the Home tab. The rest of the site uses **--bg**, **--text**, **--accent**, **--muted**. Change these to match your theme.
- Fonts are loaded from Google Fonts in `index.html`; you can change the link href to use other fonts.

---

## File structure

```
birthday-website/
├── index.html    ← Tabs, home text, moments grid, Spotify embed, wish cards
├── style.css     ← Colors, tab layout, home screen, grids
├── script.js     ← Tab switching + video modal (no need to edit)
├── README.md     ← This file
├── videos/       ← wish-01.mp4 … wish-20.mp4 (birthday wish videos)
└── moments/      ← (optional) photos/videos for Iconic Moments
```

---

## Publish with GitHub Pages

1. **Create a new repo on GitHub**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: e.g. `birthday-website` or `nishma-25`
   - Public, no README/license (you already have files)
   - Click **Create repository**

2. **Push this folder** (in Terminal, from this folder):
   ```bash
   git remote add origin https://github.com/sanginimehta/birthday-website.git
   git branch -M main
   git push -u origin main
   ```
   (Use your actual repo name if different.)

3. **Turn on GitHub Pages**
   - In the repo: **Settings** → **Pages**
   - Under **Source**: choose **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)** → Save

4. **Your site will be live at:**  
   `https://sanginimehta.github.io/birthday-website/`  
   (Replace `birthday-website` with your repo name if different.)

**Note:** If you have files over 100 MB, GitHub will reject the push. Use smaller video files or host big media elsewhere and link to them.

---

## Tips

- **Videos not playing?** Use `npx serve .` so the site is served over http.
- **Different Spotify playlist?** In Spotify: Share → Embed playlist → copy the iframe src and replace the one in index.html.

Happy 25th Nishma! 🎂
