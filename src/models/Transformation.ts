import * as GLM from 'gl-matrix';

export class Transformation {
    public translation: GLM.vec3 = GLM.vec3.fromValues(0, 0, 0);
    public rotation_angles: GLM.vec3 = GLM.vec3.fromValues(0, 0, 0);
    public rotation_anchorpoint: GLM.vec3 = GLM.vec3.fromValues(0, 0, 0);
    public scale: GLM.vec3 = GLM.vec3.fromValues(1, 1, 1);
    public scale_anchorpoint: GLM.vec3 = GLM.vec3.fromValues(0, 0, 0);

    getModelTransformation(): GLM.mat4 {
        let model_matrix: GLM.mat4 = GLM.mat4.create();
        GLM.mat4.translate(model_matrix, model_matrix, this.translation);
        GLM.mat4.translate(model_matrix, model_matrix, this.rotation_anchorpoint);
        GLM.mat4.rotateX(model_matrix, model_matrix, this.rotation_angles[0]);
        GLM.mat4.rotateY(model_matrix, model_matrix, this.rotation_angles[1]);
        GLM.mat4.rotateZ(model_matrix, model_matrix, this.rotation_angles[2]);

        let negative_anchorpoint = GLM.vec3.clone(this.rotation_anchorpoint);
        GLM.vec3.negate(negative_anchorpoint, negative_anchorpoint);
        GLM.mat4.translate(model_matrix, model_matrix, negative_anchorpoint);
        
        GLM.mat4.translate(model_matrix, model_matrix, this.scale_anchorpoint);
        GLM.mat4.scale(model_matrix, model_matrix, this.scale);

        negative_anchorpoint = GLM.vec3.clone(this.scale_anchorpoint);
        GLM.vec3.negate(negative_anchorpoint, negative_anchorpoint);
        GLM.mat4.translate(model_matrix, model_matrix, negative_anchorpoint);
        return model_matrix;
    }
}