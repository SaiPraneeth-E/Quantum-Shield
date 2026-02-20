import { useEffect, useRef } from 'react';

/**
 * Quantum-style simulation: orbiting qubit circles, circuit lines, flowing particles.
 * Use as background overlay (fixed) or inside a section (absolute).
 */
export default function QuantumSimulation({ className = '', fixed = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      time += 0.008;

      const cx = w / 2;
      const cy = h / 2;

      // Orbiting qubit circles (3 orbits at different radii and speeds)
      const orbits = [
        { r: Math.min(w, h) * 0.12, speed: 0.4, count: 3 },
        { r: Math.min(w, h) * 0.2, speed: -0.25, count: 4 },
        { r: Math.min(w, h) * 0.28, speed: 0.15, count: 5 },
      ];

      orbits.forEach((orbit, oi) => {
        for (let i = 0; i < orbit.count; i++) {
          const angle = time * orbit.speed + (i / orbit.count) * Math.PI * 2;
          const x = cx + Math.cos(angle) * orbit.r;
          const y = cy + Math.sin(angle) * orbit.r * 0.6;
          const pulse = 0.6 + 0.4 * Math.sin(time * 2 + i);
          ctx.beginPath();
          ctx.arc(x, y, 3 + pulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${0.3 * pulse})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * pulse})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Orbit paths (ellipses)
      orbits.forEach((orbit) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, orbit.r, orbit.r * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.06 + 0.04 * Math.sin(time)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Circuit-style horizontal lines with moving dash
      const lineCount = 8;
      for (let i = 0; i < lineCount; i++) {
        const y = (h / (lineCount + 1)) * (i + 1);
        const offset = (time * 80 + i * 40) % 120;
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 + 0.04 * Math.sin(time + i)})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([20, 40]);
        ctx.lineDashOffset = -offset;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Flowing particles along a path
      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        const t = (time * 0.5 + i / particleCount) % 1;
        const pathAngle = t * Math.PI * 2;
        const px = cx + Math.cos(pathAngle) * (w * 0.4);
        const py = cy + Math.sin(pathAngle) * (h * 0.25);
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${0.5 * (0.5 + 0.5 * Math.sin(time * 3 + i))})`;
        ctx.fill();
      }

      // Central core glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.15);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`${fixed ? 'fixed inset-0 pointer-events-none' : 'absolute inset-0 pointer-events-none'} z-0 w-full h-full ${className}`}
      style={{ background: 'transparent' }}
      aria-hidden
    />
  );
}
