import { IModel } from './abstracts/IModel.js'

export class STLFile extends IModel {
  file_url
  header = ''
  vertices = []
  normals = []
  is_loaded = false

  constructor (fileUrl) {
    super()

    if (fileUrl instanceof URL) this.file_url = fileUrl
    else throw new Error('"fileUrl" is not URL.')
  }

  async load () {
    const file = await fetch(this.file_url)
    const buffer = await file.arrayBuffer()

    this.header = new TextDecoder().decode(buffer.slice(0, 80))

    const count = new Uint32Array(buffer.slice(80, 84))[0]

    for (let i = 0; i < count; i++) {
      const startPosition = 84 + i * 64

      const floats = new Float32Array(buffer.slice(startPosition, startPosition + 48))

      this.vertices.push(floats[0])
      this.vertices.push(floats[1])
      this.vertices.push(floats[2])

      this.vertices.push(floats[3])
      this.vertices.push(floats[4])
      this.vertices.push(floats[5])

      this.vertices.push(floats[6])
      this.vertices.push(floats[7])
      this.vertices.push(floats[8])

      for (let j = 1; j <= 3; j++) {
        this.normals.push(floats[9])
        this.normals.push(floats[10])
        this.normals.push(floats[11])
      }
    }

    this.is_loaded = true
  }

  getVertices () {
    return { vertices: this.vertices, normals: this.normals }
  }
}
