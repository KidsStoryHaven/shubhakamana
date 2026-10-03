import React, { useEffect, useRef } from 'react';

interface FestiveCanvasProps {
  type: 'fireworks' | 'diyas' | 'confetti' | 'colors' | 'flowers' | 'stars';
  interactive?: boolean;
  onTap?: () => void;
  festivalId?: string;
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
  shape: 'spark' | 'petal' | 'confetti' | 'diya' | 'star' | 'color_cloud' | 'color_droplet' | 'rocket' | 'bilva';
  rotation?: number;
  rotationSpeed?: number;
  trail?: { x: number; y: number; alpha: number }[];
  maxRadius?: number; // for color cloud expansion
  currentRadius?: number;
  sparkle?: boolean;
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

    // Color Palettes
    const colorsMap = {
      fireworks: [
        '#fef08a', '#fbbf24', '#f59e0b', '#ef4444', '#f43f5e', 
        '#ec4899', '#38bdf8', '#3b82f6', '#10b981', '#ffffff'
      ],
      colors: [
        '#ec4899', // Gulabi Pink
        '#f43f5e', // Dark Rose
        '#facc15', // Haldi Yellow
        '#22c55e', // Abeer Green
        '#06b6d4', // Firozi Cyan
        '#3b82f6', // Neelam Blue
        '#f97316', // Kesar Saffron
        '#a855f7'  // Jamuni Violet
      ],
      diyas: ['#f59e0b', '#d97706', '#b45309', '#fef3c7', '#fbbf24', '#fb923c'],
      flowers: ['#fb7185', '#fda4af', '#f43f5e', '#fde047', '#fbcfe8', '#fed7aa', '#ffffff'],
      stars: ['#fef08a', '#ffffff', '#e0e7ff', '#fcd34d', '#34d399', '#38bdf8'],
      confetti: ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#e11d48', '#3b82f6']
    };

    const currentPalette = colorsMap[type] || colorsMap.fireworks;

    // 1. DIWALI AATISHBAJI: Spawn a rocket with fiery tail that explodes at apex
    const launchRocket = (targetX: number, targetY: number) => {
      const startX = targetX + (Math.random() - 0.5) * 60;
      const startY = height + 10;
      const duration = 28 + Math.random() * 10;
      const vx = (targetX - startX) / duration;
      const vy = (targetY - startY) / duration;

      particlesRef.current.push({
        x: startX,
        y: startY,
        vx,
        vy,
        size: 3.5,
        color: '#fef08a',
        alpha: 1,
        decay: 1 / duration,
        shape: 'rocket',
        trail: []
      });
    };

