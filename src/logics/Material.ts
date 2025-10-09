import * as GLM from 'gl-matrix';

export default class Material {
    public base_color: GLM.vec3 = GLM.vec3.fromValues(1.0, 1.0, 1.0);
    public specular_light_intensity: number = 0.0;
    public ambient_light_intensity: number = 0.0;
    public diffuse_light_intensity: number = 0.0;

    public static solidColorRed(): Material {
        let material = new Material();
        material.base_color = GLM.vec3.fromValues(1.0, 0, 0);
        material.ambient_light_intensity = 0.5;
        material.diffuse_light_intensity = 0.3;

        return material;
    }
}