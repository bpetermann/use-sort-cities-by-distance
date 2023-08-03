import { useState } from 'react'
import React from 'react'
import './App.css'
import cities from './cities.json'
import { useSortCitiesByDistance } from 'use-sort-cities-by-distance'

function App() {
  const [config, setConfig] = useState({
    list: cities,
    start: 'Vienna',
    targets: ['London', 'Amsterdam', 'Vienna', 'Berlin', 'Los Angeles', 'Paris', 'Barcelona', 'Shanghai', 'Dublin'],
  })

  const { sorted } = useSortCitiesByDistance(config)

  return (
    <>
      <div className='card'>
        <input
          onChange={(e) => {
            setConfig((prev) => ({ ...prev, start: e.target.value }))
          }}
        />
        <h2>Start: {config.start}</h2>

        {sorted?.map((item) => (
          <div key={item.city}>
            <p>
              {item.city} - {item.distance} km
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
