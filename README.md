# useSortCitiesByDistance

[![npm version](https://badge.fury.io/js/use-sort-cities-by-distance.svg)](https://badge.fury.io/js/use-sort-cities-by-distance)

`useSortCitiesByDistance` is a simple react hook that enables you to sort an array of cities based on their proximity to a given point. The distance is calculated with a straight line (not travel distance) between the places

## Getting started

### Installation

```bash
npm install use-sort-cities-by-distance
#or
yarn add use-sort-cities-by-distance
```

Import the 'useSortCitiesByDistance' hook from the package:

```jsx
import { useSortCitiesByDistance } from 'use-sort-cities-by-distance'
```

### Usage with JSON Data

Define your starting point, target destinations, and a '.json' list with coordinates of the possible targets:

```jsx
import React, { useState } from 'react'
import { useSortCitiesByDistance } from 'use-sort-cities-by-distance'
import cities from './cities.json'

function YourComponent() {
  const [config, setConfig] = useState({
    list: cities, // List of possible cities
    start: 'London', // Starting point
    targets: ['London', 'Paris', 'New York', 'Barcelona'], // Array of target cities
    // unit: 'km', // Optional, default is 'mile', enter 'km' if you need kilometers
  })

  const { sorted } = useSortCitiesByDistance(config)

  // Your component code
}
```

The list property should be an array of cities in the following .json format. A demo list can be found in the demo folder:

```json
[
  { "city": "Los Angeles", "lat": 34.0522, "lng": -118.2437 },
  { "city": "London", "lat": 51.5074, "lng": -0.1278 },
  { "city": "Tokyo", "lat": 35.6895, "lng": 139.6917 }
]
```

### Usage with Google Maps

Instead of a list, you can also use the hook with the Google Maps API. Just enter your key as the "key" property and omit the "list":

```jsx
const config = {
  key: '******', // Google Maps API key
  start: 'London',
  targets: ['London', 'Paris', 'New York', 'Barcelona'],
}
```

### Contributing

Contributions, issues, and feature requests are welcome!

### License

This project is licensed under the MIT License
