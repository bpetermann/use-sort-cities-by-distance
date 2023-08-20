import { useEffect, useState } from 'react'
import calcDistance from '../helpers/calcDistance'
import GoogleMaps from '../helpers/googleMaps'

type Location = {
  city: string
  lat: number
  lng: number
  distance?: number
}

type LocationError = {
  hasError: boolean
  message: string
}

type Props = {
  list?: Location[]
  key?: string
  start: string
  targets: string[]
  unit?: string
}

const useNearestLocation = ({ list, key, start = '', targets = [], unit = 'mile' }: Props) => {
  const [sorted, setSorted] = useState<Location[]>([])
  const [error, setError] = useState<LocationError>({ hasError: false, message: '' })

  useEffect(() => {
    const sortByDistance = async () => {
      const cities = list ? list : undefined
      const googleMaps = key ? GoogleMaps.getInstance(key) : undefined

      if (!start || !targets.length || (!list && !key)) {
        return
      }

      let startingPoint: { lat: number; lng: number } | undefined
      let targetPoints

      if (cities) {
        startingPoint = cities.find((_) => _.city === start)
        targetPoints = targets.map((item) => {
          const city = cities.find((_) => _.city === item)
          return {
            city: item,
            lat: city?.lat ?? undefined,
            lng: city?.lng ?? undefined,
          }
        })
      } else if (googleMaps) {
        try {
          startingPoint = await googleMaps.getCoordinates(start)
          targetPoints = await Promise.all(
            targets.map(async (item) => {
              const coordinates = await googleMaps.getCoordinates(item)
              return { city: item, lat: coordinates?.lat ?? undefined, lng: coordinates?.lng ?? undefined }
            }),
          )
        } catch (err) {
          setError({ hasError: true, message: err instanceof Error ? err.message : 'Something went wrong' })
        }
      }

      if (startingPoint?.lat && startingPoint?.lng && targetPoints) {
        const { lat, lng } = startingPoint

        const distances = targetPoints.map((item) => {
          if (!item.lat || !item.lng) return { ...item, distance: -1 }
          const distance = calcDistance(unit, item.lat, item.lng, lat, lng)
          return { ...item, distance: distance }
        })

        const sorted = distances.filter((_) => _.distance !== -1).sort((a, b) => a.distance - b.distance) as Location[]

        setSorted(sorted)
      }
    }
    sortByDistance()
  }, [key, list, start, targets, unit])

  return { sorted, error }
}

export default useNearestLocation
