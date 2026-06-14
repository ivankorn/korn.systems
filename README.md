# korn.systems

This repository contains the source code for the `korn.systems` portfolio website.

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and continuous deployment.
- **Security Check:** Runs Trivy to scan the repository for vulnerabilities.
- **Linting & Formatting:** Checks code with ESLint and Prettier.
- **Cross-Platform Testing:** Runs Playwright functional and integration tests across Ubuntu, Windows, and macOS for Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari.
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

## Infrastructure as Code (Terraform)

This repository manages its own GitHub settings (Pages, branch protection, and HTTPS redirection) via Terraform. 
The Terraform configuration is located in the `terraform/` directory.

### GitHub Secrets Setup
To allow Terraform to make changes to branch protection and Pages, you must create a Personal Access Token (PAT) with `repo` admin rights and store it as a GitHub Repository Secret:
- **`GH_PAT`**: The personal access token.

> **TODO:** MX Records for email must be configured centrally in the `korn-ss-gh` repository before email will work for this domain.

### Local Testing

1. **Initialize Terraform:**
   ```bash
   cd terraform
   terraform init
   ```

2. **Lint and Validate:**
   ```bash
   terraform fmt
   terraform validate
   tflint
   ```
