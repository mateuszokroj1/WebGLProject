import * as GLM from "gl-matrix";

export default interface ILightsConfiguration {
    ambient_light_color: GLM.vec3;
    diffuse_light_position: GLM.vec3;
    diffuse_light_color: GLM.vec3;
    specular_light_position: GLM.vec3;
}