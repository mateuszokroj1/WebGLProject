precision mediump float;

uniform vec3 u_ambientLightColor;
uniform vec3 u_diffuseLightPosition;
uniform vec3 u_diffuseLightColor;
uniform vec3 u_specularLightPosition;
uniform vec3 u_material_baseColor;
uniform float u_material_ambientLightIntensity;
uniform float u_material_diffuseLightIntensity;
uniform float u_material_specularLightIntensity;
uniform float u_material_opacity;

varying vec3 v_normal;

void main()
{
    vec3 ambient_color = u_material_baseColor * (u_ambientLightColor * u_material_ambientLightIntensity);
    float opacity = clamp(u_material_opacity, 0.0, 1.0);
    gl_FragColor = vec4(ambient_color, opacity);
}