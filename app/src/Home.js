import React, { useEffect, useRef } from 'react'
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { auth, logout } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Home() {
  const mapRef = useRef(null);
  const user = useAuthState(auth);

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

  const handleClick = () => {
    logout();
    console.log(user)
    window.location = '/';
  }

  return (
    <div>
      <button onClick={handleClick} >Log out</button>
      <div ref={mapRef} style={{ height: "100vh", width: "100%"}}>

      </div>
    </div>
  )
}

export default Home