import React from 'react';
import { useState } from 'react';
import cities from './cities.json';
import { useSortCitiesByDistance } from 'use-sort-cities-by-distance';

const addCities = ['Paris', 'Undefined', 'Barcelona', 'Shanghai'];

function App() {
  const [config, setConfig] = useState({
    list: cities,
    start: 'Vienna',
    targets: ['London', 'Amsterdam', 'Vienna', 'Berlin', 'Los Angeles'],
    unit: 'miles',
  });

  const miles = config.unit === 'miles';

  const { sorted } = useSortCitiesByDistance(config);

  return (
    <>
      <header>
        <div className='logo'>
          <h2>useSortCitiesByDistance</h2>
          <div className='icon'>
            <span className='material-symbols-outlined'>distance</span>
          </div>
        </div>
        <input
          type='text'
          placeholder='Change start'
          onChange={(e) => {
            setConfig((prev) => ({ ...prev, start: e.target.value }));
          }}
        />
      </header>
      <div className='unit'>
        <div>
          <button
            className={`unit-btn ${!miles ? 'active' : ''}`}
            onClick={() => {
              setConfig((prev) => ({ ...prev, unit: 'km' }));
            }}
          >
            km
          </button>
          <button
            className={`unit-btn ${miles ? 'active' : ''}`}
            onClick={() => {
              setConfig((prev) => ({ ...prev, unit: 'miles' }));
            }}
          >
            miles
          </button>
        </div>
      </div>
      <main>
        <div className='card'>
          <h3>
            <span>Start:</span> {config.start}
          </h3>
          {sorted?.map((item) => (
            <div key={item.city}>
              <p>
                <span>{item.city}</span> - {item.distance} {config.unit}
              </p>
            </div>
          ))}
        </div>

        <div className='add'>
          <div>
            <p>Add</p>
          </div>
          <div>
            {addCities?.map((item) => (
              <div key={item}>
                {!config.targets.includes(item) && (
                  <button
                    onClick={() => {
                      setConfig({
                        ...config,
                        targets: [...config.targets, item],
                      });
                    }}
                  >
                    {item}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer>
        <a href='https://github.com/bpetermann/use-sort-cities-by-distance'>
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/%3E%3C/svg%3E"
            alt={'github logo'}
          />
        </a>
        <a href='mailto:benjamin.petermann@gmx.at'>
          <img
            src='https://svelte-shopping-cart.vercel.app/images/mail.png'
            width='24'
            height='24'
            alt={'mail icon'}
          />
        </a>
      </footer>
    </>
  );
}

export default App;
