import { useEffect, useState } from 'react'
import googleMaps from './googleMaps'

type Point = {
  city: string
  lat: number
  lng: number
  distance: number
}

type Props = {
  location: string
  targets: string[]
}

const useSortByNearest = ({ location, targets }: Props) => {
  const [sorted, setSorted] = useState<Point[]>([])

  useEffect(() => {
    const sortDestinations = async () => {
      if (!location || !targets.length) {
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
    }
    sortDestinations()
  }, [location, targets])

  return sorted
}

export default useSortByNearest
