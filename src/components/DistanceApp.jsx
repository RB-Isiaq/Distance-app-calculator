import { useState, useMemo } from "react";
import axios from "axios";
import Map from "./Map";

const DistanceApp = () => {
  // Declaring state variables
  const [address, setAddress] = useState(false);
  const [latLng, setLatLng] = useState(true);
  const [latlngPointA, setLatlngPointA] = useState("");
  const [latlngPointB, setLatlngPointB] = useState("");
  const [addressPointA, setAddressPointA] = useState("");
  const [addressPointB, setAddressPointB] = useState("");
  const [distance, setDistance] = useState("");
  const [mapCenter, setMapCenter] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // API KEY
  const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY;

  const selectHandler = (e) => {
    const distanceType = e.target.value;

    if (distanceType === "address") {
      setAddress(!address);
      setLatLng(!latLng);
    }
    if (distanceType === "latlng") {
      setLatLng(!latLng);
      setAddress(!address);
    }
  };
  const distanceCalculator = async (event) => {
    event.preventDefault();
    setLoading(true);
    let latA, lngA, latB, lngB;
    if (address) {
      try {
        const resA = await axios.get(
          `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
            addressPointA
          )}&apiKey=${HERE_API_KEY}`
        );
        const { items: itemsA } = resA.data;
        const { lat, lng } = itemsA[0].position;
        latA = lat;
        lngA = lng;
        // setLatlngPointA(`${latA},${lngA}`);
        const resB = await axios.get(
          `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
            addressPointB
          )}&apiKey=${HERE_API_KEY}`
        );
        const { items: itemsB } = resB.data;
        const { lat: lat2, lng: lng2 } = itemsB[0].position;
        latB = lat2;
        lngB = lng2;
        // setLatlngPointB(`${latB},${lngB}`);
      } catch (error) {
        alert(`Address geocoding error ${error}`);
      }
    }

    // Calculating the distance using the harversine formula
    if (latLng) {
      [latA, lngA] = latlngPointA.split(",");
      [latB, lngB] = latlngPointB.split(",");
    }
    // Set map center to point A
    setMapCenter({
      lat: parseFloat(latA),
      lng: parseFloat(lngA),
    });

    // Set marker position to point B
    setMarkerPosition([parseFloat(latB), parseFloat(lngB)]);

    const toRadians = (degrees) => {
      return degrees * (Math.PI / 180);
    };
    const deltaLat = toRadians(latB - latA);
    const deltaLng = toRadians(lngB - lngA);

    const radlatA = toRadians(latA);
    const radlatB = toRadians(latB);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(radlatA) * Math.cos(radlatB) * Math.sin(deltaLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const earthRadius = 6371; // in kilometers

    const distance = earthRadius * c;
    // This here also works and provide the same ans
    const theta = lngA - lngB;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlatA) * Math.sin(radlatB) +
      Math.cos(radlatA) * Math.cos(radlatB) * Math.cos(radtheta);

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344; // Convert to kilometers
    if (!distance) {
      setError(true);
      setLoading(false);
      return;
    }
    setDistance(`Distance: ${distance.toFixed(2)}km`);
    setLoading(false);
    setError(false);
  };
  return (
    <div className="flex flex-col justify-evenly items-center gap-10 md:flex-row lg:p-10">
      <form
        onSubmit={distanceCalculator}
        className="flex flex-col justify-around gap-6 md:ml-3 w-[100%] md:w-1/3"
      >
        <label htmlFor="distance">Distance type by</label>
        <select
          id="distance"
          onChange={selectHandler}
          className="bg-white py-2 px-4 rounded-xl border-none outline-none"
        >
          <option value="latlng">Latitude and Longitude</option>
          <option value="address">Address</option>
        </select>

        {latLng && (
          <>
            <label htmlFor="from">From point A</label>
            <input
              id="from"
              type="text"
              placeholder="lat,lng"
              value={latlngPointA}
              onChange={(e) => setLatlngPointA(e.target.value)}
              required
              className="py-2 px-4 rounded-xl border-none outline-none"
            />
            <label htmlFor="to">To point B</label>
            <input
              id="to"
              type="text"
              placeholder="lat,lng"
              value={latlngPointB}
              onChange={(e) => setLatlngPointB(e.target.value)}
              required
              className="py-2 px-4 rounded-xl border-none outline-none"
            />
          </>
        )}
        {address && (
          <>
            <label htmlFor="from">From point A</label>
            <input
              id="from"
              type="text"
              placeholder="Nigeria"
              value={addressPointA}
              onChange={(e) => setAddressPointA(e.target.value)}
              required
              className="py-2 px-4 rounded-xl border-none outline-none"
            />
            <label htmlFor="to">To point B</label>
            <input
              id="to"
              type="text"
              placeholder="Canada"
              value={addressPointB}
              onChange={(e) => setAddressPointB(e.target.value)}
              required
              className="py-2 px-4 rounded-xl border-none outline-none"
            />
          </>
        )}

        <button
          type="submit"
          className="bg-white rounded-xl p-4 w-[max-content] m-auto"
        >
          Calculate Distance
        </button>
      </form>
      {loading ? (
        <img src="/loader.svg" alt="" />
      ) : (
        <div className="flex flex-col justify-center items-center gap-4 w-[100%] md:w-2/3">
          {error ? (
            <p className="text-red-500 text-center">
              Please input a correct format for the latitude and longitude e.g.
              53.35,23.35
            </p>
          ) : (
            distance && (
              <p className="text-center text-[17px]">
                The distance between point A and point B is <br />
                {distance}
              </p>
            )
          )}

          {!error && mapCenter && markerPosition && (
            <Map center={mapCenter} markerPosition={markerPosition} />
          )}
        </div>
      )}
    </div>
  );
};

export default DistanceApp;
