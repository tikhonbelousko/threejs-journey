uniform vec3 uLowColor;
uniform vec3 uHighColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

uniform vec3 uCameraPosition;

varying float vElevation;
varying vec3 vModelPosition;


void main() {
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(uLowColor, uHighColor, mixStrength);

  float fogStrenght = (distance(uCameraPosition, vModelPosition) - uFogNear) / (uFogFar - uFogNear);
  color = mix(color, uFogColor, clamp(fogStrenght, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}