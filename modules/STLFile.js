export class STLFile {
  file_url
  header
  vertices
  normals
  is_loaded = false

  constructor (fileUrl) {
    if (fileUrl instanceof URL) this.file_url = fileUrl
    else throw new Error('"fileUrl" is not URL.')
  }

  async load () {
    const file = await fetch(this.file_url)
    const buffer = await file.arrayBuffer()

    this.header = new TextDecoder().decode(buffer.slice(0, 80))

    const count = new Uint32Array(buffer.slice(80, 84))[0]
    this.vertices = new Float32Array(3 * 3 * count)
    this.normals = new Float32Array(3 * count)

    for (let i = 0; i < count; i++) {
      const floats = new Float32Array(buffer.slice(84 + i * 64, (84 + i * 64) + 48))

      this.normals[i * 3] = floats[0]
      this.normals[i * 3 + 1] = floats[1]
      this.normals[i * 3 + 2] = floats[2]

      for (let j = 0; j < 9; j++) { this.vertices[i * 9 + j] = floats[3 + j] }
    }

    this.is_loaded = true
  }
}
