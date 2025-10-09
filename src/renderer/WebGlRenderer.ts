import * as GLM from "gl-matrix";
import { IInitializable } from "../interfaces/IInitializable";
import IRenderer from "../interfaces/IRenderer";
import Material from "../logics/Material";
import Vertices from "../models/Vertices";
import { ISceneGraphComponent } from "../interfaces/ISceneGraph";
import Camera from "../models/Camera";
import WebGlShaderProgram from "./WebGlShaderProgram";
import { getWebGlContext } from "../tools/Functions";

export default class WebGlRenderer implements IRenderer, IInitializable<HTMLCanvasElement> {
    private program: WebGlShaderProgram = new WebGlShaderProgram;
    private camera: Camera | null = null;
    private ambient_light_color: GLM.vec3 = GLM.vec3.fromValues(1.0, 1.0, 1.0);
    private diffuse_light_position: GLM.vec3 = GLM.vec3.fromValues(0, 0, 0);
    private diffuse_light_color: GLM.vec3 = GLM.vec3.fromValues(1.0, 1.0, 1.0);
    private specular_light_position: GLM.vec3 = GLM.vec3.fromValues(0, 0, 0);
    private material: Material = Material.solidColorRed();
    private model_transformation: GLM.mat4 = GLM.mat4.identity(GLM.mat4.create())
    private vertices: Float32Array = new Float32Array(0)
    private normals: Float32Array = new Float32Array(0)

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
        this.normals = new Float32Array(0)
    }

    async initialize(argument: HTMLCanvasElement): Promise<void> {
        await this.program.initialize(argument);
        
        const context = getWebGlContext(argument);
        context.useProgram(this.program);
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

    drawTriangles(trianglesData: Vertices): IRenderer {
        this.vertices = new Float32Array(trianglesData.vertices);
        this.normals = new Float32Array(trianglesData.normals);

        return this;
    }

    configureWorldParameters(backgroundColor: GLM.vec3): void {
        let context = this.program.getCurrentContext();
        if(!context) throw new Error('WebGL context not available.');

        context.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);
        context.enable(context.DEPTH_TEST);
        context.depthFunc(context.LEQUAL);
        context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
        context.viewport(0, 0, context.canvas.width, context.canvas.height);
    }

    flush(): void {
        if (!this.isInitialized) throw new Error('Renderer not initialized.');
        if (this.camera == null) throw new Error('Camera not set.');

// buffers and draw

        this.reset();
    }
}