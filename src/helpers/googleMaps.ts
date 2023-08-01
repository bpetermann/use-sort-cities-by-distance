import { Loader } from '@googlemaps/js-api-loader'

class GoogleMaps {
  key: string
  globalMaps: typeof google.maps | undefined

  constructor(key: string) {
    this.key = key
    this.globalMaps = undefined
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
        resolve({ lat: lat(), lng: lng() })
      })
    })
  }

  async getDistance(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
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
          resolve(distance.value)
        },
      )
    })
  }
}

export default GoogleMaps
