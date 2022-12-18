import React, { useEffect, useRef } from 'react'
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { auth, logout } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import esriConfig from "@arcgis/core/config.js";
import * as locator from "@arcgis/core/rest/locator";
import Graphic from "@arcgis/core/Graphic";
import Search from "@arcgis/core/widgets/Search";
import "@arcgis/core/assets/esri/themes/light/main.css";
import "./Home.css";

function Home() {
  const mapRef = useRef(null);
  const user = useAuthState(auth);

  esriConfig.apiKey = "AAPKd7e8f8aeb7b34d64885add43a907a22bNSDJ9v_qQBrqq4jjSD9PxV6SOAkgDcN4bx58c1ixdew7pbTZ6va3VPHhQ5VbgGT8";  

  useEffect(() => {
    const view = new MapView({
      map: new Map({
        basemap: "streets"
      }),
      container: mapRef.current,
      center: [-115.151507, 36.131516],
      zoom: 11
    });

    view.popup.actions = [];

    view.when(() => {
      findPlaces(view);
    });

    const search = new Search({  
      view: view
    });

    view.ui.add(search, "top=right");
  }, []);

  function findPlaces(view) {
    const geocodingServiceUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

    const params = {
      categories: ["casino"],
      location: [-115.151507, 36.131516],  // Las vegas
      outFields: ["PlaceName", "Place_addr"]
    }

    locator.addressToLocations(geocodingServiceUrl, params).then((results)=> {
      showResults(view, results);
    });
  }

  function showResults(view, results) {
    view.popup.close();
    view.graphics.removeAll();
    results.forEach((result)=>{
      view.graphics.add(
        new Graphic({
          attributes: result.attributes,
          geometry: result.location,
          symbol: {
            type: "simple-marker",
            color: "black",
            size: "10px",
            outline: {
              color: "#ffffff",
              width: "2px"
            }
          },
          popupTemplate: {
            title: "{PlaceName}",
            content: "{Place_addr}"
          }
        }));
    });
    if (results.length) {
      const g = view.graphics.getItemAt(0);
      view.popup.open({
        features: [g],
        location: g.geometry
      });
    }
  }

  const handleClick = () => {
    logout();
    console.log(user)
    window.location = '/';
  }

  return (
    <div className='d-flex row justify-content-end pt-2 m-auto'
      style={{ width: "90vw" }}
    >
      <button
        className="btn btn-secondary col-1 offset-11 mb-2"
        onClick={handleClick} > Log out
      </button>
      <div ref={mapRef}
        style={{ 
          height: "90vh", 
          margin: "auto",
          marginTop: "10px",
        }}>

      </div>
    </div>
  )
}

export default Home