import calcDistance from '../src/helpers/calcDistance'

describe('calcDistance', () => {
  it('calculates distance between two points in km', () => {
    expect(calcDistance('km', 0, 0, 0, 0)).toBe(0)
    expect(calcDistance('km', 52.3676, 4.9041, 51.5074, -0.1278)).toBeCloseTo(357.89, 2)
  })

  it('calculates distance between two points in miles', () => {
    expect(calcDistance('mile', 0, 0, 0, 0)).toBe(0)
    expect(calcDistance('mile', 52.3676, 4.9041, 51.5074, -0.1278)).toBeCloseTo(222.39, 2)
  })
})
