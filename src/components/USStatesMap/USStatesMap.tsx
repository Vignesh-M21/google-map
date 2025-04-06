/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleMap } from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";
import { usaPolygons } from "../../../util/restaurants";
// import { useGetPlaceIds } from "../../hooks/useGetPlaceIds";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 85px)",
  marginTop: "50px",
};

/**
 * Assume 600 is the max population density
 */
const MAX = 600;

/**
 * Get the value for the population density 1 - 10
 */
const getColorValue = (num: number) => {
  if (MAX < num) return 10;
  for (let i = 1; i <= 10; i++) {
    if (MAX / i < num) {
      return 10 - i;
    }
  }
  return 1;
};

/**
 * Pick the color depend upon the population density
 */
function getColor(value: number) {
  if (value <= 2) return "#e8d590";
  if (value <= 3) return "#ffeda0";
  if (value <= 4) return "#feb24c";
  if (value <= 5) return "#fd8d3c";
  if (value <= 6) return "#fc4e2a";
  if (value <= 7) return "#e31a1c";
  return "#b10026";
}

/**
 * USA state density with per miles but the data are not aquirate and not yet fully complete
 * We can more data usaPolygons array but that not a good approach
 */
function USStatesMap() {
  const mapRef = useRef<google.maps.Map | null>(null);
  // const placeIds = useGetPlaceIds();
  const [infoState, setInfoState] = useState(usaPolygons[0]);
  const handleClick = (state: any) => {
    setInfoState(state);
  };
  // DOCS Polygon: https://developers.google.com/maps/documentation/javascript/examples/polygon-simple?hl=en
  const onMapLoad = useCallback(async (map: google.maps.Map) => {
    mapRef.current = map;
    usaPolygons.forEach((state) => {
      const colorRange = getColor(getColorValue(state.density));
      const polygon = new google.maps.Polygon({
        paths: state.paths,
        strokeColor: `#fff`,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: colorRange,
        fillOpacity: 1,
      });

      polygon.addListener("click", () => handleClick(state));
      polygon.setMap(map);
    });

    // DOCS: [
    // https://developers.google.com/maps/documentation/javascript/examples/boundaries-choropleth
    // https://developers.google.com/maps/documentation/javascript/reference/data-driven-styling#FeatureLayer.isAvailable
    // ]

    // getFeatureLayer Not support our google keys
    // const featureLayer = map.getFeatureLayer(
    //   google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1
    // );

    // console.log({ featureLayer });
    // const featureStyleOptions: google.maps.FeatureStyleOptions = {
    //   strokeColor: "#810FCB",
    //   strokeOpacity: 1.0,
    //   strokeWeight: 3.0,
    //   fillColor: "#810FCB",
    //   fillOpacity: 0.5,
    // };
    // featureLayer.style = (featureStyleFunctionOptions) => {
    //   const placeFeature =
    //     featureStyleFunctionOptions.feature as google.maps.PlaceFeature;
    //   const population = states[placeFeature.placeId];

    //   let fillColor;
    // Specify colors using any of the following:
    // * Named ('green')
    // * Hexadecimal ('#FF0000')
    // * RGB ('rgb(0, 0, 255)')
    // * HSL ('hsl(60, 100%, 50%)')

    // if (population < 2000000) {
    //   fillColor = "green";
    // } else if (population < 5000000) {
    //   fillColor = "red";
    // } else if (population < 10000000) {
    //   fillColor = "blue";
    // } else if (population < 40000000) {
    //   fillColor = "yellow";
    // }
    // return {
    //   fillColor,
    //   fillOpacity: 0.5,
    // };
    // };
  }, []);

  // Hope i can clean this but i this on my future reference

  // useEffect(() => {
  //   if (mapRef.current) {
  //     const featureLayer = mapRef.current.getFeatureLayer(
  //       "ADMINISTRATIVE_AREA_LEVEL_1" as any
  //     );
  //     console.log({ featureLayer });
  //     // const featureStyleOptions: google.maps.FeatureStyleOptions = {
  //     //   strokeColor: "#810FCB",
  //     //   strokeOpacity: 1.0,
  //     //   strokeWeight: 3.0,
  //     //   fillColor: "#810FCB",
  //     //   fillOpacity: 0.5,
  //     // };
  //     // placeIds.map((i) => {
  //     // featureLayer.style = (options: { feature: { placeId: string } }) => {
  //     //   if (options.feature.placeId == "ChIJaX1dG9ZpZ1QRyTkHzz1jRLU") {
  //     //     // Hana, HI
  //     //     return featureStyleOptions;
  //     //   }
  //     // };
  //     // });
  //   }
  // }, [mapRef.current]);

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 39.8283, lng: -98.5795 }}
        zoom={4}
        onLoad={onMapLoad}
      />
      {infoState && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%px",
            minWidth: "250px",
            backgroundColor: "white",
            padding: "20px",
          }}
        >
          <p>State:-{infoState.name}</p>
          <p>{`${infoState.density} people per square mile`}</p>
        </div>
      )}
    </>
  );
}

export default USStatesMap;
