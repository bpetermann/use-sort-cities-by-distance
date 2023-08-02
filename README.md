## use-sort-cities-by-distance

[![npm version](https://badge.fury.io/js/use-sort-cities-by-distance.svg)](https://badge.fury.io/js/use-sort-cities-by-distance)

`use-sort-cities-by-distance` is a simple react hook that enables you to sort an array of cities based on their proximity to a given point.

### Installation

```
npm install use-sort-cities-by-distance
```

### Usage

- Import the useSortCitiesByDistance hook from the package:

```
import { useSortCitiesByDistance } from 'use-sort-cities-by-distance';
```

- Define your city data and configuration, and use the hook to get the sorted cities:

```
import React, { useState } from 'react';
import { useSortCitiesByDistance } from 'use-sort-cities-by-distance';

function YourComponent() {
  const [config, setConfig] = useState({
    list: cities,
    start: 'London', // Starting point
    targets: ['London', 'Paris', 'New York', 'Barcelona'], // Array of target cities
  });

  const { sorted } = useSortCitiesByDistance(config);

  // Your component code
}
```

- The list property should be an array of cities in the following JSON format:

```
[
  { "city": "City Name", "lat": 12.345, "lon": 67.890 },
  // More city objects...
]
```

### Contributing

Contributions, issues, and feature requests are welcome!

### License

This project is licensed under the MIT License.
