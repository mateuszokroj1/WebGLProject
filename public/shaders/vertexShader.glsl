attribute highp vec3 a_position;
attribute highp vec3 a_normal;

uniform highp mat4 u_modelMatrix;
uniform highp mat4 u_viewMatrix;
uniform highp mat3 u_normalMatrix;
uniform highp mat3 u_lightDirectionMatrix;
uniform highp mat4 u_projectionMatrix;
uniform bool u_isProjected;
uniform bool u_useLighting;

uniform highp vec3 u_directionalLightColor;
uniform highp vec3 u_directionalLightVector;

varying highp vec3 v_vectorLighting;

void main()
{
    highp vec4 transformedPosition = u_modelMatrix * u_viewMatrix * vec4(a_position, 1.0);
    gl_Position = u_isProjected ? u_projectionMatrix * transformedPosition : transformedPosition;

    if(!u_useLighting)
     return;

    highp vec3 transformedNormal = normalize(u_normalMatrix * a_normal);
    highp vec3 dirLightVector = u_lightDirectionMatrix * u_directionalLightVector;

    highp float directionalLight = dot(transformedNormal.xyz, dirLightVector);
    if(directionalLight < 0.0)
        directionalLight = 0.0;

    v_vectorLighting = u_directionalLightColor * directionalLight;
}