import { useEffect, useState } from 'react'
import calcDistance from '../helpers/calcDistance'
import GoogleMaps from '../helpers/googleMaps'

type Location = {
  city: string
  lat: number
  lng: number
  distance: number
}

type TempLocations = {
  city: string
  lat: number | undefined
  lng: number | undefined
}

type Cities = {
  city: string
  lat: number
  lng: number
}

type LocationError = {
  hasError: boolean
  message: string
}

type Props = {
  list?: Cities[]
  key?: string
  start: string
  targets: string[]
  unit?: string
  travelDistance?: boolean
}

const getCoordinates = (targets: string[], cities: Cities[]) => {
  return targets.map((i) => {
    const city = cities.find((c) => c.city === i)
    return {
      city: i,
      lat: city?.lat ?? undefined,
      lng: city?.lng ?? undefined,
    }
  })
}

const getMapCoordinates = async (targets: string[], maps: GoogleMaps) => {
  return await Promise.all(
    targets.map(async (i) => {
      const coordinates = await maps.getCoordinates(i)

      return {
        city: i,
        lat: coordinates?.lat ?? undefined,
        lng: coordinates?.lng ?? undefined,
      }
    }),
  )
}

const calcTravelDistance = async (
  start: { lat: number; lng: number },
  targets: TempLocations[],
  maps: GoogleMaps,
  unit: string,
) => {
  return await Promise.all(
    targets.map(async (i) => {
      if (!i.lat || !i.lng) return { ...i, distance: -1 }
      const distance = await maps.getDistance({ lat: i.lat || 0, lng: i.lng || 0 }, start, unit)
      return { ...i, distance: distance }
    }),
  )
}

const calcStraightDistance = (start: { lat: number; lng: number }, targets: TempLocations[], unit: string) => {
  const { lat, lng } = start

  return targets.map((i) => {
    if (!i.lat || !i.lng) return { ...i, distance: -1 }
    const distance = calcDistance(unit, i.lat, i.lng, lat, lng)
    return { ...i, distance: distance }
  })
}

const useNearestLocation = ({ list, key, start = '', targets = [], unit = 'mile', travelDistance = false }: Props) => {
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
        startingPoint = cities.find((i) => i.city === start)
        targetPoints = getCoordinates(targets, cities)
      } else if (googleMaps) {
        try {
          startingPoint = await googleMaps.getCoordinates(start)
          targetPoints = await getMapCoordinates(targets, googleMaps)
        } catch (err) {
          setError({ hasError: true, message: err instanceof Error ? err.message : 'Something went wrong' })
        }
      }

      if (startingPoint?.lat && startingPoint?.lng && targetPoints) {
        let distances

        if (travelDistance && googleMaps) {
          distances = await calcTravelDistance(startingPoint, targetPoints, googleMaps, unit)
        } else {
          distances = calcStraightDistance(startingPoint, targetPoints, unit)
        }

        const cleanedDistances = distances
          .filter((i) => i.distance !== -1)
          .filter((i): i is Location => !!i)
          .sort((a, b) => a.distance - b.distance)

        setSorted(cleanedDistances)
      }
    }
    sortByDistance()
  }, [key, list, start, targets, travelDistance, unit])

  return { sorted, error }
}

export default useNearestLocation
