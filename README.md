# Permission Blast Radius Calculator

A robust, cross-platform tool to analyze and visualize the blast radius of a compromised account: **"If Bob is phished, what's at risk?"**

- **Web App:** Upload user/resource data and analyze in your browser (no backend required)
- **Electron App:** Local OS scanning and advanced features (optional)
- **Free, open source, and privacy-friendly**

---

## Features

- **Blast Radius Analysis:** See all resources a user can access if their account is compromised
- **User-Resource Mapping:** Upload a CSV to map users to resources and permissions
- **Modern UI:** Clean, responsive, and easy to use
- **No Data Leaves Your Device:** All analysis is local
- **Cross-Platform:** Works on Windows, macOS, Linux (web and Electron)
- **Extensible:** Add more resource types, permission models, or integrations

---

## Getting Started

### Web App (Recommended for Most Users)

1. **Install dependencies:**
   ```sh
   cd app/renderer
   npm install
   npm start
   ```
2. **Open your browser** to [http://localhost:3000](http://localhost:3000)
3. **Upload a user-resource CSV** (see format below)
4. **Select a user** to view their blast radius

### Electron App (Advanced, for Local OS Scanning)

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Build everything:**
   ```sh
   npm run build-main
   cd app/renderer && npm run build && cd ../..
   ```
3. **Start Electron:**
   ```sh
   npm start
   ```
4. **(Optional) Build shared logic:**
   ```sh
   npx tsc --project app/shared
   ```

---

## CSV Formats

### 1. **User List (Simple)**
```
alice
bob
carol
```

### 2. **User-Resource Mapping (Recommended)**

With header:
```csv
username,full_name,department,role,resource_type,resource_name,permissions
alice,Alice Smith,Engineering,Developer,file,/home/alice/secret.txt,read;write
alice,Alice Smith,Engineering,Developer,db,finance_db,read
bob,Bob Johnson,IT,Sysadmin,server,prod-web-01,ssh
bob,Bob Johnson,IT,Sysadmin,file,/etc/shadow,read
carol,Carol White,Finance,Accountant,folder,/home/carol/docs,read;write;delete
```

- **username:** The user's login name (must be unique per user)
- **resource_type:** e.g., file, folder, db, server
- **resource_name:** Path or identifier of the resource
- **permissions:** Semicolon-separated list (e.g., `read;write`)

**You can include extra columns (full_name, department, etc.)—they will be ignored by the app.**

---

## Development

### Project Structure
```
PermissionBlast/
├── app/
│   ├── main/         # Electron main process (TypeScript)
│   ├── renderer/     # React frontend (web & Electron)
│   └── shared/       # Shared logic (TypeScript)
├── cli/              # CLI tool (optional)
├── tests/            # Automated tests
├── sample.csv        # Example user-resource mapping
├── package.json
└── README.md
```

### Scripts
- `npm start` — Start Electron app (and React dev server in parallel)
- `npm run build-main` — Build Electron main process and copy preload script
- `cd app/renderer && npm start` — Start React web app only
- `cd app/renderer && npm run build` — Build React for production

### Testing
- `npm test` — Run backend/shared/CLI tests
- `cd app/renderer && npm test` — Run React UI tests

---

## Contributing

Pull requests are welcome! To contribute:
1. Fork the repo
2. Create a feature branch
3. Make your changes (add tests if possible)
4. Open a pull request with a clear description

### Ideas for Contribution
- Add more resource types or permission models
- Improve OS scanning (Electron)
- Add export/reporting features (PDF, CSV, JSON)
- Polish the UI/UX
- Add more test coverage

---

## Security & Privacy
- **No data leaves your device**—all analysis is local
- **Open source**—fully auditable codebase
- **Electron app**: Only enable Node.js features as needed (see `main.ts`)