uniform highp vec4 u_basicColor;
uniform highp vec4 u_ambientLight;

uniform bool u_useLighting;

varying highp vec3 v_vectorLighting;

void main()
{
    if(u_useLighting)
    {
        gl_FragColor = vec4(u_basicColor.rgb * v_vectorLighting, u_basicColor.a);
        gl_FragColor += vec4(u_ambientLight.rgb * (u_ambientLight.a * gl_FragColor.a), 1.0);
    }
    else
        gl_FragColor = u_basicColor;
}