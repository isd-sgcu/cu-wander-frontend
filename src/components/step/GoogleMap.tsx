import { useEffect, useRef } from "react";

const defaultOptions: google.maps.MapOptions = {
  center: {
    lat: 13.735342,
    lng: 100.5318827,
  },
  zoom: 17,
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
};

export default () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    new window.google.maps.Map(ref.current, defaultOptions);
  }, []);

  return <div ref={ref} className="w-full" id="map" />;
};
