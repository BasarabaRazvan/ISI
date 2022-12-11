import React, { useEffect, useRef } from 'react'
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

function Home() {
  const mapRef = useRef(null);

  useEffect(() => {
    new MapView({
      map: new Map({
        basemap: "streets"
      }),
      container: mapRef.current,
      center: [-115.151507, 36.131516],
      zoom: 11
    });
  }, []);

  return (
    <div ref={mapRef} style={{ height: "100vh", width: "100%"}}>

    </div>
  )
}

export default Home