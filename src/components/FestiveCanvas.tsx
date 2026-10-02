import React, { useEffect, useRef } from 'react';

interface FestiveCanvasProps {
  type: 'fireworks' | 'diyas' | 'confetti' | 'colors' | 'flowers' | 'stars';
  interactive?: boolean;
  onTap?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  shape: 'circle' | 'spark' | 'petal' | 'confetti' | 'diya';
  rotation?: number;
  rotationSpeed?: number;
}

export const FestiveCanvas: React.FC<FestiveCanvasProps> = ({ type, interactive = true, onTap }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colorsMap = {
      fireworks: ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#10b981', '#ffffff'],
      diyas: ['#f59e0b', '#d97706', '#b45309', '#fef3c7', '#fbbf24'],
      confetti: ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#e11d48'],
      colors: ['#ec4899', '#8b5cf6', '#eab308', '#22c55e', '#06b6d4', '#f97316'],
      flowers: ['#fb7185', '#fda4af', '#f43f5e', '#fde047', '#fbcfe8'],
      stars: ['#fef08a', '#ffffff', '#e0e7ff', '#fcd34d']
    };

    const currentPalette = colorsMap[type] || colorsMap.fireworks;

    const createBurst = (x: number, y: number, count = 35) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        const color = currentPalette[Math.floor(Math.random() * currentPalette.length)];
        
        let shape: Particle['shape'] = 'circle';
        if (type === 'fireworks') shape = 'spark';
        else if (type === 'flowers') shape = 'petal';
        else if (type === 'confetti') shape = 'confetti';
        else if (type === 'diyas') shape = 'circle';
        else if (type === 'colors') shape = 'circle';

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.008,
          shape,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8
        });
      }
    };

    // Auto spawn ambient particles
    let lastAutoSpawn = 0;
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // Periodically trigger fireworks / petals / colors
      if (timestamp - lastAutoSpawn > 1200) {
        lastAutoSpawn = timestamp;
        if (type === 'fireworks') {
          createBurst(width * 0.2 + Math.random() * width * 0.6, height * 0.15 + Math.random() * height * 0.45, 45);
        } else if (type === 'confetti' || type === 'colors') {
          createBurst(width * 0.1 + Math.random() * width * 0.8, height * 0.2 + Math.random() * height * 0.4, 30);
        } else if (type === 'flowers' || type === 'diyas') {
          createBurst(width * 0.1 + Math.random() * width * 0.8, height * 0.8, 15);
        }
      }

      // Update and draw existing particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;

        if (type === 'flowers') {
          p.vy += 0.04; // gravity
          p.vx += Math.sin(p.y * 0.02) * 0.2; // gentle flutter
        } else if (type === 'diyas') {
          p.vy -= 0.03; // float upward
        } else {
          p.vy += 0.05; // slight gravity
          p.vx *= 0.98; // air drag
        }

        p.alpha -= p.decay;
        if (p.rotation !== undefined && p.rotationSpeed) {
          p.rotation += p.rotationSpeed;
        }

        if (p.alpha <= 0 || p.x < -20 || p.x > width + 20 || p.y > height + 20) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = type === 'fireworks' || type === 'diyas' ? 8 : 0;

        ctx.translate(p.x, p.y);
        if (p.rotation) {
          ctx.rotate((p.rotation * Math.PI) / 180);
        }

        if (p.shape === 'spark') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'confetti') {
          ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
        } else if (p.shape === 'petal') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Initial festive burst
    createBurst(width * 0.5, height * 0.35, 60);

    const handleCanvasClick = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      createBurst(x, y, 50);
      if (onTap) onTap();
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [type, interactive, onTap]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto z-10 w-full h-full"
      style={{ touchAction: 'manipulation' }}
    />
  );
};
