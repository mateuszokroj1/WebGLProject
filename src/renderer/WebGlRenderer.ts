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
        throw new Error("Method not implemented.");
    }

    setAmbientLightColor(color: GLM.vec3): IRenderer {
        throw new Error("Method not implemented.");
    }

    setDiffuseLight(position: GLM.vec3, color: GLM.vec3): IRenderer {
        throw new Error("Method not implemented.");
    }

    setSpecularLight(position: GLM.vec3): IRenderer {
        throw new Error("Method not implemented.");
    }

    useMaterial(material: Material): IRenderer {
        throw new Error("Method not implemented.");
    }

    useModelTransformation(trafoMatrix: GLM.mat4): IRenderer {
        throw new Error("Method not implemented.");
    }

    drawTriangles(trianglesData: Vertices): IRenderer {
        throw new Error("Method not implemented.");
    }

    flush(): void {
        //;

        this.reset();
    }
}