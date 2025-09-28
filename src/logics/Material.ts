import { SassColor } from 'sass';
import * as GLM from 'gl-matrix';

export default class Material {
    public ambient_light_color: SassColor = new SassColor({red: 0, green: 0, blue: 0, alpha: 0});
    public directional_light_color: SassColor = new SassColor({red: 1, green: 1, blue: 1});
    public directional_light_vector: GLM.vec3 = GLM.vec3.fromValues(1, 1, 1);
}