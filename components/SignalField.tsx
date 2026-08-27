"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient background: a field of drifting signals.
 *
 * The one rule the shader obeys is that overlapping signals combine with
 * max(), not with addition — two signals landing on the same place produce
 * one signal, never a brighter one. That is the idempotency the case
 * studies talk about, and it is also why the field can never blow out and
 * eat the contrast of the text sitting on top of it.
 *
 * Raw WebGL2, no library: this is a full-screen fragment shader with no
 * geometry, no camera and no textures, so three.js would be 150 KB spent
 * on abstractions none of which are used here.
 *
 * Everything degrades: coarse pointers and reduced motion never start a
 * loop, context loss falls back to the CSS gradient underneath, and the
 * canvas only mounts after the hero has painted.
 */

const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uPointer;
uniform vec3  uBase;
uniform vec3  uDeep;
uniform vec3  uAccent;
uniform vec3  uPending;
uniform float uStrength;

float signalAt(vec2 uv, vec2 c, float r) {
  vec2 d = uv - c;
  return exp(-dot(d, d) / (r * r));
}

// Cheap ordered dither: kills banding across large flat gradients.
float dither(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453) - 0.5;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  float field = 0.0;
  float pending = 0.0;

  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float sp = 0.055 + 0.018 * fi;

    vec2 c = vec2(
      sin(uTime * sp + fi * 2.1) * (0.52 + 0.07 * fi),
      cos(uTime * sp * 0.78 + fi * 1.7) * 0.36
    );

    // Nearer layers track the pointer more than distant ones.
    c += uPointer * (0.028 + 0.013 * fi);

    float r = 0.30 + 0.07 * sin(fi * 3.0);
    float s = signalAt(uv, c, r);

    // Overlap merges instead of accumulating.
    field = max(field, s);
    if (i == 2 || i == 5) pending = max(pending, s);
  }

  // Mix amounts are capped so the brightest pixel the field can produce
  // still clears 4.5:1 against muted body text. Measured, not eyeballed:
  // raising these is a contrast regression, not a style tweak.
  vec3 col = uBase;
  col = mix(col, uDeep, field * 0.22 * uStrength);
  col = mix(col, uAccent, pow(field, 3.0) * 0.10 * uStrength);
  col = mix(col, uPending, pow(pending, 6.0) * 0.05 * uStrength);

  // Vignette keeps the edges quiet so section text never fights the field.
  float vig = smoothstep(1.25, 0.25, length(uv));
  col = mix(uBase, col, vig);

  col += dither(gl_FragCoord.xy) / 255.0;

  fragColor = vec4(col, 1.0);
}`;

function readRgb(el: HTMLElement, name: string): [number, number, number] {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  const m = raw.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const p = raw.match(/[\d.]+/g);
  if (p && p.length >= 3) {
    return [+p[0] / 255, +p[1] / 255, +p[2] / 255];
  }
  return [0, 0, 0];
}

export default function SignalField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");

    // Coarse pointers (phones, tablets) keep the CSS gradient: the shader
    // costs battery for an effect nobody hovers.
    const bail = (why: string) => {
      if (process.env.NODE_ENV !== "production") {
        console.info(`[SignalField] static gradient: ${why}`);
      }
    };

    if (!fine.matches) {
      bail("coarse pointer");
      return;
    }

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      bail("no webgl2 context");
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      bail("shader compile failed");
      return;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      bail("program link failed");
      return;
    }
    gl.useProgram(prog);

    const u = {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      pointer: gl.getUniformLocation(prog, "uPointer"),
      base: gl.getUniformLocation(prog, "uBase"),
      deep: gl.getUniformLocation(prog, "uDeep"),
      accent: gl.getUniformLocation(prog, "uAccent"),
      pending: gl.getUniformLocation(prog, "uPending"),
      strength: gl.getUniformLocation(prog, "uStrength"),
    };

    const root = document.documentElement;
    const pushPalette = () => {
      gl.uniform3fv(u.base, readRgb(root, "--p-bg"));
      gl.uniform3fv(u.deep, readRgb(root, "--p-accent-deep"));
      gl.uniform3fv(u.accent, readRgb(root, "--p-accent"));
      gl.uniform3fv(u.pending, readRgb(root, "--p-signal-pending"));
      // Light mode runs the field at 0.38: measured, that is where the
      // accent eyebrow clears 4.5:1 against the brightest possible pixel
      // (0.45 lands exactly on the line, 0.55 fails at 4.35:1).
      const isDark = getComputedStyle(root).colorScheme.includes("dark");
      gl.uniform1f(u.strength, isDark ? 1.0 : 0.38);
    };
    pushPalette();

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nw = Math.max(1, Math.round(host.clientWidth * dpr));
      const nh = Math.max(1, Math.round(host.clientHeight * dpr));
      if (nw === w && nh === h) return; // no resize thrashing
      w = nw;
      h = nh;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u.res, w, h);
    };
    resize();

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    let raf = 0;
    let running = false;
    let visible = true;
    const start = performance.now();

    const draw = (now: number) => {
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;
      gl.uniform2f(u.pointer, pointer.x, pointer.y);
      gl.uniform1f(u.time, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running || reduced.matches || document.hidden || !visible) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Reduced motion: paint exactly one frame, never start a loop.
    if (reduced.matches) {
      draw(start);
      setLive(true);
    } else {
      play();
      setLive(true);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        visible ? play() : pause();
      },
      { threshold: 0 },
    );
    io.observe(host);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced.matches) draw(performance.now());
    });
    ro.observe(host);

    const onVisibility = () => (document.hidden ? pause() : play());
    const onThemeChange = () => {
      pushPalette();
      if (reduced.matches) draw(performance.now());
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      pause();
      setLive(false); // reveals the CSS gradient underneath
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    const schemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    schemeMq.addEventListener("change", onThemeChange);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      schemeMq.removeEventListener("change", onThemeChange);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      // Deliberately NOT calling loseContext(): getContext() returns the
      // same object for a given canvas, so losing it here would leave a
      // dead context behind for any remount (React StrictMode does exactly
      // that in development). Deleting the program and shaders is enough;
      // the context is collected with the canvas.
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Painted immediately; the canvas fades in over it once ready, and
          it stays as the fallback for coarse pointers and context loss. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 22% 8%, var(--p-accent-deep) 0%, transparent 55%), radial-gradient(90% 70% at 82% 0%, var(--p-glow) 0%, transparent 60%), var(--p-bg)",
          opacity: 0.55,
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-700"
        style={{ opacity: live ? 1 : 0 }}
      />
      <div className="tech-grid grid-fade absolute inset-0" />
    </div>
  );
}
