import React, { useState, useEffect, useRef } from "react";

const Index = () => {
  const [images, setImages] = useState([]);
  const [columns, setColumns] = useState(4);
  const [loading, setLoading] = useState(true);
  const galleryRef = useRef(null);

  // Generuje listę 24 zdjęć z picsum.photos z losową wysokością i stałą szerokością 400px
  const generateImages = () => {
    const imageCount = 50;
    const imgs = [];
    for (let i = 0; i < imageCount; i++) {
      const width = 400;
      const height = Math.floor(Math.random() * 400) + 300;
      imgs.push({
        id: `${i + 1}`,
        url: `https://picsum.photos/${width}/${height}?random=${i + 1}`,
        width,
        height,
      });
    }
    return imgs;
  };

  // Ustawia liczbę kolumn na podstawie szerokości kontenera
  useEffect(() => {
    const handleResize = () => {
      if (!galleryRef.current) return;
      const width = galleryRef.current.offsetWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else setColumns(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ładuje zdjęcia na start i symuluje loading
  useEffect(() => {
    setLoading(true);
    const imgs = generateImages();
    setTimeout(() => {
      setImages(imgs);
      setLoading(false);
    }, 500);
  }, []);

  // Przydziela zdjęcia do kolumn, dążąc do wyrównania wysokości kolumn (masonry)
  const distributeImages = () => {
    const columnsArray = Array.from({ length: columns }, () => []);
    const columnHeights = new Array(columns).fill(0);

    images.forEach((image) => {
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      );
      columnsArray[shortestColumnIndex].push(image);

      const aspectRatio = image.height / image.width;
      columnHeights[shortestColumnIndex] += aspectRatio * 100;
    });

    return columnsArray;
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f0f0f0" }}>
      <div
        ref={galleryRef}
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 16,
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 16,
        }}
      >
        {loading
          ? Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#ccc",
                      height: Math.floor(Math.random() * 200) + 150,
                      marginBottom: idx === 5 ? 0 : 16,
                      borderRadius: 8,
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                ))}
              </div>
            ))
          : distributeImages().map((colImages, colIndex) => (
              <div
                key={colIndex}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {colImages.map((img) => (
                  <div
                    key={img.id}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                      transition: "box-shadow 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgb(0 0 0 / 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgb(0 0 0 / 0.1)";
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Gallery image ${img.id}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: 8,
                        transition: "transform 0.3s ease",
                      }}
                      loading="lazy"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0";
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
      </div>

      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
};

export default Index;
