import { IInitializable } from "../interfaces/IInitializable";
import { getWebGlContext } from "../tools/Functions";
export default class WebGlShaderProgram implements IInitializable<HTMLCanvasElement> {

    get isInitialized(): boolean {
        return this.shader_program != null;
    }

    private shader_program: WebGLProgram | null = null;

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

/*
        this.attribLocations = {
              vertexPosition: this.context.getAttribLocation(this.glShaderProgram, 'a_position'),
              vertexNormal: this.context.getAttribLocation(this.glShaderProgram, 'a_normal')
            }
            this.uniformLocations = {
              ambientLightColor: this.context.getUniformLocation(this.glShaderProgram, 'u_ambientLight'),
              directionalLightColor: this.context.getUniformLocation(this.glShaderProgram, 'u_directionalLightColor'),
              directionalLightVector: this.context.getUniformLocation(this.glShaderProgram, 'u_directionalLightVector'),
              useLighting: this.context.getUniformLocation(this.glShaderProgram, 'u_useLighting'),
              isProjected: this.context.getUniformLocation(this.glShaderProgram, 'u_isProjected'),
              projectionMatrix: this.context.getUniformLocation(this.glShaderProgram, 'u_projectionMatrix'),
              modelMatrix: this.context.getUniformLocation(this.glShaderProgram, 'u_modelMatrix'),
              viewMatrix: this.context.getUniformLocation(this.glShaderProgram, 'u_viewMatrix'),
              basicColor: this.context.getUniformLocation(this.glShaderProgram, 'u_basicColor'),
              normalMatrix: this.context.getUniformLocation(this.glShaderProgram, 'u_normalMatrix'),
              lightDirectionMatrix: this.context.getUniformLocation(this.glShaderProgram, 'u_lightDirectionMatrix')
            }
        
            this.vertexBuffer = this.context.createBuffer()
            this.normalBuffer = this.context.createBuffer()
          }
        
          configureWorldParameters(viewMatrix, projectionMatrix, ambientLightColor, directionalLightColor, directionalLightVector) {
            this.context.uniform4fv(this.uniformLocations.ambientLightColor, ambientLightColor)
            this.context.uniform3fv(this.uniformLocations.directionalLightColor, directionalLightColor)
            this.context.uniform3fv(this.uniformLocations.directionalLightVector, directionalLightVector)
            this.context.uniformMatrix4fv(this.uniformLocations.viewMatrix, false, viewMatrix)
            this.context.uniformMatrix4fv(this.uniformLocations.projectionMatrix, false, projectionMatrix)
        
            const lightDirectionMatrix = GLM.mat3.create()
            GLM.mat3.normalFromMat4(lightDirectionMatrix, viewMatrix)
            GLM.mat3.invert(lightDirectionMatrix, lightDirectionMatrix)
            GLM.mat3.transpose(lightDirectionMatrix, lightDirectionMatrix)
        
            this.context.uniformMatrix3fv(this.uniformLocations.lightDirectionMatrix, false, lightDirectionMatrix)
          }
        
          renderVisibleObject(object, viewMatrix) {
            if (!(object instanceof VisibleObject) || !(viewMatrix instanceof Float32Array)) throw new Error('Bad argument.')
        
            this.context.uniform4f(this.uniformLocations.basicColor, object.color[0], object.color[1], object.color[2], Math.max(0, Math.min(object.opacity, 1)))
            this.context.uniform1i(this.uniformLocations.useLighting, object.useLighting)
            this.context.uniform1i(this.uniformLocations.isProjected, object.useProjection)
        
            const modelMatrix = object.importTransformation.calculateMatrix()
            const m2 = object.transformation.calculateMatrix()
            GLM.mat4.multiply(modelMatrix, modelMatrix, m2)
        
            this.context.uniformMatrix4fv(this.uniformLocations.modelMatrix, false, modelMatrix)
        
            const normalMatrix4 = GLM.mat4.create()
            GLM.mat4.multiply(normalMatrix4, viewMatrix, modelMatrix)
            
            const normalMatrix = GLM.mat3.create()
            GLM.mat3.normalFromMat4(normalMatrix, normalMatrix4)
            GLM.mat3.invert(normalMatrix, normalMatrix)
            //GLM.mat3.transpose(normalMatrix, normalMatrix)
        
            this.context.uniformMatrix3fv(this.uniformLocations.normalMatrix, false, normalMatrix)
        
            this.context.enableVertexAttribArray(this.attribLocations.vertexPosition)
            this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer)
            this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(object.vertices), this.context.STATIC_DRAW)
            this.context.vertexAttribPointer(this.attribLocations.vertexPosition, 3, this.context.FLOAT, false, 0, 0)
        
            this.context.enableVertexAttribArray(this.attribLocations.vertexNormal)
            this.context.bindBuffer(this.context.ARRAY_BUFFER, this.normalBuffer)
            this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(object.normals), this.context.STATIC_DRAW)
            this.context.vertexAttribPointer(this.attribLocations.vertexNormal, 3, this.context.FLOAT, false, 0, 0)
          }*/
    }
}