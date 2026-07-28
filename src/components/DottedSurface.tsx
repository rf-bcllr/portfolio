import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface DottedSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = reduceMotionMq.matches;

    // Adaptive density — lighter on mobile
    const SEPARATION = isMobile ? 70 : 60;
    const AMOUNTX = isMobile ? 32 : 60;
    const AMOUNTY = isMobile ? 14 : 22;

    const getSize = () => ({
      w: container.clientWidth || window.innerWidth,
      h: container.clientHeight || 240,
    });

    const scene = new THREE.Scene();
    const { w, h } = getSize();

    const camera = new THREE.PerspectiveCamera(55, w / h, 1, 10000);
    camera.position.set(0, 260, 900);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    // Cap DPR to keep GPU work bounded on retina/mobile
    const dprCap = isMobile ? 1 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const resolveColor = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim();
      return new THREE.Color(`hsl(${raw.replace(/\s+/g, ", ")})`);
    };
    const dotColor = resolveColor();

    const positions: number[] = [];
    const colors: number[] = [];
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, 0, z);
        colors.push(dotColor.r, dotColor.g, dotColor.b);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = 0;
    let visible = true;
    let lastFrame = 0;
    // Cap animation to ~30fps on mobile, ~45fps on desktop to reduce CPU/GPU
    const targetInterval = isMobile ? 1000 / 30 : 1000 / 45;

    const updatePositions = () => {
      const posAttr = geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const idx = i * 3;
          arr[idx + 1] =
            Math.sin((ix + count) * 0.3) * 30 +
            Math.sin((iy + count) * 0.5) * 30;
          i++;
        }
      }
      posAttr.needsUpdate = true;
    };

    const renderStatic = () => {
      updatePositions();
      renderer.render(scene, camera);
    };

    const animate = (t: number) => {
      animationId = requestAnimationFrame(animate);
      if (!visible) return;
      if (t - lastFrame < targetInterval) return;
      lastFrame = t;
      updatePositions();
      renderer.render(scene, camera);
      count += reduceMotion ? 0.01 : 0.05;
    };

    const handleResize = () => {
      const { w, h } = getSize();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // Pause offscreen to save cycles
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(container);

    // Pause when tab is hidden
    const onVisibility = () => {
      if (document.hidden) visible = false;
      else visible = true;
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Respect reduced-motion — render a single static frame instead of animating
    const onReduceChange = () => {
      reduceMotion = reduceMotionMq.matches;
    };
    reduceMotionMq.addEventListener?.("change", onReduceChange);

    if (reduceMotion) {
      renderStatic();
    } else {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotionMq.removeEventListener?.("change", onReduceChange);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    />
  );
}
