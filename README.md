# korn.systems

This repository contains the source code for the `korn.systems` portfolio website.

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and continuous deployment.

- **Security Check:** Runs Trivy to scan the repository for vulnerabilities.
- **Linting & Formatting:** Checks code with ESLint and Prettier.
- **Cross-Platform Testing:** Runs Playwright functional and integration tests across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari.
- **Dependabot:** Configured to check for `npm` and `github-actions` updates weekly.

## Local Tests Process

### Running Tests Locally

You can run the Playwright test suite using standard `npm` commands. The framework supports separating visual regressions from structural/functional tests.

1. **Run All Tests (Functional + Visual)**

   ```bash
   npm run test
   ```

2. **Run Only Non-Visual Tests**

   ```bash
   npm run test -- --grep-invert "Visual"
   ```

3. **Run Only Visual Tests**

   ```bash
   npm run test -- --grep "Visual"
   ```

4. **Update Visual Screenshots (Baselines)**
   If you have made intentional UI changes, update the baseline reference images:
   ```bash
   npm run test -- --update-snapshots
   ```

### Execution Modes (Local vs. CI)

The `playwright.config.js` is engineered to adapt depending on the environment:

- **Local Mode (Default):**
  - **Browsers:** Runs across **all 5 major engines**: Desktop Chromium, Firefox, WebKit (Safari), Mobile Chrome (Pixel), and Mobile Safari (iPhone).
  - **Parallelism:** Tests are fully parallelized across all available CPU cores (`workers: undefined`).
  - **Retries:** Disabled locally to quickly catch and debug failures.
  - **Server:** Automatically serves the site locally and reuses an existing dev server if one is already running.

- **CI Mode (Triggered automatically in GitHub Actions via `CI=true`):**
  - **Browsers:** Runs **only on Chromium and Mobile Chrome** to drastically reduce pipeline cost, flakiness, and execution time (since local tests already verified cross-browser compatibility).
  - **Parallelism:** Restricted to 1 worker to ensure stable rendering for visual screenshots and avoid resource starvation on standard CI runners.
  - **Retries:** Fails are automatically retried up to 2 times to mitigate flaky network conditions.
  - **Strictness:** Forbids `.only` annotations to prevent accidental skipped tests from being merged.

You can explicitly test CI mode behavior locally by prefixing the environment variable:

```bash
CI=true npm run test
```

1. **Install node dependencies:**

   ```bash
   npm install
   ```

### Setting up Playwright on Fedora 44

If you are running Fedora 44 and want to execute cross-browser local tests (especially WebKit/Safari), you must manually install certain dependencies that Playwright does not natively handle on this OS version:

1. **Install `libicu74` (note: requires the older 74.2 version, not the latest):**

   ```bash
   sudo dnf install https://kojipkgs.fedoraproject.org//packages/libicu74/74.2/3.fc43/x86_64/libicu74-74.2-3.fc43.x86_64.rpm
   ```

2. **Install `gstreamer` plugins (requires RPM Fusion repos):**

   ```bash
   sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-44.noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-44.noarch.rpm
   sudo dnf install gstreamer1-plugins-good gstreamer1-plugins-bad-free gstreamer1-plugins-bad-freeworld gstreamer1-plugins-ugly gstreamer1-plugins-ugly-free gstreamer1-plugin-libav
   ```

3. **Provide `libjpeg.so.8` for `libjpeg-turbo8`:**
   WebKit requires `libjpeg.so.8`. If you have NVIDIA Nsight systems installed, you can symlink the provided library:

   ```bash
   sudo ln -s /opt/nvidia/nsight-systems/2026.1.3/host-linux-x64/libjpeg.so.8 /usr/lib64/libjpeg.so.8
   ```

4. **Install Playwright Browsers:**

   ```bash
   npx playwright install
   ```

5. **Run Playwright Tests:**
   This will execute the functional tests specifically tailored for `korn.systems`.

   ```bash
   npm run test
   ```

6. **Format & Lint Code:**

   ```bash
   npm run format
   npm run lint
   ```

7. **Run Locally for Manual Testing:**
   You can serve the website locally to preview it in your browser:
   ```bash
   npx serve .
   ```
   Then open `http://localhost:3000` in your web browser.
