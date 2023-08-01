import { useEffect, useState } from 'react'
import GoogleMaps from '../helpers/googleMaps'

type Point = {
  city: string
  lat: number
  lng: number
  distance: number
}

type Props = {
  key: string
  location: string
  targets: string[]
}

const useNearestLocation = ({ key = '', location = '', targets = [] }: Props) => {
  const [sorted, setSorted] = useState<Point[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const sortNearestLocations = async () => {
      try {
        const googleMaps = new GoogleMaps(key)

        if (!location || !targets.length || !googleMaps) {
          return
        }

        const startingPoint = await googleMaps.getCoordinates(location ?? '')

        const targetsWithCoordinates = await Promise.all(
          targets.map(async (item) => {
            const coordinates = await googleMaps.getCoordinates(item)
            return { city: item, ...coordinates }
          }),
        )

        if (startingPoint && targetsWithCoordinates) {
          const sorted = await Promise.all(
            targetsWithCoordinates.map(async (item) => {
              const distance = await googleMaps.getDistance({ lat: item.lat || 0, lng: item.lng || 0 }, startingPoint)
              return { ...item, distance }
            }),
          )
            .then((results) => results.filter((result) => result.distance !== undefined))
            .then((results) => results as Point[])
            .then((results) => results.sort((a, b) => a.distance - b.distance))

          setSorted(sorted)
        }
      } catch (err) {
        let message = 'Something went wrong'
        if (err instanceof Error) message = err.message
        setError(message)
      }
    }
    sortNearestLocations()
  }, [key, location, targets])

  if (error) {
    return { error }
  }

  return sorted
}

export default useNearestLocation
