/* WWZ.iM — volumetric W particle identity.
   Three.js WebGL layer; the existing 2D canvas remains the automatic fallback. */
(async () => {
  const stage = document.getElementById("logoStage");
  const fallback = document.getElementById("particleW");
  if (!stage || !fallback || stage.dataset.webglStarted === "true") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const dark = () => document.documentElement.dataset.theme === "dark";
  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  } catch (_) {
    // Keep the existing canvas animation visible if WebGL or the CDN is unavailable.
    return;
  }

  if (!window.WebGLRenderingContext) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mobile,
      powerPreference: "high-performance"
    });
  } catch (_) {
    return;
  }

  stage.dataset.webglStarted = "true";
  renderer.domElement.className = "particle-w-webgl";
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.75));
  stage.appendChild(renderer.domElement);
  fallback.style.opacity = "0";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0, 5.25);

  const group = new THREE.Group();
  scene.add(group);

  const count = mobile ? 1250 : 2850;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const path = [
    new THREE.Vector2(-1.18, 0.76),
    new THREE.Vector2(-0.60, -0.76),
    new THREE.Vector2(0.00, 0.10),
    new THREE.Vector2(0.60, -0.76),
    new THREE.Vector2(1.18, 0.76)
  ];
  const lengths = [];
  let totalLength = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const length = path[i].distanceTo(path[i + 1]);
    lengths.push(length);
    totalLength += length;
  }
  const random = (min, max) => min + Math.random() * (max - min);

  for (let i = 0; i < count; i++) {
    let distance = Math.random() * totalLength;
    let segment = 0;
    while (segment < lengths.length - 1 && distance > lengths[segment]) {
      distance -= lengths[segment++];
    }
    const t = distance / lengths[segment];
    const point = path[segment].clone().lerp(path[segment + 1], t);
    const spread = random(-0.042, 0.042);
    positions[i * 3] = point.x + random(-0.018, 0.018);
    positions[i * 3 + 1] = point.y + spread;
    positions[i * 3 + 2] = random(-0.42, 0.42);
    seeds[i] = Math.random() * Math.PI * 2;
    sizes[i] = random(1.3, 3.6);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(10, 10) },
    uPointerActive: { value: 0 },
    uDark: { value: dark() ? 1 : 0 },
    uPixelRatio: { value: renderer.getPixelRatio() },
    uMotion: { value: reduceMotion ? 0 : 1 }
  };

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms,
    vertexShader: `
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uPointerActive;
      uniform float uPixelRatio;
      uniform float uMotion;
      attribute float aSeed;
      attribute float aSize;
      varying float vAlpha;
      varying float vSeed;
      void main() {
        vec3 p = position;
        float t = uTime * uMotion;
        p.x += sin(t * 0.52 + aSeed) * 0.026;
        p.y += cos(t * 0.68 + aSeed * 1.7) * 0.028;
        p.z += sin(t * 0.8 + aSeed * 2.1) * 0.12;

        vec2 delta = p.xy - uPointer;
        float d = length(delta);
        float influence = (1.0 - smoothstep(0.0, 0.62, d)) * uPointerActive;
        if (d > 0.001) p.xy += normalize(delta) * influence * 0.20;

        float ry = sin(t * 0.20) * 0.17;
        float rx = cos(t * 0.16) * 0.075;
        float x = p.x * cos(ry) - p.z * sin(ry);
        float z = p.x * sin(ry) + p.z * cos(ry);
        float y = p.y * cos(rx) - z * sin(rx);
        z = p.y * sin(rx) + z * cos(rx);
        p = vec3(x, y, z);

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = aSize * uPixelRatio * (3.15 / max(1.0, -mvPosition.z));
        vAlpha = 0.62 + 0.34 * sin(aSeed + t * 1.3);
        vSeed = aSeed;
      }`,
    fragmentShader: `
      uniform float uDark;
      varying float vAlpha;
      varying float vSeed;
      void main() {
        vec2 p = gl_PointCoord - 0.5;
        float d = length(p);
        float core = 1.0 - smoothstep(0.08, 0.34, d);
        float glow = 1.0 - smoothstep(0.12, 0.5, d);
        vec3 lightColor = mix(vec3(0.12, 0.38, 0.72), vec3(0.38, 0.72, 0.98), fract(vSeed * 0.17));
        vec3 darkColor = mix(vec3(0.12, 0.62, 0.96), vec3(0.76, 0.94, 1.0), fract(vSeed * 0.17));
        vec3 color = mix(lightColor, darkColor, uDark);
        gl_FragColor = vec4(color, (core * 0.78 + glow * 0.22) * vAlpha);
      }`
  });

  const particles = new THREE.Points(geometry, material);
  group.add(particles);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: dark() ? 0x67c9ff : 0x6c9fca,
    transparent: true,
    opacity: 0.17,
    wireframe: true
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.006, 4, 180), ringMaterial);
  ring.scale.set(1.08, 0.64, 1);
  ring.rotation.set(1.08, 0.10, -0.12);
  group.add(ring);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.43, 0.003, 3, 160),
    new THREE.MeshBasicMaterial({
      color: dark() ? 0x5db7e9 : 0x9aaec0,
      transparent: true,
      opacity: 0.10
    })
  );
  innerRing.scale.set(1.12, 0.71, 1);
  innerRing.rotation.set(1.14, -0.16, 0.08);
  group.add(innerRing);

  const pointer = new THREE.Vector2(10, 10);
  let pointerActive = false;
  const onPointerMove = event => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    pointer.set((x - 0.5) * 2.5, (0.5 - y) * 1.9);
    pointerActive = true;
  };
  const onPointerLeave = () => { pointerActive = false; };
  if (window.matchMedia("(pointer:fine)").matches) {
    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", onPointerLeave, { passive: true });
  }

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    camera.aspect = width / height;
    camera.position.z = width < 520 ? 5.9 : 5.25;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resize();

  let visible = true;
  let raf = 0;
  const clock = new THREE.Clock();
  const render = () => {
    raf = 0;
    if (!visible) return;
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uPointer.value.copy(pointer);
    uniforms.uPointerActive.value = pointerActive && !reduceMotion ? 1 : 0;
    uniforms.uDark.value = dark() ? 1 : 0;
    ring.rotation.z += reduceMotion ? 0 : 0.0007;
    innerRing.rotation.z -= reduceMotion ? 0 : 0.00045;
    renderer.render(scene, camera);
    if (!reduceMotion) raf = requestAnimationFrame(render);
  };

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !reduceMotion && !raf) raf = requestAnimationFrame(render);
    if (!visible && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    if (visible && reduceMotion) render();
  }, { threshold: 0.02 });
  observer.observe(stage);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!document.hidden && visible && !reduceMotion && !raf) {
      raf = requestAnimationFrame(render);
    } else if (!document.hidden && visible && reduceMotion) {
      render();
    }
  });

  renderer.domElement.addEventListener("webglcontextlost", event => {
    event.preventDefault();
    fallback.style.opacity = "1";
    stage.dataset.webglStarted = "false";
    if (raf) cancelAnimationFrame(raf);
  });

  if (reduceMotion) render();
  else raf = requestAnimationFrame(render);

  // Re-render immediately when the shared light/dark theme changes.
  new MutationObserver(() => {
    uniforms.uDark.value = dark() ? 1 : 0;
    ringMaterial.color.setHex(dark() ? 0x67c9ff : 0x6c9fca);
    if (reduceMotion && visible) render();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})().catch(() => {
  // A failed WebGL enhancement must never break the homepage or its fallback.
});
