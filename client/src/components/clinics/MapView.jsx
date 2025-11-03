import { useEffect, useRef } from "react";

function loadGoogleMaps(key) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve(window.google);
    const id = "gmap-script";
    if (document.getElementById(id)) {
      document
        .getElementById(id)
        .addEventListener("load", () => resolve(window.google));
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(window.google);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function MapView({ clinics = [] }) {
  const ref = useRef(null);
  const key = process.env.REACT_APP_GOOGLE_KEY || "";

  useEffect(() => {
    if (!key) return;
    let map;
    let markers = [];

    loadGoogleMaps(key)
      .then((google) => {
        const center = clinics.length
          ? { lat: clinics[0].lat || -1.2921, lng: clinics[0].lng || 36.8219 }
          : { lat: -1.2921, lng: 36.8219 };

        map = new google.maps.Map(ref.current, { center, zoom: 11 });

        markers = clinics
          .filter((c) => c.lat && c.lng)
          .map(
            (c) =>
              new google.maps.Marker({
                position: { lat: c.lat, lng: c.lng },
                map,
                title: c.name,
              })
          );
      })
      .catch(() => {
        console.warn("Google Maps failed to load");
      });

    return () => {
      markers.forEach((m) => m.setMap(null));
    };
  }, [clinics, key]);

  return (
    <div className="rounded-lg overflow-hidden mt-6">
      <div
        ref={ref}
        className="w-full h-72 bg-gray-100 flex items-center justify-center"
      >
        {!process.env.REACT_APP_GOOGLE_KEY && (
          <div className="text-gray-500">
            Add REACT_APP_GOOGLE_KEY to .env to show map
          </div>
        )}
      </div>
    </div>
  );
}
