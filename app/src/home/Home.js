import React, { useEffect, useRef } from 'react'
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { auth, logout, searchCasino, addToDBFavourites, searchFavourites } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import esriConfig from "@arcgis/core/config.js";
import * as locator from "@arcgis/core/rest/locator";
import Graphic from "@arcgis/core/Graphic";
import Search from "@arcgis/core/widgets/Search";
import "@arcgis/core/assets/esri/themes/light/main.css";
import "@arcgis/core/geometry/Extent"
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import * as route from "@arcgis/core/rest/route";
import "./Home.css";


function Home() {
  const mapRef = useRef(null);
  const user = useAuthState(auth);

  esriConfig.apiKey = "AAPKd7e8f8aeb7b34d64885add43a907a22bNSDJ9v_qQBrqq4jjSD9PxV6SOAkgDcN4bx58c1ixdew7pbTZ6va3VPHhQ5VbgGT8";  

  const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

  const view = new MapView({
    map: new Map({
      basemap: "streets"
    }),
    container: mapRef.current,
    center: [-115.151507, 36.131516],
    zoom: 11
  });

  useEffect(() => {
    view.popup.actions = [];

    view.when(() => {
      findPlaces(view);
    });

    const search = new Search({  
      view: view,
      allPlaceholder: "Search for places",        
    });

    view.ui.add(search, "bottom-right");


    //routing
    view.on("click", function(event){
      console.log(view.graphics.length);

      if (view.graphics.length === 152 && event.button === 2) {
        event.mapPoint.latitude = 36.100201190275676;
        event.mapPoint.longitude = -115.24340045786572;
        addGraphic("origin", event.mapPoint, view);
      } else if (view.graphics.length >= 153 && event.button === 2) {
        searchPoint("destination", event.mapPoint, view, view.graphics.items[152].geometry.latitude, view.graphics.items[152].geometry.longitude);
        getRoute(view); // Call the route service
      }
    });
  
  }, [view]);

  function findPlaces(view) {
    const geocodingServiceUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

    const params = {
      categories: ["casino"],
      location: [-115.151507, 36.131516],  // Las vegas
      outFields: ["PlaceName", "Place_addr"],
      maxLocations: 50,
      searchExtent: {
        "xmin":-116.151507,"ymin":35.131516,"xmax":-114.151507 ,"ymax":37.131516,
        "spatialReference":{"wkid":4326}
      }
    }

    const params2 = {
      categories: ["casino"],
      location: [-114.151507, 36.131516],  // Las vegas
      outFields: ["PlaceName", "Place_addr"],
      maxLocations: 50,
      searchExtent: {
        "xmin":-115.151507,"ymin":35.131516,"xmax":-114.051507 ,"ymax":37.131516,
        "spatialReference":{"wkid":4326}
      }
    }

    const params3 = {
      categories: ["casino"],
      location: [-115.351507, 36.131516],  // Las vegas
      outFields: ["PlaceName", "Place_addr"],
      maxLocations: 50,
      searchExtent: {
        "xmin":-115.551507,"ymin":35.131516,"xmax":-115.151507 ,"ymax":37.131516,
        "spatialReference":{"wkid":4326}
      }
    }

    const params4 = {
      categories: ["casino"],
      location: [-115.151507, 34.831516],  // Las vegas
      outFields: ["PlaceName", "Place_addr"],
      maxLocations: 50,
      searchExtent: {
        "xmin":-116.151507,"ymin":34.531516,"xmax":-114.151507 ,"ymax":35.131516,
        "spatialReference":{"wkid":4326}
      }
    }

    locator.addressToLocations(geocodingServiceUrl, params).then((results)=> {
      showResults(view, results);
    });
    locator.addressToLocations(geocodingServiceUrl, params2).then((results)=> {
      showResults(view, results);
    });
    locator.addressToLocations(geocodingServiceUrl, params3).then((results)=> {
      showResults(view, results);
    });
    locator.addressToLocations(geocodingServiceUrl, params4).then((results)=> {
      showResults(view, results);
    });
  }

  function showResults(view, results) {
    view.popup.close();
    results.forEach((result)=>{
      //addCasino(result.attributes.PlaceName, getRandomFloat(1.0, 5.0, 1))
      //console.log(result.attributes.PlaceName);
      searchCasino(result.attributes.PlaceName).then(r => 
        {
          searchFavourites(user[0].uid).then(arr => {
            let ok = 1;
            arr.forEach(elem => {if (elem.title === result.attributes.PlaceName) ok = 0});
            if (ok === 0) {
              view.graphics.add(
                new Graphic({
                  attributes: result.attributes,
                  geometry: result.location,
                  symbol: {
                    type: "simple-marker",
                    color: "yellow",
                    size: "10px",
                    outline: {
                      color: "#ffffff",
                      width: "2px"
                    }
                  },
                  popupTemplate: {
                    title: "{PlaceName}",
                    content: "{Place_addr}" + "\n" +
                            "Longitude:" + Math.round(result.location.longitude * 100000)/100000 + "\n" + 
                            "Latitude:" + Math.round(result.location.latitude * 100000)/100000 + "\n" + 
                            "Rate: " + r
                  }
                }));
            } else {
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
                    content: "{Place_addr}" + "\n" +
                            "Longitude:" + Math.round(result.location.longitude * 100000)/100000 + "\n" + 
                            "Latitude:" + Math.round(result.location.latitude * 100000)/100000 + "\n" + 
                            "Rate: " + r
                  }
                }));
            }
          });
      });
    });
    if (results.length) {
      const g = view.graphics.getItemAt(0);
      view.popup.open({
        features: [g],
        location: g.geometry
      });
    }
  }

  //routing 
  function addGraphic(type, point, view) {
    const graphic = new Graphic({
      symbol: {
        type: "simple-marker",
        color: (type === "origin") ? "red" : "black",
        size: "8px"
      },
      geometry: point
    });
    view.graphics.add(graphic);
  }

  function searchPoint(type, point, view, x, y) {
    let minimal_distance = 1000;
    view.graphics.items.forEach((el) => {
      if(el.symbol.color.r === 0 || (el.symbol.color.r === 255 && el.symbol.color.g === 255))
        minimal_distance = calculate_minimal_distance(minimal_distance, el.geometry.latitude, el.geometry.longitude, point.latitude, point.longitude)
    })

    view.graphics.items.forEach((el) => {
      if ((el.symbol.color.r === 0 && minimal_distance === calculate_distance(el.geometry.latitude, el.geometry.longitude, point.latitude, point.longitude)) ||
      (el.symbol.color.r === 255 && el.symbol.color.g === 255 && minimal_distance === calculate_distance(el.geometry.latitude, el.geometry.longitude, point.latitude, point.longitude))) {

        point.longitude = el.geometry.longitude;
        point.latitude = el.geometry.latitude;

        let attributes = el.attributes;

        view.graphics.removeMany(view.graphics.toArray().filter((g) => g===el));

        const graphic = new Graphic({
          attributes: attributes,
          symbol: {
            type: "simple-marker",
            color: "blue",
            size: "8px"
          },
          popupTemplate: {
            title: "{PlaceName}",
            content: "{Place_addr}" + "\n" +
                    "Longitude:" + Math.round(point.longitude * 100000)/100000 + "\n" + 
                    "Latitude:" + Math.round(point.latitude * 100000)/100000
          },
          geometry: point
        });
        view.graphics.add(graphic);
      }
    })
  }

  function calculate_minimal_distance(minimal_distance, x1, y1, x2, y2) {
    let r = 6371
    let p = 0.017453292519943295
    let a = 0.5 - Math.cos((x2-x1)*p)/2 + Math.cos(x1*p)*Math.cos(x2*p) * (1-Math.cos((y2-y1)*p)) / 2
    let d = 2 * r * Math.asin(Math.sqrt(a))

    if (d < minimal_distance)
        return d;
    return minimal_distance;
  }

  function calculate_distance(x1, y1, x2, y2) {
    let r = 6371
    let p = 0.017453292519943295
    let a = 0.5 - Math.cos((x2-x1)*p)/2 + Math.cos(x1*p)*Math.cos(x2*p) * (1-Math.cos((y2-y1)*p)) / 2
    let d = 2 * r * Math.asin(Math.sqrt(a))
    
    return d;
  }

  function getRoute(view) {
    let arr = [];

    view.graphics.toArray().forEach((g) => {
      if (g.symbol.color.r === 255 && g.symbol.color.g === 0 && g.symbol.color.b === 0) {
        arr.push(g);
      }

      if (g.symbol.color.r === 0 && g.symbol.color.g === 0 && g.symbol.color.b === 255) {
        arr.push(g);
      }
    });

    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: arr
      }),
      returnDirections: true
    });

    route.solve(routeUrl, routeParams)
      .then(function(data) {
        data.routeResults.forEach(function(result) {
          result.route.symbol = {
            type: "simple-line",
            color: [5, 150, 255],
            width: 3
          };
          view.graphics.add(result.route);
        });

        // Display directions
       if (data.routeResults.length > 0) {
         const directions = document.createElement("ol");
         directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
         directions.style.marginTop = "0";
         directions.style.padding = "15px 15px 15px 30px";
         const features = data.routeResults[0].directions.features;

         // Show each direction
         features.forEach(function(result,i){
           const direction = document.createElement("li");
           direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
           directions.appendChild(direction);
         });

        view.ui.empty("top-right");
        view.ui.add(directions, "top-right");

       }

      })

      .catch(function(error){
          console.log(error);
      })
  }

  function deleteRoute(view) {
    view.graphics.items.forEach((el) => {
      if(el.symbol.color.g === 150)
        view.graphics.removeMany(view.graphics.toArray().filter((g) => g===el));
    })

    let ok = 1;
    while(ok) {
      ok = 0;
      view.graphics.items.forEach((el) => {
        if (el.symbol.color.b === 255) {
  
          let point = el.geometry;
          let attributes = el.attributes;

          searchCasino(attributes.PlaceName).then(r => 
            {
              searchFavourites(user[0].uid).then(arr => {
                let ok = 1;
                arr.forEach(elem => {if (elem.title === attributes.PlaceName) ok = 0});
                if (ok === 0) {
                  const graphic = new Graphic({
                    attributes: attributes,
                    symbol: {
                      type: "simple-marker",
                      color: "yellow",
                      size: "10px",
                      outline: {
                        color: "#ffffff",
                        width: "2px"
                      }
                    },
                    popupTemplate: {
                    title: "{PlaceName}",
                    content: "{Place_addr}" + "\n" +
                            "Longitude:" + Math.round(point.longitude * 100000)/100000 + "\n" + 
                            "Latitude:" + Math.round(point.latitude * 100000)/100000 + "\n" + 
                            "Rate: " + r
                    },
                    geometry: point
                  });
                  view.graphics.add(graphic);
                } else {
                  const graphic = new Graphic({
                    attributes: attributes,
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
                    content: "{Place_addr}" + "\n" +
                            "Longitude:" + Math.round(point.longitude * 100000)/100000 + "\n" + 
                            "Latitude:" + Math.round(point.latitude * 100000)/100000 + "\n" + 
                            "Rate: " + r
                    },
                    geometry: point
                  });
                  view.graphics.add(graphic);
                }
            });
          });
  
          view.graphics.removeMany(view.graphics.toArray().filter((g) => g===el));
          ok = 1;
        }
      })
    }

    view.ui.empty("top-right");
  }

  const handleClick = () => {
    logout();
    console.log(user)
    window.location = '/';
  }

  const resetMap = () => {
    deleteRoute(view);
  }

  const addToFavourites = () => {
    //console.log(view.graphics.getItemAt(0).popup.open());
    if (view.popup.visible) {
      if(user[0] !== null) {
        const title = view.popup.title;
        console.log(title);
        addToDBFavourites(user[0].uid, title);
      }
    }
  }

  // function getRandomFloat(min, max, decimals) {
  //   const str = (Math.random() * (max - min) + min).toFixed(decimals);
  
  //   return parseFloat(str);
  // }

  return (
    <div className='d-flex row justify-content-end pt-2 m-auto'
      style={{ width: "90vw" }}
    >
      <button
        className="btn btn-secondary col-1 offset-11 mb-2"
        onClick={addToFavourites} > Favourites
      </button>
      <button
        className="btn btn-secondary col-1 offset-11 mb-2"
        onClick={resetMap} > Reset
      </button>
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