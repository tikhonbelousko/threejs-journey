uniform vec3 uLowColor;
uniform vec3 uHighColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;


void main() {
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(uLowColor, uHighColor, mixStrength);
  gl_FragColor = vec4(color, 1.0);
}