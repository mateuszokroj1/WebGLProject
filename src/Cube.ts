import Material from "./logics/Material";
import STLObject from "./logics/STLObject";
import * as GLM from "gl-matrix";

export default class Cube extends STLObject {
    constructor() {
        super("Cube", "/solids/cube.STL");
        this.objectTransformation.rotation_angles = GLM.vec3.fromValues(0,0,0);
        this.objectTransformation.translation = GLM.vec3.fromValues(-2,2,0);
        this.objectTransformation.scale = GLM.vec3.fromValues(0.2,0.2,0.2);
        this.material = new Material;
        this.material.diffuse_light_intensity = 1;
        this.material.specular_light_intensity = 0;
        this.material.ambient_light_intensity = 0.2;
        this.material.base_color = GLM.vec3.fromValues(1, 0.5, 0);
        this.material.opacity = 0.7;
    }
}