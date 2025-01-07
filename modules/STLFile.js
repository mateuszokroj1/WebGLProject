import * as GLM from '../node_modules/gl-matrix/esm/index.js'

import { Box3d } from './Box3d.js'
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
    this.boundingBox = new Box3d()
    let vec = GLM.vec3.create()

    const file = await fetch(this.file_url)
    const buffer = await file.arrayBuffer()

    let is_ascii = true

    for (let i = 0; i < buffer.byteLength; ++i)
      if (buffer[i] > 127) {
        is_ascii = false
        break
      }

    if (is_ascii) {
      let text = ""
      {
        const decoder = new TextDecoder();
        text = decoder.decode(buffer);
      }

      const full_text_checker = /^solid\s+(?<header>\w+)[\s\S]{100,}$/g
      const match1 = full_text_checker.exec(text)
      if(match1 == null)
        return

      this.header = match1.groups['header']

      const triangle_reg = /facet\s+normal\s+(\-?\d+((\.|\,)\d+)?\s+){3}outer\s+loop\s+(vertex\s+(\-?\d+((\.|\,)\d+)?\s+){3}){3}endloop\s+endfacet\s+/g
      
      const normal_reg = /normal\s+(?<x>\-?\d+((\.|\,)\d+)?)\s+(?<y>\-?\d+((\.|\,)\d+)?)\s+(?<z>\-?\d+((\.|\,)\d+)?)/g
      const vertex_reg = /vertex\s+(?<x>\-?\d+((\.|\,)\d+)?)\s+(?<y>\-?\d+((\.|\,)\d+)?)\s+(?<z>\-?\d+((\.|\,)\d+)?)/g
      
      let single_triangle = triangle_reg.exec(text)
      while(single_triangle != null) {
        normal_reg.lastIndex = 0
        const match1 = normal_reg.exec(single_triangle[0])
        const normal_x = parseFloat(match1.groups['x'])
        const normal_y = parseFloat(match1.groups['y'])
        const normal_z = parseFloat(match1.groups['z'])

        this.normals.push(normal_x, normal_y, normal_z)
        this.normals.push(normal_x, normal_y, normal_z)
        this.normals.push(normal_x, normal_y, normal_z)

        let vertex_match = vertex_reg.exec(single_triangle[0])
        while(vertex_match != null) {
          const v_x = parseFloat(vertex_match.groups['x'])
          const v_y = parseFloat(vertex_match.groups['y'])
          const v_z = parseFloat(vertex_match.groups['z'])
          vec[0] = v_x;
          vec[1] = v_y;
          vec[2] = v_z;
          this.boundingBox.add(vec3)

          this.vertices.push(v_x,v_y,v_z)
          vertex_match = vertex_reg.exec(single_triangle[0])
        }

        single_triangle = triangle_reg.exec(text)
      }
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
        vec[0] = floats[0]
        vec[1] = floats[1]
        vec[2] = floats[2]
        this.boundingBox.add(vec3)

        this.vertices.push(floats[3])
        this.vertices.push(floats[4])
        this.vertices.push(floats[5])
        vec[0] = floats[3]
        vec[1] = floats[4]
        vec[2] = floats[5]
        this.boundingBox.add(vec3)

        this.vertices.push(floats[6])
        this.vertices.push(floats[7])
        this.vertices.push(floats[8])
        vec[0] = floats[6]
        vec[1] = floats[7]
        vec[2] = floats[8]
        this.boundingBox.add(vec3)

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
