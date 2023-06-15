function isInRange (value, low, high) {
  return ((value > low && value < high) || value === low || value === high)
}

export class Color {
  r
  g
  b
  a

  constructor (r, g, b, a) {
    if (isInRange(r, 0.0, 1.0) && isInRange(g, 0.0, 1.0) && isInRange(b, 0.0, 1.0) && isInRange(a, 0.0, 1.0)) {
      this.r = r
      this.g = g
      this.b = b
      this.a = a
    } else {
      throw new Error('Color parameter must be number in inclusive range (0.0 - 1.0).')
    }
  }
}
