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

    const count = new Uint32Array(buffer.slice(80, 4))[0]
    this.vertices = new Float32Array(3 * 3 * count)
    this.normals = new Float32Array(3 * count)

    for (let i = 0; i < count; i++) {
      // TODO read data
    }
  }
}
