export class STLFile {
  stl_file
  vertices
  normals
  is_loaded = false

  constructor (stlFile) {
    if (stlFile instanceof Blob) { this.stl_file = stlFile }
  }

  async load () {

  }
}
