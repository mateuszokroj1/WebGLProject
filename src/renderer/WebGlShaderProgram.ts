import * as GLM from 'gl-matrix';
import { IInitializable } from "../interfaces/IInitializable";
import { getWebGlContext } from "../tools/Functions";
export default class WebGlShaderProgram implements IInitializable<HTMLCanvasElement> {

    get isInitialized(): boolean {
        return this.shader_program != null;
    }

    private shader_program: WebGLProgram | null = null;
    public attrib_locations: any = {};
    public uniform_locations: any = {};
    public vertex_buffer: WebGLBuffer | null = null;
    private context: WebGLRenderingContext | null = null;

    async initialize(canvas: HTMLCanvasElement): Promise<void> {
        const context = getWebGlContext(canvas);

        let vertex_shader = context.createShader(context.VERTEX_SHADER);
        let fragment_shader = context.createShader(context.FRAGMENT_SHADER);

        if (fragment_shader == null || vertex_shader == null)
            throw new Error('Cannot create shader object.');

        let response = await fetch('/shaders/vertexShader.glsl');
        if (!response.ok)
            throw new Error(`Vertex shader source code not found. Status: ${response.status}. Text: ${response.statusText}.`);

        let source = await response.text();
        context.shaderSource(vertex_shader, source);
        context.compileShader(vertex_shader);

        if (!context.getShaderParameter(vertex_shader, context.COMPILE_STATUS)) {
            const log = context.getShaderInfoLog(vertex_shader)
            context.deleteShader(vertex_shader)

            throw new Error('An error occurred compiling the shaders: ' + log);
        }

        response = await fetch('/shaders/fragShader.glsl');
        if (!response.ok)
            throw new Error(`Fragment shader source code not found. Status: ${response.status}. Text: ${response.statusText}.`);


        source = await response.text();
        context.shaderSource(fragment_shader, source);
        context.compileShader(fragment_shader);

        if (!context.getShaderParameter(fragment_shader, context.COMPILE_STATUS)) {
            const log = context.getShaderInfoLog(fragment_shader)
            context.deleteShader(fragment_shader)

            throw new Error('An error occurred compiling the shaders: ' + log);
        }

        this.shader_program = context.createProgram();
        context.attachShader(this.shader_program, vertex_shader);
        context.attachShader(this.shader_program, fragment_shader);
        context.linkProgram(this.shader_program);

        if (!context.getProgramParameter(this.shader_program, context.LINK_STATUS)) {
            throw new Error('Unable to initialize the shader program: ' + context.getProgramInfoLog(this.shader_program));
        }

        context.deleteShader(vertex_shader);
        context.deleteShader(fragment_shader);

        this.attrib_locations = {
            vertexPosition: context.getAttribLocation(this.shader_program, 'a_position'),
            vertexNormal: context.getAttribLocation(this.shader_program, 'a_normal')
        };

        this.uniform_locations = {
            viewTransformationMatrix: context.getUniformLocation(this.shader_program, 'u_viewTransformation'),
            projectionTransformationMatrix: context.getUniformLocation(this.shader_program, 'u_projectionTransformation'),
            ambientLightColor: context.getUniformLocation(this.shader_program, 'u_ambientLightColor'),
            diffuseLightPosition: context.getUniformLocation(this.shader_program, 'u_diffuseLightPosition'),
            diffuseLightColor: context.getUniformLocation(this.shader_program, 'u_diffuseLightColor'),
            specularLightPosition: context.getUniformLocation(this.shader_program, 'u_specularLightPosition'),
            modelTransformationMatrix: context.getUniformLocation(this.shader_program, 'u_modelTransformation'),
            material_baseColor: context.getUniformLocation(this.shader_program, 'u_material_baseColor'),
            material_ambientLightIntensity: context.getUniformLocation(this.shader_program, 'u_material_ambientLightIntensity'),
            material_diffuseLightIntensity: context.getUniformLocation(this.shader_program, 'u_material_diffuseLightIntensity'),
            material_specularLightIntensity: context.getUniformLocation(this.shader_program, 'u_material_specularLightIntensity')
        };

        this.vertex_buffer = context.createBuffer();
        this.context = context;
    }

    use(): void {
        if (!this.context) throw new Error('WebGL context not available.');
        if (!this.shader_program) throw new Error('Shader program not initialized.');

        this.context.useProgram(this.shader_program);
    }

    configureWorldParameters(viewTransformationMatrix: GLM.mat4, projectionMatrix: GLM.mat4, ambientLightColor: GLM.vec3, diffuseLightPosition: GLM.vec3, diffuseLightColor: GLM.vec3, specularLightPosition: GLM.vec3) {
        this.context?.uniformMatrix4fv(this.uniform_locations.viewTransformationMatrix, false, viewTransformationMatrix);
        this.context?.uniformMatrix4fv(this.uniform_locations.projectionTransformationMatrix, false, projectionMatrix);
        this.context?.uniform3fv(this.uniform_locations.ambientLightColor, ambientLightColor);
        this.context?.uniform3fv(this.uniform_locations.diffuseLightPosition, diffuseLightPosition);
        this.context?.uniform3fv(this.uniform_locations.diffuseLightColor, diffuseLightColor);
        this.context?.uniform3fv(this.uniform_locations.specularLightPosition, specularLightPosition);
    }

    getCurrentContext(): WebGLRenderingContext | null {
        return this.context;
    }
}