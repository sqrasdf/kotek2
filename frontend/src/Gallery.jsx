import { useEffect, useState } from "react";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);

  const API_URL = "http://192.168.0.101:5000"; // <-- podmień na IP laptopa

  // pobieranie zdjęć
  const fetchPhotos = () => {
    fetch(`${API_URL}/photos`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // obsługa wyboru plików
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // wysyłanie plików
  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    setFiles([]);
    fetchPhotos(); // odśwież galerię
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Galeria kotków 🐱</h2>

      {/* Upload */}
      <div className="mb-6">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <button
          onClick={handleUpload}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Wyślij
        </button>
      </div>

      {/* Galeria */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo, idx) => (
          <div key={idx} className="border rounded-lg overflow-hidden shadow">
            <img
              src={`${API_URL}/kotki/${photo}`}
              alt={photo}
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
