import { useEffect, useState } from "react";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);

  // Podmień na IP swojego laptopa w sieci
  const API_URL = "http://192.168.0.101:5000";

  const fetchPhotos = () => {
    fetch(`${API_URL}/photos`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

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
    fetchPhotos();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">📸 Galeria kotków</h2>

      {/* Upload */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-600
                     hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Wyślij
        </button>
      </div>

      {/* Galeria */}
      {photos.length === 0 ? (
        <p className="text-center text-gray-500">Brak zdjęć do wyświetlenia.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition"
            >
              <img
                src={`${API_URL}/kotki/${photo}`}
                alt={photo}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
