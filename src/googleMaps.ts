import { Loader } from '@googlemaps/js-api-loader'

type GoogleMapsLocation = { id?: string; text: string }

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_API,
  libraries: ['places'],
})

let globalMaps: typeof google.maps
const getMaps = async () => {
  if (typeof window === 'undefined') return undefined
  if (globalMaps) return globalMaps

  const google = await loader.load()

  globalMaps = google.maps

  return globalMaps
}

const googleMaps = {
  getCoordinates: async (address: string) => {
    const maps = await getMaps()

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
  },

  getDistance: async (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    const maps = await getMaps()

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
  },
}

export default googleMaps
export { type GoogleMapsLocation }
