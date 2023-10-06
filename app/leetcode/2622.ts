const TimeLimitedCache = function () {
  this.cache = new Map()
}

TimeLimitedCache.prototype.set = function (key, value, duration) {
  let val = false
  if (this.get(key) !== -1) {
    val = true
    clearTimeout(this.cache.get(key).del)
  }
  this.cache.set(key, {
    value,
    del: setTimeout(() => this.cache.delete(key), duration),
  })
  return val
}

TimeLimitedCache.prototype.get = function (key) {
  if (this.cache.has(key))
    return this.cache.get(key).value

  return -1
}

TimeLimitedCache.prototype.count = function () {
  return this.cache.size
}
