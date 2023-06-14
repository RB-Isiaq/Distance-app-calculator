# Distance App Calculator

This app calculates the distance between two points using the haversine formula

```js
a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlong/2)
c = 2 * atan2(√a, √(1-a))
d = R * c
```

Where:

- lat1 and lat2 are the latitudes of the two points,
- long1 and long2 are the longitudes of the two points,
- Δlat = lat2 - lat1,
- Δlong = long2 - long1,
- R is the radius of the Earth (mean radius = 6,371 km).
- The link to the code

In React Code snippet we can have for example:

```js
import React from "react";

const DistanceCalculator = () => {
  const calculateDistance = () => {
    const lat1 = 54;
    const long1 = 50;
    const lat2 = 55;
    const long2 = 60;

    const toRadians = (degrees) => {
      return degrees * (Math.PI / 180);
    };

    const deltaLat = toRadians(lat2 - lat1);
    const deltaLong = toRadians(long2 - long1);

    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLong / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const earthRadius = 6371; // in kilometers
    const distance = earthRadius * c;

    return distance;
  };

  return (
    <div>
      <h1>Distance Calculator</h1>
      <button onClick={() => console.log(calculateDistance())}>
        Calculate Distance
      </button>
    </div>
  );
};

export default DistanceCalculator;
```

- #### [Live Link](https://distance-app-calculator.vercel.app)
