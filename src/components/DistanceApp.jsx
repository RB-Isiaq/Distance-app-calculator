import { useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const DistanceApp = () => {
  const [address, setAddress] = useState(false);
  const [latLng, setLatLng] = useState(true);
  const [latlngPointA, setLatlngPointA] = useState("");
  const [latlngPointB, setLatlngPointB] = useState("");
  const [addressPointA, setAddressPointA] = useState("");
  const [addressPointB, setAddressPointB] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);

  const selectHandler = (e) => {
    const distanceType = e.target.value;

    if (distanceType === "address") {
      setAddress(true);
      setLatLng(false);
    }
    if (distanceType === "latlng") {
      setLatLng(true);
      setAddress(false);
    }
  };
  const distanceCalculator = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (address) {
      try {
        const resA = await axios.get(
          `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
            addressPointA
          )}&apiKey=${import.meta.env.HERE_API_KEY}`
        );
        console.log(resA);
        const { items: itemsA } = resA.data;
        const { lat: latA, lng: lngA } = itemsA[0].position;
        setLatlngPointA(`${latA},${lngA}`);
        const resB = await axios.get(
          `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
            addressPointB
          )}&apiKey=${import.meta.env.HERE_API_KEY}`
        );
        console.log(resB);
        const { items: itemsB } = resB.data;
        const { lat: latB, lng: lngB } = itemsB[0].position;
        setLatlngPointB(`${latB},${lngB}`);
      } catch (error) {
        alert(`Address geocoding error ${error}`);
      }
    }

    const [latA, lngA] = latlngPointA.split(",");
    const [latB, lngB] = latlngPointB.split(",");

    const radlatA = (Math.PI * latA) / 180;
    const radlngA = (Math.PI * lngA) / 180;
    const radlatB = (Math.PI * latB) / 180;
    const radlngB = (Math.PI * lngB) / 180;

    const theta = lngA - lngB;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlatA) * Math.sin(radlatB) +
      Math.cos(radlatA) * Math.cos(radlatB) * Math.cos(radtheta);

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344; // Convert to kilometers

    if (!dist) {
      setDistance(
        "Please input a correct format for the latitude and longitude e.g. 53.35,23.35"
      );
      setLoading(false);
      return;
    }
    setDistance(
      `The distance between point A and point B is ${dist.toFixed(2)}km`
    );
    setLoading(false);
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
          className="py-2 px-4 rounded-xl border-none outline-none"
        >
          <option value="latlng">Latitude and Longitude</option>
          <option value="address">Address</option>
        </select>

        {latLng && (
          <>
            <label htmlFor="from">From Point A</label>
            <input
              id="from"
              type="text"
              placeholder="lat,lng"
              value={latlngPointA}
              onChange={(e) => setLatlngPointA(e.target.value)}
              required
              className="py-2 px-4 rounded-xl border-none outline-none"
            />
            <label htmlFor="to">To Point B</label>
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
            <label htmlFor="from">From Point A</label>
            <input
              id="from"
              type="text"
              placeholder="Nigeria"
              value={addressPointA}
              onChange={(e) => setAddressPointA(e.target.value)}
              required
              className="py-2 px-4 rounded-xl border-none outline-none"
            />
            <label htmlFor="to">To Point B</label>
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
        <div className="flex flex-col items-center gap-4 w-[100%] md:w-2/3">
          <p>{distance}</p>
          <LoadScript googleMapsApiKey={`${import.meta.env.GOOGLE_API_KEY}`}>
            <GoogleMap>
              <Marker
                position={{
                  lat: +latlngPointA.split(",")[0],
                  lng: +latlngPointA.split(",")[1],
                }}
              />
              <Marker
                position={{
                  lat: +latlngPointB.split(",")[0],
                  lng: +latlngPointB.split(",")[1],
                }}
              />
            </GoogleMap>
          </LoadScript>
        </div>
      )}
    </div>
  );
};

export default DistanceApp;
