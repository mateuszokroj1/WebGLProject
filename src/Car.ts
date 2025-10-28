import Material from "./logics/Material";
import * as GLM from "gl-matrix";
import STLObject from "./logics/STLObject";

export default class Car extends STLObject {
    constructor() {
        super("Car", "/solids/DeLorean.STL");
        this.material = new Material;
        this.material.diffuse_light_intensity = 1;
        this.material.specular_light_intensity = 1;
        this.material.ambient_light_intensity = 0.16;
        this.material.base_color = GLM.vec3.fromValues(1, 0, 0);
        this.material.opacity = 1;
    }
}