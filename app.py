from flask import Flask, request, jsonify, send_from_directory
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


UPLOAD_FOLDER = "./kotki"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# --- API ---

@app.route("/upload", methods=["POST"])
def upload_files():
    if "files" not in request.files:
        return jsonify({"error": "No files"}), 400

    files = request.files.getlist("files")
    saved_files = []

    for file in files:
        if file and allowed_file(file.filename):
            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)
            saved_files.append(file.filename)

    return jsonify({"saved": saved_files})

@app.route("/photos")
def list_photos():
    files = [f for f in os.listdir(UPLOAD_FOLDER) if allowed_file(f)]
    return jsonify(files)

@app.route("/kotki/<path:filename>")
def serve_photo(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
