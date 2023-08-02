import { useEffect, useState } from 'react'
import GoogleMaps from '../helpers/googleMaps'

type Location = {
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
  const [sorted, setSorted] = useState<Location[]>([])
  const [error, setError] = useState<boolean | string>(false)

  useEffect(() => {
    const sortByDistance = async () => {
      try {
        const googleMaps = new GoogleMaps(key)

        if (!location || !targets.length || !googleMaps) {
          return
        }

        const startingPoint = await googleMaps.getCoordinates(location)

        const targetCoordinates = await Promise.all(
          targets.map(async (item) => {
            const coordinates = await googleMaps.getCoordinates(item)
            return { city: item, ...coordinates }
          }),
        )

        if (startingPoint && targetCoordinates) {
          const targetsSorted = await Promise.all(
            targetCoordinates.map(async (item) => {
              if (!item.lat || !item.lng) return { ...item, distance: -1 }
              const distance = await googleMaps.getDistance({ lat: item.lat, lng: item.lng }, startingPoint)
              return { ...item, distance }
            }),
          )
            .then((results) => results.filter((result) => result.distance !== -1 && result.distance !== undefined))
            .then((results) => results as Location[])
            .then((results) => results.sort((a, b) => a.distance - b.distance))

          setSorted(targetsSorted)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }
    sortByDistance()
  }, [key, location, targets])

  if (error) {
    return { error }
  }

  return { sorted, error }
}

export default useNearestLocation
