/**
 * Calculates the distance between two points on the Earth's surface using the Haversine formula.
 *
 * @param {number} lat1 - The latitude of the first point in degrees.
 * @param {number} lon1 - The longitude of the first point in degrees.
 * @param {number} lat2 - The latitude of the second point in degrees.
 * @param {number} lon2 - The longitude of the second point in degrees.
 * @returns {number} The distance between the two points in kilometers, rounded to the nearest integer.
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0
  }

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
  dist *= 1.609344
  return Math.round(dist)
}

/**
 * Map a value from a range to another
 *
 * @param {number} value The value to map
 * @param {number} imin Min input value
 * @param {number} imax Max input value
 * @param {number} omin Min output value
 * @param {number} omax Max output value
 * @returns {number} Computed value
 */
export function map(value: number, imin: number, imax: number, omin: number, omax: number): number {
  return omin + (omax - omin) * ((value - imin) / (imax - imin))
}

/**
 * Return a number between min and max. If no max given, return a number between 0 and min
 *
 * @param {number} min Min value
 * @param {number} max Max value
 * @returns {number} Random number
 */
export function randomInt(min: number, max: number | null = null): number {
  return Math.floor(Math.random() * (max ? max - min : min) + (max ? min : 0))
}

export function msDurationToTime(duration: number): string {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / 1000 / 60) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))

  return `${days > 0 ? `${days}j ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes}m ${
    seconds < 10 ? `0${seconds}` : seconds
  }s`
}

export function msDurationToTimeObject(duration: number): { days: number, hours: number, minutes: number, seconds: number } {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / 1000 / 60) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))

  return { days, hours, minutes, seconds }
}

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

export function getDateFromDayMonth(day: number, month: number): Date {
  const date = new Date()
  date.setMonth(month - 1)
  date.setDate(day)
  return date
}

export function getNextDateFromDayMonth(day: number, month: number): Date {
  const date = getDateFromDayMonth(day, month)
  if (date.getTime() < Date.now())
    date.setFullYear(date.getFullYear() + 1)

  return date
}

export function diffTime(dateFrom: Date, dateTo: Date): number {
  return Math.abs(dateTo.getTime() - dateFrom.getTime())
}

export function startOfDay(date: Date): Date {
  date.setHours(0, 0, 0, 0)
  return date
}

export function startOfToday(): Date {
  return startOfDay(new Date())
}

export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''

  for (let i = 0; i < length; i++)
    text += chars.charAt(Math.floor(Math.random() * chars.length))

  return text
}

export function isLink(str: string): boolean {
  const regex = /(http|https):\/\/(\w+(?::\w*)?@)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%@\-/]))?/
  return regex.test(str)
}

export function hexToRgb(hex: string): [number, number, number] {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  return [r, g, b]
}

export function rgbToHex(rgb: [number, number, number]): string {
  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)}`
}

export function deepEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length)
    return false

  return arr1.every((val, index) => {
    const val2 = arr2[index]

    if (Array.isArray(val) || Array.isArray(val2)) {
      if (!Array.isArray(val))
        return false

      if (!Array.isArray(val2))
        return false

      return deepEqual(val, val2)
    }

    return val === val2
  })
}
