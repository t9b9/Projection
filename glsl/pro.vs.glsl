uniform mat4 vMatrix;
uniform mat4 pMatrix;
//uniform mat4 vpMatrix;
varying vec4 vTexCoord;
varying vec4 proGemOrigin;

void main() {
    //vTexCoord = vpMatrix * pMatrix * vMatrix * vec4(position, 1.0);
	//vec3 gemOrigin = vec3(2.5,2.5,2.5);
	//proGemOrigin = pMatrix * vMatrix * vec4(gemOrigin, 1.0);
	vTexCoord = pMatrix * vMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}