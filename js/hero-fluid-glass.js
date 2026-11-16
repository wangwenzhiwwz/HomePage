/* WWZ.iM — sculptural fluid-glass hero.
   WebGL Three.js scene with a lightweight 2D fallback. */
(() => {
  const stage = document.getElementById("logoStage");
  const fallback = document.getElementById("fluidGlassFallback");
  if (!stage || !fallback || stage.dataset.fluidGlassStarted === "true") return;
  stage.dataset.fluidGlassStarted = "true";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(max-width: 760px)").matches;
  const dark = () => document.documentElement.dataset.theme === "dark";
  let raf = 0;
  let visible = true;
  let renderer = null;
  let cleanupWebGL = () => {};

  // Always prepare a graceful canvas fallback before attempting WebGL.
  const ctx = fallback.getContext("2d", { alpha: true });
  if (ctx) {
    let width = 1, height = 1, dpr = 1, fallbackRaf = 0, fallbackVisible = true;
    const resizeFallback = () => {
      const rect = stage.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      fallback.width = Math.round(width * dpr);
      fallback.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    let started = performance.now();
    const drawFallback = now => {
      fallbackRaf = 0;
      if (!fallbackVisible) return;
      const t = reduceMotion ? 0.45 : (now - started) * 0.00022;
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5, cy = height * 0.48;
      const scale = Math.min(width, height) * 0.30;
      const darkMode = dark();
      const glow = ctx.createRadialGradient(cx, cy, scale * .08, cx, cy, scale * 1.55);
      glow.addColorStop(0, darkMode ? "rgba(160,205,235,.12)" : "rgba(90,125,150,.10)");
      glow.addColorStop(1, "rgba(120,150,180,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      for (let layer = 0; layer < 4; layer++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * (layer % 2 ? -.16 : .12) + layer * .42);
        ctx.scale(1 + layer * .055, .72 + layer * .035);
        const gradient = ctx.createLinearGradient(-scale, -scale, scale, scale);
        gradient.addColorStop(0, darkMode ? "rgba(235,245,255,.04)" : "rgba(70,85,100,.035)");
        gradient.addColorStop(.48, darkMode ? "rgba(185,220,245,.52)" : "rgba(80,105,130,.42)");
        gradient.addColorStop(1, darkMode ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.72)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(2, scale * (.018 - layer * .002));
        ctx.shadowBlur = 18;
        ctx.shadowColor = darkMode ? "rgba(160,210,255,.22)" : "rgba(90,120,150,.16)";
        ctx.beginPath();
        ctx.ellipse(0, 0, scale * (1 + layer * .075), scale * (.56 + layer * .045), Math.sin(t + layer) * .18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      if (!reduceMotion) fallbackRaf = requestAnimationFrame(drawFallback);
    };
    const fallbackObserver = new IntersectionObserver(entries => {
      fallbackVisible = entries[0].isIntersecting;
      if (fallbackVisible && !fallbackRaf && !reduceMotion) fallbackRaf = requestAnimationFrame(drawFallback);
      if (!fallbackVisible && fallbackRaf) cancelAnimationFrame(fallbackRaf), fallbackRaf = 0;
      if (fallbackVisible && reduceMotion) drawFallback(performance.now());
    }, { threshold: .02 });
    fallbackObserver.observe(stage);
    const fallbackResize = new ResizeObserver(resizeFallback);
    fallbackResize.observe(stage);
    resizeFallback();
    if (reduceMotion) drawFallback(performance.now());
    else fallbackRaf = requestAnimationFrame(drawFallback);
    cleanupWebGL = () => {
      fallbackObserver.disconnect();
      fallbackResize.disconnect();
      if (fallbackRaf) cancelAnimationFrame(fallbackRaf);
    };
  }

  const revealFallback = () => {
    fallback.style.opacity = "1";
    fallback.style.visibility = "visible";
    fallback.dataset.webglActive = "false";
  };

  (async () => {
    let THREE;
    try {
      THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
    } catch (_) { return; }
    if (!window.WebGLRenderingContext) return;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !mobile,
        powerPreference: "high-performance"
      });
    } catch (_) { return; }

    renderer.domElement.className = "fluid-glass-webgl";
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.6));
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    camera.position.set(0, 0, 5.2);

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const glassGeometry = new THREE.TorusKnotGeometry(1.02, .285, mobile ? 150 : 240, mobile ? 20 : 32, 2, 3);
    const glassMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDark: { value: dark() ? 1 : 0 },
        uPointer: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uPointer;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying float vWave;
        void main() {
          vec3 p = position;
          float wave = sin(p.x * 2.15 + uTime * .48) * cos(p.y * 2.4 - uTime * .34)
                     + sin(p.z * 2.8 + uTime * .28) * .42;
          p += normalize(normal) * wave * .045;
          p += normal * sin(uTime * .22 + p.y * 1.7) * .018;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          vNormal = normalize(normalMatrix * normal);
          vViewPosition = -mv.xyz;
          vec4 world = modelMatrix * vec4(p, 1.0);
          vWorldPosition = world.xyz;
          vWave = wave;
        }`,
      fragmentShader: `
        uniform float uTime;
        uniform float uDark;
        uniform vec2 uPointer;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying float vWave;
        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewPosition);
          float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.25);
          float sweep = sin(vWorldPosition.y * 5.2 + vWorldPosition.x * 2.8 + uTime * .62);
          float iridescence = .5 + .5 * sin(sweep * 2.2 + vWave * 2.0);
          vec3 pearl = vec3(.76, .82, .88);
          vec3 silver = vec3(.30, .39, .49);
          vec3 ice = vec3(.46, .70, .84);
          vec3 tint = mix(silver, ice, iridescence * .62);
          vec3 color = mix(pearl, tint, .34 + fresnel * .66);
          color += vec3(.30, .39, .48) * pow(max(dot(reflect(-V, N), normalize(vec3(-.4,.7,1.0))), 0.0), 18.0);
          if (uDark > .5) color = mix(vec3(.22,.28,.34), vec3(.78,.88,.96), fresnel * .82 + iridescence * .18);
          float alpha = .60 + fresnel * .36;
          gl_FragColor = vec4(color, alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    sculpture.add(glass);

    const makeOrbit = (radius, tube, color, opacity, rotation) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 5, 180),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
      );
      mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
      sculpture.add(mesh);
      return mesh;
    };
    const orbitA = makeOrbit(1.72, .006, dark() ? 0xb6d9ee : 0x8298aa, .22, [1.16, .28, -.24]);
    const orbitB = makeOrbit(1.88, .0035, dark() ? 0x8abfe0 : 0xb0bac4, .15, [.72, -.44, .58]);

    const pointer = new THREE.Vector2(0, 0);
    let pointerActive = false;
    const onPointerMove = event => {
      const rect = stage.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width - .5) * 2, ((event.clientY - rect.top) / rect.height - .5) * -2);
      pointerActive = true;
    };
    const onPointerLeave = () => { pointerActive = false; };
    if (matchMedia("(pointer:fine)").matches) {
      stage.addEventListener("pointermove", onPointerMove, { passive: true });
      stage.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
      camera.aspect = w / h;
      camera.position.z = w < 520 ? 5.9 : 5.2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    const clock = new THREE.Clock();
    const render = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      glassMaterial.uniforms.uTime.value = t;
      glassMaterial.uniforms.uDark.value = dark() ? 1 : 0;
      glassMaterial.uniforms.uPointer.value.copy(pointer);
      const targetX = pointerActive && !reduceMotion ? pointer.y * .12 : 0;
      const targetY = pointerActive && !reduceMotion ? pointer.x * .16 : 0;
      sculpture.rotation.x += (targetX + Math.sin(t * .18) * .045 - sculpture.rotation.x) * .025;
      sculpture.rotation.y += (targetY + t * .075 - sculpture.rotation.y) * .018;
      sculpture.rotation.z = Math.sin(t * .13) * .045;
      orbitA.rotation.z += reduceMotion ? 0 : .00055;
      orbitB.rotation.x -= reduceMotion ? 0 : .00032;
      renderer.render(scene, camera);
      if (fallback.style.opacity !== "0") {
        fallback.style.opacity = "0";
        fallback.dataset.webglActive = "true";
      }
      if (!reduceMotion) raf = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && !reduceMotion && !raf && !document.hidden) raf = requestAnimationFrame(render);
      if (!visible && raf) cancelAnimationFrame(raf), raf = 0;
      if (visible && reduceMotion) render();
    }, { threshold: .02 });
    observer.observe(stage);

    const onVisibility = () => {
      if (document.hidden && raf) cancelAnimationFrame(raf), raf = 0;
      else if (!document.hidden && visible && !reduceMotion && !raf) raf = requestAnimationFrame(render);
      else if (!document.hidden && visible && reduceMotion) render();
    };
    document.addEventListener("visibilitychange", onVisibility);

    renderer.domElement.addEventListener("webglcontextlost", event => {
      event.preventDefault();
      if (raf) cancelAnimationFrame(raf), raf = 0;
      revealFallback();
    });

    const themeObserver = new MutationObserver(() => {
      glassMaterial.uniforms.uDark.value = dark() ? 1 : 0;
      orbitA.material.color.setHex(dark() ? 0xb6d9ee : 0x8298aa);
      orbitB.material.color.setHex(dark() ? 0x8abfe0 : 0xb0bac4);
      if (reduceMotion && visible) render();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    cleanupWebGL = () => {
      observer.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      if (raf) cancelAnimationFrame(raf);
      glassGeometry.dispose();
      glassMaterial.dispose();
      orbitA.geometry.dispose(); orbitA.material.dispose();
      orbitB.geometry.dispose(); orbitB.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };

    if (reduceMotion) render();
    else raf = requestAnimationFrame(render);
  })().catch(() => {
    revealFallback();
  });
})();
