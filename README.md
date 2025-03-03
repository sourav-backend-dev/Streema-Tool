# Strema Content Tool Chrome Extension

**Strema Content Tool** is a Chrome extension built using React.js and Vite. It enables [briefly describe what the extension does, e.g., enhancing content interaction, managing content on web pages, etc.].

## Installation and Setup

Follow these steps to set up the project locally for development and production.

### 1. Clone the repository
Clone the repository to your local machine:
```bash
git clone https://github.com/sourav-backend-dev/Streema-Tool.git
cd Streema-Tool
```

### 2. Install dependencies
To install all necessary dependencies for the project, run the following command:
```bash
npm install
```

### 3. Install API dependencies
The project uses a backend API for certain features. To install dependencies for the API, navigate to the `Test-api` directory and install them:
```bash
cd Test-api
npm install
cd ..
```

### 4. Running the project locally (Development)
To start the development environment with both the API and client running concurrently, use the following command:
```bash
npm run dev
```
This command will:
- Start the backend API (`server.js`) using `npm run start-api`.
- Launch the frontend client using Vite (`npm run start-client`).

Both the client and the API will be running locally for development.

### 5. Building the project (Production)
To build the client for production, run the following command:
```bash
npm run build
```

This will generate the production-ready files in the `dist` folder.

### 6. Upload the `dist` folder to Chrome
Once you have the production build in the `dist` folder, you can upload it to Chrome as an unpacked extension.

#### Steps:
1. Open Chrome and go to the Extensions page: `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click the **Load unpacked** button.
4. Select the `dist` folder from your project directory.
5. Your Chrome extension will now be installed and available for use.

### 7. Linting and Preview
- To lint your code and check for any issues, use:
  ```bash
  npm run lint
  ```

- To preview the production build after running `npm run build`, use the following command:
  ```bash
  npm run preview
  ```

This command will start a local server to preview the built client.

## Manifest Details

The extension is configured with `manifest_version` 3, and the following key attributes are defined in the `manifest.json`:

- **Name**: `React Chrome Extension`
- **Version**: `1.0.0`
- **Description**: `A Chrome extension built using React.js and Vite.`
- **Permissions**: Includes permissions for `storage`, `activeTab`, `scripting`, `sidePanel`, and `tabs`.
- **Host Permissions**: Allows access to all URLs (`https://*/*`).
- **Side Panel**: The extension uses the side panel feature, with `index.html` as the default path.
- **Background**: The background script is handled by `assets/background.js` using a service worker.
- **Content Scripts**: The content script is injected into pages matching `https://*/*` and includes `assets/contentScript.js`.
- **Icons**: The extension uses `logo.png` as the icon at `64x64` pixels.

## Available Scripts

Here are the available scripts in the project:

- `install-all`: Installs all dependencies for both the client and the Test API.
- `start-api`: Starts the Test API by running `server.js`.
- `start-client`: Starts the client using Vite.
- `start`: Runs both the API and the client concurrently.
- `dev`: Starts the development environment (both API and client).
- `build`: Builds the client for production using Vite.
- `lint`: Lints the project using ESLint.
- `preview`: Previews the built production version of the client.
