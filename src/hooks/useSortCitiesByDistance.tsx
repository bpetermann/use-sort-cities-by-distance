import { useEffect, useState } from 'react'
import calcDistance from '../helpers/calcDistance'

type Location = {
  city: string
  lat: number
  lng: number
  distance?: number
}

type Props = {
  list: Location[]
  start: string
  targets: string[]
}

const useNearestLocation = ({ list, start = '', targets = [] }: Props) => {
  const [sorted, setSorted] = useState<Location[]>([])

  useEffect(() => {
    const cities = list

    if (!start || !targets.length) {
      return
    }
    const startingPoint = cities.find((_) => _.city === start)

    const targetPoints = targets.map((item) => {
      const city = cities.find((_) => _.city === item)
      return {
        city: item,
        lat: city?.lat ?? -1,
        lng: city?.lng ?? -1,
      }
    })

    if (startingPoint && targetPoints) {
      const distances = targetPoints.map((item) => {
        if (!item.lat || !item.lng) return { ...item, distance: -1 }
        const distance = calcDistance(item.lat, item.lng, startingPoint.lat, startingPoint.lng)
        return { ...item, distance: distance }
      })

      const sorted = distances.filter((_) => _.distance !== -1).sort((a, b) => a.distance - b.distance)

      setSorted(sorted)
    }
  }, [list, start, targets])

  return { sorted }
}

export default useNearestLocation
