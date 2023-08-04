const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

const calcDistance = (unit: string, lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = unit === 'km' ? 6371 : 3959
  const dLat = degreesToRadians(lat2 - lat1)
  const dLon = degreesToRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = R * c

  return +distance.toFixed(2)
}

export default calcDistance
