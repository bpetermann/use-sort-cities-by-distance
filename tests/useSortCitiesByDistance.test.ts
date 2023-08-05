import useNearestLocation from '../src/hooks/useSortCitiesByDistance'
import { renderHook } from '@testing-library/react'

describe('useNearestLocation', () => {
  it('sorts locations by distance', () => {
    const list = [
      { city: 'City A', lat: 34.0522, lng: -118.2437 },
      { city: 'City B', lat: 37.7749, lng: -122.4194 },
      { city: 'City C', lat: 41.8781, lng: -87.6298 },
    ]

    const start = 'City A'
    const targets = ['City B', 'City C']
    const unit = 'mile'

    const { result } = renderHook(() =>
      useNearestLocation({
        list,
        start,
        targets,
        unit,
      }),
    )

    const expectedSorted = [
      { city: 'City B', lat: 37.7749, lng: -122.4194, distance: expect.any(Number) },
      { city: 'City C', lat: 41.8781, lng: -87.6298, distance: expect.any(Number) },
    ]

    expect(result.current.error).toEqual({ hasError: false, message: '' })
    expect(result.current.sorted).toEqual(expectedSorted)
  })
})
