# korn.systems

This repository contains the source code for the `korn.systems` portfolio website.

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and continuous deployment.

- **Security Check:** Runs Trivy to scan the repository for vulnerabilities.
- **Linting & Formatting:** Checks code with ESLint and Prettier.
- **Cross-Platform Testing:** Runs Playwright functional and integration tests across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari.
- **Dependabot:** Configured to check for `npm` and `github-actions` updates weekly.

## Local Tests Process

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run Playwright Tests:**
   This will execute the functional tests specifically tailored for `korn.systems`.

   ```bash
   npm run test
   ```

3. **Format & Lint Code:**

   ```bash
   npm run format
   npm run lint
   ```

4. **Run Locally for Manual Testing:**
   You can serve the website locally to preview it in your browser:
   ```bash
   npx serve .
   ```
   Then open `http://localhost:3000` in your web browser.
