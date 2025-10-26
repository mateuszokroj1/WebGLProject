attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_viewTransformation;
uniform mat4 u_projectionTransformation;
uniform mat4 u_modelTransformation;

uniform vec3 u_specularLightPosition;
uniform vec3 u_diffuseLightPosition;

varying vec3 v_normal;
varying vec3 v_diffuseLightDir;
varying vec3 v_specularLightDir;

void main() {
    vec4 position_in_space = u_viewTransformation * u_modelTransformation * vec4(a_position, 1.0);

    v_normal = normalize(u_modelTransformation * u_viewTransformation * vec4(a_normal, 0)).xyz;
    v_diffuseLightDir = normalize(u_diffuseLightPosition - position_in_space.xyz);
    v_specularLightDir = normalize(u_specularLightPosition - position_in_space.xyz);

    gl_Position = u_projectionTransformation * position_in_space;
}