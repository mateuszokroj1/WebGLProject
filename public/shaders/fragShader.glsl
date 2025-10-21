precision mediump float;

uniform vec3 u_ambientLightColor;
uniform vec3 u_diffuseLightPosition;
uniform vec3 u_diffuseLightColor;
uniform vec3 u_specularLightPosition;
uniform vec3 u_material_baseColor;
uniform float u_material_ambientLightIntensity;
uniform float u_material_diffuseLightIntensity;
uniform float u_material_specularLightIntensity;

void main()
{
    gl_FragColor = vec4(u_material_baseColor, 0.9);
}