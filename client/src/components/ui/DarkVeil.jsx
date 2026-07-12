import React, { useRef, useEffect } from 'react';

export default function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0,
  scanlineIntensity = 0,
  speed = 0.5,
  scanlineFrequency = 0,
  warpAmount = 0,
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (timestamp) => {
      const t = (timestamp * 0.001 * speed) % 1000;
      timeRef.current = t;
      const w = canvas.width;
      const h = canvas.height;

      // Dark gradient base
      const hue = (250 + hueShift) % 360;
      const grad = ctx.createRadialGradient(
        w * 0.5 + Math.sin(t * 0.3) * w * 0.15,
        h * 0.4 + Math.cos(t * 0.2) * h * 0.1,
        0,
        w * 0.5,
        h * 0.5,
        w * 0.7
      );
      grad.addColorStop(0, `hsla(${hue}, 40%, 12%, 1)`);
      grad.addColorStop(0.4, `hsla(${(hue + 20) % 360}, 30%, 6%, 1)`);
      grad.addColorStop(1, '#030308');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle animated orb glow
      const orbGrad = ctx.createRadialGradient(
        w * 0.5 + Math.sin(t * 0.5) * w * 0.2,
        h * 0.5 + Math.cos(t * 0.4) * h * 0.15,
        0,
        w * 0.5 + Math.sin(t * 0.5) * w * 0.2,
        h * 0.5 + Math.cos(t * 0.4) * h * 0.15,
        w * 0.35
      );
      orbGrad.addColorStop(0, `hsla(${(hue + 40) % 360}, 50%, 15%, 0.15)`);
      orbGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = orbGrad;
      ctx.fillRect(0, 0, w, h);

      // Warp effect (subtle distortion)
      if (warpAmount > 0) {
        const warpGrad = ctx.createRadialGradient(
          w * 0.5, h * 0.5, 0,
          w * 0.5, h * 0.5, w * 0.5
        );
        warpGrad.addColorStop(0, `hsla(${(hue + 60) % 360}, 30%, 10%, ${warpAmount * 0.05})`);
        warpGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = warpGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Scanlines
      if (scanlineIntensity > 0 && scanlineFrequency > 0) {
        ctx.globalAlpha = scanlineIntensity;
        const lineSpacing = Math.max(1, Math.floor(1 / scanlineFrequency));
        for (let y = 0; y < h; y += lineSpacing) {
          ctx.fillStyle = `rgba(0,0,0,0.3)`;
          ctx.fillRect(0, y, w, 1);
        }
        ctx.globalAlpha = 1;
      }

      // Noise
      if (noiseIntensity > 0) {
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const intensity = noiseIntensity * 20;
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * intensity;
          data[i] += noise;
          data[i + 1] += noise;
          data[i + 2] += noise;
        }
        ctx.putImageData(imgData, 0, 0);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
