import * as GLM from "gl-matrix";
import { IInitializable } from "../interfaces/IInitializable";
import IRenderer from "../interfaces/IRenderer";
import Material from "../logics/Material";
import { ISceneGraphComponent } from "../interfaces/ISceneGraph";
import Camera from "../models/Camera";
import WebGlShaderProgram from "./WebGlShaderProgram";

export default class WebGlRenderer implements IRenderer, IInitializable {
    private program: WebGlShaderProgram = new WebGlShaderProgram;
    private camera: Camera | null = null;
    private ambient_light_color: GLM.vec3 = GLM.vec3.fromValues(1.0, 1.0, 1.0);
    private diffuse_light_position: GLM.vec3 = GLM.vec3.fromValues(0, 0, 0);
    private diffuse_light_color: GLM.vec3 = GLM.vec3.fromValues(1.0, 1.0, 1.0);
    private specular_light_position: GLM.vec3 = GLM.vec3.fromValues(0, 0, 0);
    private material: Material = Material.solidColorRed();
    private model_transformation: GLM.mat4 = GLM.mat4.identity(GLM.mat4.create())
    private vertices: Float32Array = new Float32Array(0)

    get isInitialized(): boolean {
        return this.program.isInitialized;
    }

    private reset(): void {
        this.camera = null;
        this.ambient_light_color = GLM.vec3.fromValues(1.0, 1.0, 1.0);
        this.diffuse_light_position = GLM.vec3.fromValues(0, 0, 0);
        this.diffuse_light_color = GLM.vec3.fromValues(1.0, 1.0, 1.0);
        this.specular_light_position = GLM.vec3.fromValues(0, 0, 0);
        this.material = Material.solidColorRed();
        this.model_transformation = GLM.mat4.identity(GLM.mat4.create())
        this.vertices = new Float32Array(0)
    }

    async initialize(argument: HTMLCanvasElement): Promise<void> {
        await this.program.initialize(argument);
        this.program.use();
    }

    visitSceneComponent(scene_component: ISceneGraphComponent): void {
        scene_component.acceptRenderer(this);
    }

    useCamera(camera: Camera): IRenderer {
        this.camera = camera;

        return this;
    }

    setAmbientLightColor(color: GLM.vec3): IRenderer {
        this.ambient_light_color = color;

        return this;
    }

    setDiffuseLight(position: GLM.vec3, color: GLM.vec3): IRenderer {
        this.diffuse_light_position = position;
        this.diffuse_light_color = color;

        return this;
    }

    setSpecularLight(position: GLM.vec3): IRenderer {
        this.specular_light_position = position;

        return this;
    }

    useMaterial(material: Material): IRenderer {
        this.material = material;

        return this;
    }

    useModelTransformation(trafoMatrix: GLM.mat4): IRenderer {
        this.model_transformation = trafoMatrix;

        return this;
    }

    drawTriangles(trianglesData: Float32Array): IRenderer {
        this.vertices = trianglesData;

        return this;
    }

    configureWorldParameters(backgroundColor: GLM.vec3): void {
        let context = this.program.getCurrentContext();
        if (!context) throw new Error('WebGL context not available.');

        if (!this.camera) throw new Error('Camera not set.');

       context.viewport(0, 0, context.drawingBufferWidth, context.drawingBufferHeight);

        context.enable(context.DEPTH_TEST);
        //context.enable(context.CULL_FACE);
        context.enable(context.BLEND);
        //context.cullFace(context.BACK);
        context.depthFunc(context.LEQUAL);
        context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
        context.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);
        context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

        let view_transformation = GLM.mat4.identity(GLM.mat4.create());
        GLM.mat4.rotateZ(view_transformation, view_transformation, this.camera.rotation_angles[2] * Math.PI / 180);
        GLM.mat4.rotateY(view_transformation, view_transformation, this.camera.rotation_angles[1] * Math.PI / 180);
        GLM.mat4.rotateX(view_transformation, view_transformation, this.camera.rotation_angles[0] * Math.PI / 180);
        GLM.mat4.translate(view_transformation, view_transformation, this.camera.position);

        this.program.configureWorldParameters(
            view_transformation,
            this.camera.projection.getProjectionMatrix(),
            this.ambient_light_color,
            this.diffuse_light_position,
            this.diffuse_light_color,
            this.specular_light_position
        );
    }

    flush(): void {
        if (!this.isInitialized) throw new Error('Renderer not initialized.');
        if (this.camera == null) throw new Error('Camera not set.');
        let context = this.program.getCurrentContext();
        if (!context) throw new Error('WebGL context not available.');

        context.bufferData(context.ARRAY_BUFFER, this.vertices, context.STATIC_DRAW);
        context.enableVertexAttribArray(0);

        context.uniformMatrix4fv(this.program.uniform_locations.modelTransformationMatrix, false, this.model_transformation);
        context.uniform3fv(this.program.uniform_locations.material_baseColor, this.material.base_color);
        context.uniform1f(this.program.uniform_locations.material_ambientLightIntensity, this.material.ambient_light_intensity);
        context.uniform1f(this.program.uniform_locations.material_diffuseLightIntensity, this.material.diffuse_light_intensity);
        context.uniform1f(this.program.uniform_locations.material_specularLightIntensity, this.material.specular_light_intensity);

        context.drawArrays(context.TRIANGLES, 0, this.vertices.length / 6);
        context.disableVertexAttribArray(0);

        this.reset();
    }
}