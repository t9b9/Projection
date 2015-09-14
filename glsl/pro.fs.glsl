uniform mat4 vMatrix;
uniform mat4 pMatrix;
//uniform mat4 vpMatrix;
uniform sampler2D logoTexture;
varying vec4 vTexCoord;
varying vec4 proGemOrigin;

void main() {
/* 	vec2 tex2;
	vec2 gem2;
	vec4 tex4;
	vec2 test = vec2(0.5, 0.5);
	float pi = 3.1415926;
	
	tex4.x = vTexCoord.x / vTexCoord.w;
	tex4.y = vTexCoord.y / vTexCoord.w;
	tex4.z = vTexCoord.z / vTexCoord.w;
	tex4.w = 1.0;

	vec4 texColor0 = vec4(1,1,1,0);

	//tex2 = vec2(tex4.x, tex4.y);
	//texColor0 = texture2D(logoTexture, tex2);
	if(tex4.z < 1.0 + 0.5 / vTexCoord.w){
		tex2 = vec2(tex4.x, tex4.y);
		texColor0 = texture2D(logoTexture, tex2);
		gl_FragColor = texColor0;
	}else
		gl_FragColor = texColor0;
	//vec4 texColor0 = texture2D(logoTexture, test); */
	
	vec2 tex2;
	tex2.x = vTexCoord.x/vTexCoord.w;
	tex2.y = vTexCoord.y/vTexCoord.w;
	gl_FragColor = texture2D(logoTexture, tex2); 
    

}




