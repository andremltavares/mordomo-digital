# Digital Butler (Mordomo Digital)

A desktop application built with Electron and Python to help you find duplicates, categorize files, and clean up your digital clutter.

## ✨ Current Features

The app now supports both local and cloud analysis.

### Local Analysis (Phase 2)
* **Duplicate File Finder:** Scans any local folder and identifies 100% identical files using MD5 hashing.
* **Folder Summary:** Provides a quick overview of the selected folder (total files, total size).
* **File Categorization:** Breaks down files into categories (Images, Documents, Videos, etc.).

### Cloud Integration (Phase 3)
* **Google Drive Connection:** Securely authenticates with Google Drive using OAuth 2.0.
* **File Listing:** Can fetch and display a list of files from the user's Google Drive.

## 🛠️ Tech Stack

* **Frontend (UI):** [Electron](https://www.electronjs.org/) (JavaScript, HTML, CSS)
* **Backend (Logic):** [Python](https://www.python.org/)
* **APIs:** [Google Drive API](https://developers.google.com/drive)
* **Bridge:** Node.js `child_process` to run Python scripts securely.

## 🗺️ Future Roadmap (The Plan)

The next planned phases are:

* **Phase 4: AI Organization & Cross-Comparison**
    * Compare local and cloud files to find cross-platform duplicates.
    * Use AI (NLP/OCR) to read file contents.
    * Automatically suggest "Smart Folders" (e.g., "Move all 2024 invoices to /Finances/2024").

## 🖥️ How to Run (Development)

1.  Clone this repository.
2.  Install Node.js dependencies: `npm install`
3.  Install Python dependencies: `pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib`
4.  Set up your `credentials.json` from the Google Cloud Console.
5.  Run the app: `npm start`
