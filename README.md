## useSortCitiesByDistance 

[![npm version](https://badge.fury.io/js/use-sort-cities-by-distance.svg)](https://badge.fury.io/js/use-sort-cities-by-distance)

`useSortCitiesByDistance` is a simple react hook that enables you to sort an array of cities based on their proximity to a given point

### Installation

```js
npm install use-sort-cities-by-distance
```

### Usage

- Import the useSortCitiesByDistance hook from the package:

```js
import { useSortCitiesByDistance } from 'use-sort-cities-by-distance';
```

- Define your city data and configuration, and use the hook to get the sorted cities:

```js
import React, { useState } from 'react';
import { useSortCitiesByDistance } from 'use-sort-cities-by-distance';

function YourComponent() {

  const [config, setConfig] = useState({
    list: cities, // .json list of possible cities 
    start: 'London', // Starting point
    targets: ['London', 'Paris', 'New York', 'Barcelona'], // Array of target cities
  });

  const { sorted } = useSortCitiesByDistance(config);

  // Your component code
}
```

- The list property should be an array of cities in the following .json format

```json
[
  { "city": "Los Angeles", "latitude": 34.0522, "longitude": -118.2437 },
  { "city": "London", "latitude": 51.5074, "longitude": -0.1278 },
  { "city": "Tokyo", "latitude": 35.6895, "longitude": 139.6917 }
]
```

### Contributing

Contributions, issues, and feature requests are welcome!

### License

This project is licensed under the MIT License
