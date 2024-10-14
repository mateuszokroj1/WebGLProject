import { IModel } from './abstracts/IModel.js'

export class STLFile extends IModel {
  file_url
  header = ''
  vertices = []
  normals = []
  is_loaded = false

  constructor(fileUrl) {
    super()

    if (fileUrl instanceof URL) this.file_url = fileUrl
    else throw new Error('"fileUrl" is not URL.')
  }

  async load() {
    const file = await fetch(this.file_url)
    const buffer = await file.arrayBuffer()

    let is_ascii = true

    for (let i = 0; i < buffer.byteLength; ++i)
      if (buffer[i] > 127) {
        is_ascii = false
        break
      }

    if (is_ascii) {
      const content = (await file.text()).toLowerCase().trim()

      const full_text_checker = /^solid\s+\w+(.|\s)+endsolid\s+\w+\s*$/
      if(!full_text_checker.test(content))
        return

      const triangle_reg = /facet\s+normal\s+(\-?\d+((\.|\,)\d+)?\s+){3}outer\s+loop\s+(vertex\s+(\-?\d+((\.|\,)\d+)?\s+){3}){3}endloop\s+endfacet\s+/
      const triangle_matches = triangle_reg.exec(content)
      
      const normal_match = /normal\s+(?<x>\-?\d+((\.|\,)\d+)?\s+)\s+(?<y>\-?\d+((\.|\,)\d+)?\s+)\s+(?<z>\-?\d+((\.|\,)\d+)?\s+)/
      const vertices_matches = /(vertex\s+(?<ver_x>\-?\d+((\.|\,)\d+)?\s+)(?<ver_y>\-?\d+((\.|\,)\d+)?\s+)(?<ver_z>\-?\d+((\.|\,)\d+)?\s+))/
      triangle_matches.forEach(vertex_string => {
        const match1 = normal_match.exec(match1)[0]
        const normal_x = parseFloat(match1.groups['x'])
        const normal_y = parseFloat(match1.groups['y'])
        const normal_z = parseFloat(match1.groups['z'])
        this.normals.push(normal_x, normal_y, normal_z)

        const vertices = vertices_matches.exec(vertex_string)
        vertices.forEach(match2 => {
          const v_x = parseFloat(match2.groups['ver_x'])
          const v_y = parseFloat(match2.groups['ver_y'])
          const v_z = parseFloat(match2.groups['ver_z'])

          this.vertices.push(v_x,v_y,v_z)
        })
      })
    }
    else {
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
    }

    this.is_loaded = true
  }

  getVertices() {
    return { vertices: this.vertices, normals: this.normals }
  }
}
