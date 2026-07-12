import React, { useRef, useState, useCallback, useEffect } from 'react';

export default function BorderGlow({
  children,
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
}) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const animFrame = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const getGradient = () => {
    const { x, y } = mousePos;
    return `radial-gradient(circle at ${x}px ${y}px, rgba(${glowColor}, ${glowIntensity}) 0%, transparent ${glowRadius}px)`;
  };

  const getBorderColor = () => {
    if (!isHovering) return 'transparent';
    const { x, y } = mousePos;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 'transparent';

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 180;
    const colorIndex = Math.floor((angle / 360) * colors.length) % colors.length;
    return colors[colorIndex];
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden',
      }}
    >
      {isHovering && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: `${borderRadius}px`,
            padding: '2px',
            background: `linear-gradient(135deg, ${colors.join(', ')})`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovering ? getGradient() : 'transparent',
          borderRadius: `${borderRadius}px`,
          transition: 'background 0.3s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: `${borderRadius}px`,
          background: backgroundColor,
          padding: '1px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
