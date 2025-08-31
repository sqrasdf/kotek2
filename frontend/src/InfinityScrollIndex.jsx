import React, { useState, useEffect, useRef, useCallback } from "react";

const InfinityScrollIndex = () => {
  const [images, setImages] = useState([]);
  const [columns, setColumns] = useState(4);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const galleryRef = useRef(null);
  const observerRef = useRef(null);

  // Funkcja generująca zdjęcia - teraz symulujemy paginację (każda strona 24 zdjęć)
  const generateImages = (pageNum) => {
    const imageCount = 24;
    const imgs = [];
    const baseIndex = (pageNum - 1) * imageCount;
    for (let i = 0; i < imageCount; i++) {
      const width = 400;
      const height = Math.floor(Math.random() * 400) + 300;
      imgs.push({
        id: `${baseIndex + i + 1}`,
        url: `https://picsum.photos/${width}/${height}?random=${
          baseIndex + i + 1
        }`,
        width,
        height,
      });
    }
    return imgs;
  };

  // Ustaw liczbe kolumn na podstawie szerokości kontenera
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

  // Ładujemy pierwszą stronę zdjęć (page 1)
  useEffect(() => {
    setLoading(true);
    const imgs = generateImages(1);
    setTimeout(() => {
      setImages(imgs);
      setLoading(false);
    }, 500);
  }, []);

  // Funkcja do ładowania kolejnej strony zdjęć i doklejania do listy
  const loadMoreImages = useCallback(() => {
    const nextPage = page + 1;
    setLoading(true);
    const newImages = generateImages(nextPage);

    setTimeout(() => {
      setImages((prev) => [...prev, ...newImages]);
      setPage(nextPage);
      setLoading(false);
    }, 700);
  }, [page]);

  // Konfiguracja Intersection Observer do wykrywania momentu zbliżenia do dołu galerii
  useEffect(() => {
    if (loading) return; // Nie uruchamiaj podczas ładowania, aby uniknąć podwójnego fetchu

    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMoreImages();
      }
    };

    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observerRef.current = new IntersectionObserver(handleObserver, option);
    if (galleryRef.current) {
      observerRef.current.observe(document.getElementById("scroll-anchor"));
    }

    return () => observerRef.current && observerRef.current.disconnect();
  }, [loadMoreImages, loading]);

  // Masonry: rozdziel obrazki do kolumn wg wysokości
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
        {distributeImages().map((colImages, colIndex) => (
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

      {/* Anchor div do Intersection Observer */}
      <div id="scroll-anchor" style={{ height: 1 }} />

      {loading && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p>Ładowanie...</p>
        </div>
      )}

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

export default InfinityScrollIndex;
