import React from 'react'
import { useState } from 'react'
import cities from './cities.json'
import { useSortCitiesByDistance } from 'use-sort-cities-by-distance'

const addCities = ['Paris', 'Undefined', 'Barcelona', 'Shanghai', 'Dublin']

function App() {
  const [config, setConfig] = useState({
    list: cities,
    start: 'Vienna',
    targets: ['London', 'Amsterdam', 'Vienna', 'Berlin', 'Los Angeles'],
  })

  const { sorted } = useSortCitiesByDistance(config)

  return (
    <>
      <header>
        <h2>useSortCitiesByDistance</h2>
      </header>
      <div className='card'>
        <h3>
          <span>Start:</span> {config.start}
        </h3>
        <input
          type='text'
          onChange={(e) => {
            setConfig((prev) => ({ ...prev, start: e.target.value }))
          }}
        />

        {sorted?.map((item) => (
          <div key={item.city}>
            <p>
              <span>{item.city}</span> - {item.distance} km
            </p>
          </div>
        ))}
      </div>

      <div className='add'>
        Add:
        {addCities?.map((item) => (
          <div key={item}>
            {!config.targets.includes(item) && (
              <button
                onClick={() => {
                  setConfig({ ...config, targets: [...config.targets, item] })
                }}
              >
                {item}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