    // 2. DIWALI EXPLOSION BURST (Aatishbaji blast)
    const createFireworkExplosion = (x: number, y: number, count = 55) => {
      const mainColor = currentPalette[Math.floor(Math.random() * currentPalette.length)];
      const isMultiColor = Math.random() > 0.4;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5.5 + 1.5;
        const color = isMultiColor 
          ? currentPalette[Math.floor(Math.random() * currentPalette.length)]
          : mainColor;

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.8,
          color,
          alpha: 1,
          decay: Math.random() * 0.016 + 0.010,
          shape: 'spark',
          sparkle: Math.random() > 0.4,
          trail: []
        });
      }
    };

    // 3. HOLI COLOUR BLAST (गुलाल के गुबार व पिचकारी बौछार)
    const createHoliColorBlast = (originX: number, originY: number, power = 1.0) => {
      // (a) Expanding Powder Clouds (3-5 overlapping colored puffs)
      const cloudColors = [
        '#ec4899', '#facc15', '#22c55e', '#06b6d4', '#f97316', '#a855f7'
      ];
      // Pick 3 random distinct colors
      const chosen = [...cloudColors].sort(() => 0.5 - Math.random()).slice(0, 3);

      chosen.forEach((col, idx) => {
        const angle = (idx / 3) * Math.PI * 2 + Math.random() * 0.5;
        const dist = (Math.random() * 18 + 5) * power;
        particlesRef.current.push({
          x: originX + Math.cos(angle) * dist,
          y: originY + Math.sin(angle) * dist,
          vx: Math.cos(angle) * (1.2 * power),
          vy: Math.sin(angle) * (1.2 * power) - 0.2,
          size: 10,
          currentRadius: 10,
          maxRadius: (45 + Math.random() * 35) * power,
          color: col,
          alpha: 0.85,
          decay: 0.012,
          shape: 'color_cloud'
        });
      });

      // (b) Splattering Pichkari Droplets (flying outward)
      const dropletCount = Math.floor(40 * power);
      for (let i = 0; i < dropletCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 6 + 2.5) * power;
        const color = cloudColors[Math.floor(Math.random() * cloudColors.length)];

        particlesRef.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          size: Math.random() * 3.5 + 2,
          color,
          alpha: 1,
          decay: Math.random() * 0.018 + 0.012,
          shape: 'color_droplet',
          trail: []
        });
      }
    };

    // Generic Festive Burst for other types
    const createStandardBurst = (x: number, y: number, count = 35) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.2;
        const color = currentPalette[Math.floor(Math.random() * currentPalette.length)];

        let shape: Particle['shape'] = 'spark';
        if (type === 'flowers') shape = 'petal';
        else if (type === 'confetti') shape = 'confetti';
        else if (type === 'diyas') shape = 'diya';
        else if (type === 'stars') shape = 'star';

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color,
          alpha: 1,
          decay: Math.random() * 0.014 + 0.008,
          shape,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8
        });
      }
    };

    // Unified Burst Trigger
    const triggerFestiveBurstAt = (x: number, y: number) => {
      if (type === 'fireworks') {
        createFireworkExplosion(x, y, 65);
      } else if (type === 'colors') {
        createHoliColorBlast(x, y, 1.2);
      } else {
        createStandardBurst(x, y, 40);
      }
    };

    // Auto-spawning ambient festival atmosphere
    let lastAutoSpawn = 0;
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // Periodically trigger ambient festival action
      if (timestamp - lastAutoSpawn > 1100) {
        lastAutoSpawn = timestamp;

        if (type === 'fireworks') {
          // Launch random sky rocket
          const targetX = width * 0.15 + Math.random() * width * 0.7;
          const targetY = height * 0.15 + Math.random() * height * 0.35;
          launchRocket(targetX, targetY);
        } else if (type === 'colors') {
          // Soft ambient Holi Gulal puff
          const rx = width * 0.15 + Math.random() * width * 0.7;
          const ry = height * 0.2 + Math.random() * height * 0.45;
          createHoliColorBlast(rx, ry, 0.7);
        } else if (type === 'flowers') {
          // Spawn drifting floral petals from top
          for (let f = 0; f < 3; f++) {
            particlesRef.current.push({
              x: Math.random() * width,
              y: -15,
              vx: (Math.random() - 0.5) * 1.5,
              vy: Math.random() * 1.5 + 1.0,
              size: Math.random() * 5 + 3,
              color: currentPalette[Math.floor(Math.random() * currentPalette.length)],
              alpha: 0.9,
              decay: 0.004,
              shape: 'petal',
              rotation: Math.random() * 360,
              rotationSpeed: (Math.random() - 0.5) * 4
            });
          }
        } else if (type === 'diyas') {
          // Spawn glowing floating embers/diyas from bottom
          for (let d = 0; d < 3; d++) {
            particlesRef.current.push({
              x: Math.random() * width,
              y: height + 10,
              vx: (Math.random() - 0.5) * 1.0,
              vy: -(Math.random() * 1.5 + 0.8),
              size: Math.random() * 4 + 2.5,
              color: currentPalette[Math.floor(Math.random() * currentPalette.length)],
              alpha: 0.9,
              decay: 0.005,
              shape: 'diya'
            });
          }
        } else if (type === 'stars') {
          // Twinkling star bursts
          createStandardBurst(width * 0.15 + Math.random() * width * 0.7, height * 0.2 + Math.random() * height * 0.5, 18);
        } else if (type === 'confetti') {
          createStandardBurst(width * 0.2 + Math.random() * width * 0.6, height * 0.25, 25);
        }
      }

      // Update and draw existing particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        // Specific motion physics by shape
        if (p.shape === 'rocket') {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          // Record fiery trail
          p.trail?.push({ x: p.x, y: p.y, alpha: p.alpha });
          if (p.trail && p.trail.length > 8) p.trail.shift();

          // When rocket dies, explode!
          if (p.alpha <= 0.05) {
            createFireworkExplosion(p.x, p.y, 60);
            particlesRef.current.splice(i, 1);
            continue;
          }
        } else if (p.shape === 'color_cloud') {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.alpha -= p.decay;
          if (p.currentRadius !== undefined && p.maxRadius !== undefined) {
            p.currentRadius += (p.maxRadius - p.currentRadius) * 0.08;
          }
        } else if (p.shape === 'color_droplet') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // gravity on liquid droplets
          p.vx *= 0.98; // air resistance
          p.alpha -= p.decay;
        } else if (p.shape === 'petal') {
          p.y += p.vy;
          p.x += p.vx + Math.sin(p.y * 0.02) * 0.6; // gentle sinusoidal flutter
          p.alpha -= p.decay;
        } else if (p.shape === 'diya') {
          p.y += p.vy;
          p.x += p.vx + Math.sin(p.y * 0.03) * 0.4;
          p.alpha -= p.decay;
        } else if (p.shape === 'spark') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.06; // slight gravity
          p.vx *= 0.97;
          p.alpha -= p.decay;
        } else {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05;
          p.vx *= 0.98;
          p.alpha -= p.decay;
        }

        if (p.rotation !== undefined && p.rotationSpeed) {
          p.rotation += p.rotationSpeed;
        }

        // Cleanup expired particles
        if (p.alpha <= 0 || p.x < -30 || p.x > width + 30 || p.y < -30 || p.y > height + 30) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // ============================================
        // RENDERING
        // ============================================
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

        // 1. ROCKET TRAIL
        if (p.shape === 'rocket') {
          if (p.trail && p.trail.length > 1) {
            for (let t = 0; t < p.trail.length - 1; t++) {
              ctx.beginPath();
              ctx.moveTo(p.trail[t].x, p.trail[t].y);
              ctx.lineTo(p.trail[t + 1].x, p.trail[t + 1].y);
              ctx.strokeStyle = '#f59e0b';
              ctx.lineWidth = (t / p.trail.length) * 3;
              ctx.stroke();
            }
          }
          // Glowing rocket head
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.fill();
        } 
        // 2. HOLI COLOR CLOUD (Expanding powder puff with radial glow)
        else if (p.shape === 'color_cloud') {
          const rad = p.currentRadius || p.size;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.6, p.color);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          ctx.fill();
        } 
        // 3. HOLI WATER DROPLET
        else if (p.shape === 'color_droplet') {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } 
        // 4. PETAL
        else if (p.shape === 'petal') {
          ctx.translate(p.x, p.y);
          if (p.rotation) ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        } 
        // 5. DIYA / EMBERS
        else if (p.shape === 'diya') {
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } 
        // 6. CONFETTI STRIPS
        else if (p.shape === 'confetti') {
          ctx.translate(p.x, p.y);
          if (p.rotation) ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
        } 
        // 7. STAR
        else if (p.shape === 'star') {
          ctx.translate(p.x, p.y);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            ctx.rotate(Math.PI / 2);
            ctx.lineTo(p.size * 1.5, 0);
            ctx.lineTo(p.size * 0.3, p.size * 0.3);
          }
          ctx.fill();
        } 
        // 8. GENERAL SPARK
        else {
          ctx.fillStyle = p.color;
          if (p.sparkle) {
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 6;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Initial greeting burst
    if (type === 'fireworks') {
      createFireworkExplosion(width * 0.5, height * 0.3, 70);
    } else if (type === 'colors') {
      createHoliColorBlast(width * 0.5, height * 0.35, 1.4);
    } else {
      createStandardBurst(width * 0.5, height * 0.35, 45);
    }

    // Interactive Click / Tap Handling
    const handleCanvasClick = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      triggerFestiveBurstAt(x, y);

      if (onTap) {
        onTap();
      }
    };

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('touchstart', handleCanvasClick, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('touchstart', handleCanvasClick);
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
