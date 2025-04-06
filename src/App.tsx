import { Library } from "@googlemaps/js-api-loader";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";
import { restaurants } from "../util/restaurants";
import USStatesMap from "./components/USStatesMap/USStatesMap";

/**
 * You change icon here
 */
export const markerOptions = {
  icon: {
    url: "http://maps.google.com/mapfiles/ms/icons/blue.png",
  },
};

function App() {
  const librariesKey = useRef(["places", "maps"]);
  const [infoIndex, setInfoIndex] = useState<number | null>(1);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GEOCODE_KEY || "",
    libraries: librariesKey.current as Library[],
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    mapRef.current.setOptions({ clickableIcons: false });
  }, []);

  if (!isLoaded) return null;
  return (
    <>
      <h1>Chennai Food locations</h1>
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 85px)",
          position: "relative",
        }}
      >
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          onLoad={handleMapLoad}
          id="map"
          center={{ lat: 13.0331, lng: 80.2675 }}
          zoom={12}
        >
          {/* We can use clustor if the icons are messy */}
          {restaurants?.map((i, index) => (
            <Marker
              key={i.name}
              position={{ lat: i.lat, lng: i.long }}
              onClick={() => setInfoIndex(index)}
              icon={{ url: markerOptions.icon.url }}
            />
          ))}
          {infoIndex && (
            <InfoWindow
              position={{
                lat: restaurants[infoIndex].lat,
                lng: restaurants[infoIndex].long,
              }}
              onCloseClick={() => setInfoIndex(null)}
            >
              <div
                style={{
                  maxWidth: "300px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <strong>{restaurants[infoIndex].name}</strong>
                <span>{restaurants[infoIndex].des}</span>
                <span>{restaurants[infoIndex].address}</span>
                <div>
                  <span>{restaurants[infoIndex].open_time}</span>
                  <span style={{ marginLeft: "8px" }}>
                    {restaurants[infoIndex].starting_price}
                  </span>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      {/* This component was not fully completed */}
      <h1>Example for polygon</h1>
      <div style={{ position: "relative" }}>
        <USStatesMap />
      </div>
    </>
  );
}

export default App;
