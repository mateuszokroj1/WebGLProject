attribute vec4 position;
attribute vec4 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform bool isProjected;
uniform bool useLighting;

uniform highp vec3 ambientLight;
uniform highp vec3 directionalLightColor;
uniform highp vec3 directionalLightVector;

varying highp vec3 vectorLighting;

void main()
{
    highp vec4 transformed = viewMatrix * modelMatrix * position;
    gl_Position = isProjected ? projectionMatrix * transformed : transformed;

    if(!useLighting)
    {
        vectorLighting = vec3(0,0,0);
        return;
    }

    highp vec4 transformedNormal = normalMatrix * normalize(normal);
    highp vec3 dirLightVector = normalize(directionalLightVector);

    highp float directionalLight = dot(transformedNormal.xyz, dirLightVector);
    if(directionalLight < 0.0)
        directionalLight = 0.0;

    vectorLighting = ambientLight + (directionalLightColor * directionalLight);
}