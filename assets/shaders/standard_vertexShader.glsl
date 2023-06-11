attribute vec2 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform bool isProjected;

void main()
{
    vec4 transformed = modelViewMatrix * vec4(position, 0.0, 1.0);
    gl_Position = isProjected ? projectionMatrix * transformed : transformed;
}