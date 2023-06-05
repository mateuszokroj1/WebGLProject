export class STLFile {
    stl_file;
    vertices;
    normals;
    is_loaded = false;

    constructor(stl_file) {
        if(stl_file instanceof Blob)
        this.stl_file = stl_file;
    }

    async load() {

    }
}