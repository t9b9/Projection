varying vec2 vUv;
uniform sampler2D gravelTexture;

void main() {
	vec4 color = texture2D( gravelTexture, vUv);
    gl_FragColor = vec4(color.rgb, 1.0 );
}

