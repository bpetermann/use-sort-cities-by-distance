import { Loader } from '@googlemaps/js-api-loader'

const MILE_CONVERSION = 0.621371

class GoogleMaps {
  key!: string
  globalMaps: typeof google.maps | undefined
  private static instance: GoogleMaps
  coordinatesCache: Map<string, { lat: number; lng: number } | undefined> = new Map()

  private constructor(key: string) {
    this.key = key
    this.globalMaps = undefined
  }

  public static getInstance(key: string): GoogleMaps {
    if (!GoogleMaps.instance) {
      GoogleMaps.instance = new GoogleMaps(key)
    }

    return GoogleMaps.instance
  }

  async getMaps() {
    if (this.globalMaps) {
      return this.globalMaps
    }

    const google = await new Loader({
      apiKey: this.key,
      libraries: ['places'],
    }).load()

    this.globalMaps = google.maps
    return this.globalMaps
  }

  async getCoordinates(address: string) {
    if (this.coordinatesCache.has(address)) {
      return this.coordinatesCache.get(address)
    }

    const maps = await this.getMaps()

    if (!maps) return undefined

    return new Promise<{ lat: number; lng: number } | undefined>((resolve) => {
      const geocoder = new maps.Geocoder()

      geocoder.geocode({ address }, (results) => {
        if (!results) {
          resolve(undefined)
          return
        }
        const { lat, lng } = results[0].geometry.location
        const coordinates = { lat: lat(), lng: lng() }
        this.coordinatesCache.set(address, coordinates)
        resolve(coordinates)
      })
    })
  }

  async getDistance(from: { lat: number; lng: number }, to: { lat: number; lng: number }, unit: string) {
    const maps = await this.getMaps()

    if (!maps) return undefined

    return new Promise<number | undefined>((resolve) => {
      const service = new maps.DistanceMatrixService()

      service.getDistanceMatrix(
        {
          origins: [new maps.LatLng(from.lat, from.lng)],
          destinations: [new maps.LatLng(to.lat, to.lng)],
          travelMode: maps.TravelMode.DRIVING,
          unitSystem: maps.UnitSystem.METRIC,
        },
        (response) => {
          if (!response) {
            resolve(undefined)
            return
          }
          const { distance } = response.rows[0].elements[0]

          if (typeof distance !== 'object') {
            resolve(-1)
            return
          }

          const distanceValue = +(distance?.value / 1000).toFixed(2)
          const convertedDistance = unit === 'km' ? distanceValue : +(distanceValue * MILE_CONVERSION).toFixed(2)

          resolve(convertedDistance)
        },
      )
    })
  }
}

export default GoogleMaps
