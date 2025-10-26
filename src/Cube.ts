import Material from "./logics/Material";
import STLObject from "./logics/STLObject";
import * as GLM from "gl-matrix";

export default class Cube extends STLObject {
    constructor() {
        super("Cube", "/solids/cube.STL");
        this.material = new Material;
        this.material.diffuse_light_intensity = 0.8;
        this.material.specular_light_intensity = 1;
        this.material.ambient_light_intensity = 0.15;
        this.material.base_color = GLM.vec3.fromValues(1, 0.8, 0);
        this.material.opacity = 1;
    }
}