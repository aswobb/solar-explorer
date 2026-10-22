export const solarVertex = /* glsl */`
varying vec2 vUv;
varying vec3 vLocal;
varying vec3 vWorld;
varying vec3 vNormalWorld;
void main() {
  vUv = uv;
  vLocal = normalize(position);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormalWorld = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}`
export const solarSurfaceFragment = /* glsl */`
uniform sampler2D surfaceMap;
uniform float phase;
varying vec2 vUv;
varying vec3 vLocal;
varying vec3 vWorld;
varying vec3 vNormalWorld;
float hash3(vec3 p) { return fract(sin(dot(p, vec3(17.13, 91.7, 43.31))) * 4317.53); }
float noise3(vec3 p) {
  vec3 cell = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = mix(hash3(cell), hash3(cell + vec3(1,0,0)), f.x);
  float b = mix(hash3(cell + vec3(0,1,0)), hash3(cell + vec3(1,1,0)), f.x);
  float c = mix(hash3(cell + vec3(0,0,1)), hash3(cell + vec3(1,0,1)), f.x);
  float d = mix(hash3(cell + vec3(0,1,1)), hash3(cell + vec3(1,1,1)), f.x);
  return mix(mix(a,b,f.y), mix(c,d,f.y), f.z);
}
void main() {
  vec2 uv = vec2(fract(vUv.x + 0.004 * sin(vUv.y * 22.0 + phase)), clamp(vUv.y + 0.002 * sin(vUv.x * 18.8495559 + phase * 2.0), 0.001, 0.999));
  vec3 flow = vec3(sin(phase), cos(phase), sin(phase * 2.0)) * 0.7;
  float grain = noise3(vLocal * 28.0 + flow) * 0.7 + noise3(vLocal * 57.0 - flow) * 0.3;
  float facing = abs(dot(normalize(vNormalWorld), normalize(cameraPosition - vWorld)));
  vec3 base = texture2D(surfaceMap, uv).rgb;
  vec3 emission = base * (0.85 + grain * 0.65) * mix(0.8, 1.08, sqrt(facing));
  gl_FragColor = vec4(emission, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
export const solarCoronaFragment = /* glsl */`
uniform float phase;
uniform float glow;
uniform float radius;
uniform float coronaScale;
varying vec3 vWorld;
varying vec3 vNormalWorld;
void main() {
  // The Sun stays at the origin. Distance from its center to the camera ray.
  vec3 ray = normalize(vWorld - cameraPosition);
  float r = length(cross(-cameraPosition, ray)) / radius;
  vec3 n = normalize(vNormalWorld);
  float streak = pow(0.5 + 0.5 * sin(n.x * 35.0 + sin(n.y * 27.0 + phase) * 2.0 + phase * 2.0), 3.0);
  float edge = max(r - 1.0, 0.0);
  float corona = exp(-edge * 12.0) * (0.2 + streak * 0.24);
  float halo = exp(-edge * 5.0) * glow * 0.3;
  float fade = 1.0 - smoothstep(coronaScale - 0.16, coronaScale, r);
  gl_FragColor = vec4(vec3(1.0, 0.3, 0.035), (corona + halo) * fade);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
