/** Shaders GLSL du terrain voxel (WebGL2). */

export const CHUNK_VERT = /* glsl */ `
attribute vec4 aUV;
attribute vec4 aLight;
attribute vec4 aColor;
uniform float uTime;
uniform vec2 uLightOverride;
varying vec3 vUV;
varying vec3 vTint;
varying float vSky;
varying float vBlk;
varying float vAO;
varying float vFace;
varying float vAnim;
varying float vDist;
varying vec3 vWorld;

void main() {
  float flags = aUV.w;
  float face = mod(flags, 8.0);
  float anim = floor(flags / 8.0 + 0.001);
  vec4 world = modelMatrix * vec4(position, 1.0);
  if (anim > 3.5 && anim < 4.5) {
    // végétation qui ondule (plus fort en haut des plantes en croix)
    float amp = face > 5.5 ? (1.0 - aUV.y / 16.0) * 0.07 : 0.025;
    float ph = uTime * 1.7 + world.x * 0.45 + world.z * 0.35;
    world.x += sin(ph) * amp;
    world.z += cos(ph * 0.83) * amp;
  } else if (anim > 0.5 && anim < 1.5 && face > 1.5 && face < 2.5) {
    world.y += (sin(uTime * 1.3 + world.x * 0.6 + world.z * 0.45) * 0.5 - 0.5) * 0.06;
  }
  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  vUV = vec3(aUV.x / 16.0, aUV.y / 16.0, aUV.z);
  vTint = aColor.rgb;
  vSky = aLight.x;
  vBlk = aLight.y;
  if (uLightOverride.x >= 0.0) {
    vSky = uLightOverride.x;
    vBlk = uLightOverride.y;
  }
  vAO = aLight.z * 255.0 / 3.0;
  vFace = face;
  vAnim = anim;
  vDist = length(mv.xyz);
  vWorld = world.xyz;
}
`;

export const CHUNK_FRAG = /* glsl */ `
precision highp sampler2DArray;
uniform sampler2DArray uAtlas;
uniform float uTime;
uniform float uDaylight;
uniform vec3 uSkyLightColor;
uniform vec3 uBlockLightColor;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uPass;
uniform float uNightVision;
uniform vec3 uSunDir;
uniform vec3 uCameraPos;
uniform float uUnderwater;
varying vec3 vUV;
varying vec3 vTint;
varying float vSky;
varying float vBlk;
varying float vAO;
varying float vFace;
varying float vAnim;
varying float vDist;
varying vec3 vWorld;

float lightCurve(float l) {
  // courbe de luminosité perceptuelle (0..1)
  return l * l * (3.0 - 2.0 * l) * 0.92 + l * 0.08;
}

vec3 faceNormal(float f) {
  if (f < 0.5) return vec3(1.0, 0.0, 0.0);
  if (f < 1.5) return vec3(-1.0, 0.0, 0.0);
  if (f < 2.5) return vec3(0.0, 1.0, 0.0);
  if (f < 3.5) return vec3(0.0, -1.0, 0.0);
  if (f < 4.5) return vec3(0.0, 0.0, 1.0);
  if (f < 5.5) return vec3(0.0, 0.0, -1.0);
  return vec3(0.0, 1.0, 0.0);
}

void main() {
  vec2 uv = vUV.xy;
  if (vAnim > 0.5 && vAnim < 1.5) uv += vec2(uTime * 0.035, uTime * 0.02);
  else if (vAnim > 1.5 && vAnim < 2.5) uv += vec2(sin(uTime * 0.4 + uv.y) * 0.06, uTime * 0.04);
  else if (vAnim > 2.5 && vAnim < 3.5) uv += vec2(sin(uTime + uv.y * 3.0) * 0.1, cos(uTime * 0.7 + uv.x * 3.0) * 0.1);
  vec4 tex = texture(uAtlas, vec3(uv, vUV.z));
  float alpha = 1.0;
  if (uPass > 0.5 && uPass < 1.5) {
    float a = textureLod(uAtlas, vec3(uv, vUV.z), 0.0).a;
    if (a < 0.5) discard;
  } else if (uPass > 1.5) {
    alpha = tex.a;
    if (alpha < 0.02) discard;
  }
  float mask = uPass < 0.5 ? 1.0 - tex.a : 1.0;
  vec3 base = tex.rgb * mix(vec3(1.0), vTint, mask);

  // éclairage : ciel (modulé par le jour) + blocs (chaud), occlusion ambiante, ombrage des faces
  float sky = lightCurve(vSky) * uDaylight;
  float blk = lightCurve(vBlk);
  vec3 light = max(uSkyLightColor * sky, uBlockLightColor * blk);
  light = max(light, vec3(0.035 + uNightVision * 0.6));
  float ao = 0.52 + 0.48 * clamp(vAO, 0.0, 1.0);
  vec3 n = faceNormal(vFace);
  float shade = vFace > 5.5 ? 0.92 : (vFace < 1.5 ? 0.74 : (vFace < 2.5 ? 1.0 : (vFace < 3.5 ? 0.55 : 0.86)));
  // léger éclairage directionnel du soleil sur les faces exposées au ciel
  float sunTerm = max(dot(n, uSunDir), 0.0) * 0.12 * vSky * uDaylight;
  vec3 color = base * (light * ao * shade + sunTerm);

  // eau : reflet du ciel et scintillement solaire
  if (vAnim > 0.5 && vAnim < 1.5 && uPass > 1.5) {
    vec3 viewDir = normalize(vWorld - uCameraPos);
    float fres = pow(1.0 - abs(dot(viewDir, n)), 3.0);
    color = mix(color, uFogColor * (0.4 + 0.6 * uDaylight), fres * 0.55);
    vec3 refl = reflect(viewDir, n);
    float spec = pow(max(dot(refl, uSunDir), 0.0), 60.0) * uDaylight * vSky;
    color += vec3(1.0, 0.95, 0.8) * spec * 0.8;
    alpha = mix(alpha, 0.92, fres);
  }
  // émissifs (lave, portails) : pleine luminosité
  if (vAnim > 1.5 && vAnim < 3.5) color = base * 1.05;

  float fog = smoothstep(uFogNear, uFogFar, vDist);
  if (uUnderwater > 0.5) fog = smoothstep(2.0, 28.0, vDist);
  gl_FragColor = vec4(mix(color, uFogColor, fog), alpha);
}
`;
