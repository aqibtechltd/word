# Word to PDF Converter Tool

A web-based tool to convert `.doc` and `.docx` files to PDF. Features drag-and-drop, manual file selection, upload progress, and a responsive UI.

## Features
- Drag-and-drop or manual file selection for Word files
- Upload progress and error handling
- Download PDF after conversion
- Responsive, minimal, and mobile-friendly UI
- Branding: Built by Aqib Chaudhary – https://freetoolszone.xyz/

## Setup
1. **Backend:**
   - Install dependencies: `pip install -r requirements.txt`
   - Run the server: `python app.py`
2. **Frontend:**
   - Open `index.html` in your browser (or serve via Flask/static for CORS)

## Notes
- The backend uses Flask and pypandoc for conversion. Ensure `pandoc` is installed on your system for PDF output.
- For production, serve static files and secure the API as needed.