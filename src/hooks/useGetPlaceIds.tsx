import { useEffect, useState } from "react";
import { statesInUSA } from "../../util/restaurants";

const getPlaceIdsForStates = async () => {
  const placeIds = [];

  for (const statePlace of statesInUSA) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${statePlace},USA&key=${
          import.meta.env.VITE_GEOCODE_KEY
        }`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        placeIds.push({
          state: statePlace,
          placeId: data.results[0].place_id,
        });
      }
    } catch (error) {
      console.error(`Error fetching placeId for ${statePlace}:`, error);
    }
  }

  return placeIds;
};

type PlaceIds =
  | {
      state: string;
      placeId: string;
    }[]
  | null;

export function useGetPlaceIds() {
  const [placeIds, setPlaceIds] = useState<PlaceIds>(null);

  useEffect(() => {
    getPlaceIdsForStates().then((data) => setPlaceIds(data));
  }, []);

  return placeIds;
}
