varying vec3 vColor;

void main() {
  // // Disc
  // float strengths = step(0.5, 1.0 - distance(gl_PointCoord, vec2(0.5)));

  // // Diffuse point
  // float strengths = distance(gl_PointCoord, vec2(0.5));
  // strengths *= 2.0;
  // strengths = 1.0 - strengths;

  // Light point
  float strengths =  distance(gl_PointCoord, vec2(0.5));
  strengths *= 2.0;
  strengths = 1.0 - strengths;
  strengths = pow(strengths, 10.0);

  // Final
  vec3 finalColor = mix(vec3(0.0,0.0,0.0), vColor,strengths);

  gl_FragColor = vec4(finalColor, 1.0);
}
