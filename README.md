# Orbit — Spirograph Studio

A static, browser-based spirograph drawing tool. No build step or server is required.

## Run locally

Open `index.html` in a modern browser. For local development, a VS Code static-server extension such as Live Server can reload the page as files change.

## Publish with GitHub Pages

1. Create a GitHub repository for the site (for example, `orbit-spirograph`).
2. Upload the contents of this folder — `index.html`, `style.css`, `sketch.js`, and this README — to the repository's top level.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and the `/(root)` folder, then select **Save**.
6. Wait for the Pages deployment to finish. GitHub will show the public URL on the Pages settings screen; it will look like `https://YOUR-USERNAME.github.io/REPOSITORY/`.

The site is static, so it does not need a backend or a build command. Once hosted on HTTPS, use **Copy a link to this design** to share a URL that preserves the current gear settings.

## Controls

- **R** — radius of the fixed outer gear.
- **r** — radius of the smaller rolling gear.
- **d** — distance of the pen from the rolling gear's center.
- Choose a preset, adjust the sliders, download the artwork as a PNG, or copy a link to the current settings.
