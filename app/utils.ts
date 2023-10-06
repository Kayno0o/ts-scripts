function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0
  }
  else {
    const radlat1 = (Math.PI * lat1) / 180
    const radlat2 = (Math.PI * lat2) / 180
    const theta = lon1 - lon2
    const radtheta = (Math.PI * theta) / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1)
      dist = 1

    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return Math.round(dist)
  }
}

function orderByDistance(items: Array<{ lat: number; lng: number; distance?: number }>, pos: { lat: number; lng: number }) {
  items.forEach((item) => {
    const distance = getDistance(pos.lat, pos.lng, item.lat, item.lng)
    item.distance = distance
  })

  items.sort((a, b) => {
    return a.distance - b.distance
  })

  return items
}
