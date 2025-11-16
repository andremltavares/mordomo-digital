# Digital Butler (Mordomo Digital)

A desktop application built with Electron and Python to help you find duplicates, categorize files, and clean up your digital clutter.

## ✨ Current Features (Phase 2)

This app can currently scan any local folder on your computer and provide a complete analysis, including:

* **Duplicate File Finder:** Scans the folder and identifies 100% identical files using MD5 hashing, regardless of their filenames.
* **Folder Summary:** Provides a quick overview of the selected folder, including:
    * Total file count
    * Total folder size (e.g., GB, MB)
* **File Categorization:** Breaks down all files into clear categories so you know what you have:
    * Images
    * Documents
    * Videos
    * Music
    * Compressed (.zip, .rar)
    * ...and more.

## 🛠️ Tech Stack

* **Frontend (UI):** [Electron](https://www.electronjs.org/) (JavaScript, HTML, CSS)
* **Backend (Logic):** [Python](https://www.python.org/)
* **Bridge:** Node.js `child_process` to run Python scripts securely.

## 🗺️ Future Roadmap (The Plan)

The goal is to build a truly smart digital assistant. The next planned phases are:

* **Phase 3: Cloud Integration**
    * Connect to Google Drive (and later, Dropbox/OneDrive).
    * Find duplicates *between* your local files and your cloud storage.
* **Phase 4: AI Organization**
    * Use AI (NLP/OCR) to read file contents.
    * Automatically suggest "Smart Folders" (e.g., "Move all 2024 invoices to /Finances/2024").

## 🖥️ How to Run (Development)

1.  Clone this repository.
2.  Install dependencies: `npm install`
3.  Run the app: `npm start`
