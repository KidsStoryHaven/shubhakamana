import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Camera, 
  Sparkles, 
  Crown,
  Sun,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { NavratriAiVideoItem } from '../data/navratriAiVideoData';
import { resolveDirectImageUrl } from '../utils/googleDriveHelper';
import { openWhatsAppUniversal } from '../utils/shareWithImageHelper';

interface VideoStatusPlayer916Props {
  videoItem: NavratriAiVideoItem;
  initialSenderName?: string;
  initialUserPhoto?: string | null;
  onSelectAnotherVideo?: () => void;
}

export const VideoStatusPlayer916: React.FC<VideoStatusPlayer916Props> = ({
  videoItem,
  initialSenderName = 'दिनेश शर्मा',
  initialUserPhoto = null,
  onSelectAnotherVideo
}) => {
  // =========================================================================
  // 1. PERSONALIZATION STATES (BADA PHOTO & NAME)
  // =========================================================================
  const [senderName, setSenderName] = useState<string>(() => {
    return localStorage.getItem('shubhakamna_my_name') || initialSenderName || 'आपका नाम';
  });
  const [userPhoto, setUserPhoto] = useState<string | null>(initialUserPhoto);
  const [showPhotoBadge, setShowPhotoBadge] = useState<boolean>(true);
  const [selectedShloka, setSelectedShloka] = useState<string>(videoItem.defaultShloka);
  const [customBlessing, setCustomBlessing] = useState<string>(videoItem.defaultBlessing);
  const [greetingHeadline] = useState<string>('✨ पावन नवरात्रि की हार्दिक शुभकामनाएँ ✨');

  // =========================================================================
  // 2. 3D AI ANIMATION & EFFECTS CONTROLS
  // =========================================================================
  const [enableCameraMotion, setEnableCameraMotion] = useState<boolean>(true);
  const [enableGodRays, setEnableGodRays] = useState<boolean>(true);
  const [enableRotatingChakra, setEnableRotatingChakra] = useState<boolean>(true);
  const [enableAshirwadBeams, setEnableAshirwadBeams] = useState<boolean>(true);
  const [enableSwingingBells, setEnableSwingingBells] = useState<boolean>(true);
  const [enablePetals, setEnablePetals] = useState<boolean>(true);
  const [enableDiyas, setEnableDiyas] = useState<boolean>(true);
  const [enableSparkles, setEnableSparkles] = useState<boolean>(true);
  const [enableDhunuchiSmoke, setEnableDhunuchiSmoke] = useState<boolean>(true);

  // Playback & Export States
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isShared, setIsShared] = useState<boolean>(false);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const userImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Synchronize when videoItem changes
  useEffect(() => {
    setSelectedShloka(videoItem.defaultShloka);
    setCustomBlessing(videoItem.defaultBlessing);
  }, [videoItem]);

  // Preload Background Image
  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = resolveDirectImageUrl(videoItem.imageUrl);
    img.onload = () => {
      if (isMounted) bgImgRef.current = img;
    };
    img.onerror = () => {
      const fb = document.createElement('canvas');
      fb.width = 720;
      fb.height = 1280;
      const fctx = fb.getContext('2d');
      if (fctx) {
        const grad = fctx.createLinearGradient(0, 0, 0, 1280);
        grad.addColorStop(0, '#450a0a');
        grad.addColorStop(0.5, '#7f1d1d');
        grad.addColorStop(1, '#1c1917');
        fctx.fillStyle = grad;
        fctx.fillRect(0, 0, 720, 1280);
      }
      const fbImg = new Image();
      fbImg.src = fb.toDataURL();
      fbImg.onload = () => {
        if (isMounted) bgImgRef.current = fbImg;
      };
    };
    return () => {
      isMounted = false;
    };
  }, [videoItem.imageUrl]);

  // Preload User Photo
  useEffect(() => {
    if (!userPhoto) {
      userImgRef.current = null;
      return;
    }
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = userPhoto;
    img.onload = () => {
      if (isMounted) userImgRef.current = img;
    };
    return () => {
      isMounted = false;
    };
  }, [userPhoto]);

  // Particles for 9:16 Canvas
  const particlesRef = useRef<{
    x: number;
    y: number;
    size: number;
    vy: number;
    vx: number;
    rot: number;
    rotSpeed: number;
    type: 'petal' | 'diya' | 'sparkle' | 'smoke';
    color: string;
    alpha: number;
  }[]>([]);

  useEffect(() => {
    const list: typeof particlesRef.current = [];
    for (let i = 0; i < 35; i++) {
      list.push({
        x: Math.random() * 720,
        y: Math.random() * 1280,
        size: 11 + Math.random() * 14,
        vy: 1.4 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 1.6,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.06,
        type: 'petal',
        color: ['#f43f5e', '#fb7185', '#fda4af', '#facc15', '#fef08a'][Math.floor(Math.random() * 5)],
        alpha: 0.75 + Math.random() * 0.25
      });
    }
    for (let i = 0; i < 14; i++) {
      list.push({
        x: Math.random() * 720,
        y: 820 + Math.random() * 460,
        size: 18 + Math.random() * 10,
        vy: -(0.9 + Math.random() * 1.5),
        vx: (Math.random() - 0.5) * 0.9,
        rot: 0,
        rotSpeed: 0,
        type: 'diya',
        color: '#fbbf24',
        alpha: 0.65 + Math.random() * 0.35
      });
    }
    for (let i = 0; i < 40; i++) {
      list.push({
        x: Math.random() * 720,
        y: Math.random() * 1280,
        size: 2.5 + Math.random() * 4.5,
        vy: -(0.6 + Math.random() * 1.4),
        vx: (Math.random() - 0.5) * 1.1,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: 0.1,
        type: 'sparkle',
        color: '#fef08a',
        alpha: 0.4 + Math.random() * 0.6
      });
    }
    for (let i = 0; i < 12; i++) {
      list.push({
        x: 100 + Math.random() * 520,
        y: 600 + Math.random() * 600,
        size: 40 + Math.random() * 60,
        vy: -(0.8 + Math.random() * 1.2),
        vx: Math.sin(i) * 0.8,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: 0.015,
        type: 'smoke',
        color: '#fef3c7',
        alpha: 0.12 + Math.random() * 0.1
      });
    }
    particlesRef.current = list;
  }, []);

  // Main 9:16 Canvas Animation Loop
  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, elapsedSec: number) => {
    const W = 720;
    const H = 1280;

    ctx.clearRect(0, 0, W, H);

    // A. 3D Camera Motion & Parallax
    ctx.save();
    let zoomScale = 1.0;
    let panX = 0;
    let panY = 0;
    let tiltAngle = 0;

    if (enableCameraMotion) {
      zoomScale = 1.0 + 0.14 * Math.sin(elapsedSec * 0.35);
      panX = 20 * Math.cos(elapsedSec * 0.28);
      panY = 12 * Math.sin(elapsedSec * 0.32);
      tiltAngle = Math.sin(elapsedSec * 0.2) * 0.015;
    }

    ctx.translate(W / 2 + panX, H / 2 + panY);
    ctx.rotate(tiltAngle);
    ctx.scale(zoomScale, zoomScale);
    ctx.translate(-W / 2, -H / 2);

    if (bgImgRef.current && bgImgRef.current.complete && bgImgRef.current.naturalWidth > 0) {
      const img = bgImgRef.current;
      const imgRatio = img.width / img.height;
      const targetRatio = W / H;
      let sw, sh, sx, sy;
      if (imgRatio > targetRatio) {
        sh = img.height;
        sw = sh * targetRatio;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        sw = img.width;
        sh = sw / targetRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#450a0a');
      grad.addColorStop(0.4, '#7f1d1d');
      grad.addColorStop(0.8, '#1c1917');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();

    // B. Volumetric God Rays
    if (enableGodRays) {
      ctx.save();
      const rayCenterX = W / 2 + 50 * Math.cos(elapsedSec * 0.3);
      const rayCenterY = 120;
      const numRays = 16;
      ctx.globalCompositeOperation = 'screen';

      for (let r = 0; r < numRays; r++) {
        const baseAngle = (r / numRays) * Math.PI + Math.PI * 0.05;
        const waveAngle = baseAngle + Math.sin(elapsedSec * 0.8 + r) * 0.08;
        const rayLength = 950;

        const rayGrad = ctx.createLinearGradient(
          rayCenterX, 
          rayCenterY, 
          rayCenterX + Math.cos(waveAngle) * rayLength, 
          rayCenterY + Math.sin(waveAngle) * rayLength
        );
        rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
        rayGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.22)');
        rayGrad.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(rayCenterX, rayCenterY);
        ctx.lineTo(
          rayCenterX + Math.cos(waveAngle - 0.05) * rayLength,
          rayCenterY + Math.sin(waveAngle - 0.05) * rayLength
        );
        ctx.lineTo(
          rayCenterX + Math.cos(waveAngle + 0.05) * rayLength,
          rayCenterY + Math.sin(waveAngle + 0.05) * rayLength
        );
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // C. 3D Rotating Chakra & Halo
    if (enableRotatingChakra) {
      ctx.save();
      const auraX = 360;
      const auraY = 460;
      const auraRadius = 205 + 24 * Math.sin(elapsedSec * 1.8);
      const auraRot = elapsedSec * 0.45;

      ctx.translate(auraX, auraY);
      ctx.rotate(auraRot);

      const auraGrad = ctx.createRadialGradient(0, 0, 30, 0, 0, auraRadius);
      auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
      auraGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.35)');
      auraGrad.addColorStop(0.8, 'rgba(220, 38, 38, 0.15)');
      auraGrad.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(253, 224, 71, 0.55)';
      ctx.lineWidth = 3;
      for (let r = 0; r < 24; r++) {
        const ang = (r / 24) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * 90, Math.sin(ang) * 90);
        ctx.lineTo(Math.cos(ang) * (auraRadius * 0.9), Math.sin(ang) * (auraRadius * 0.9));
        ctx.stroke();
      }

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, auraRadius * 0.92, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // D. Ashirwad Beams
    if (enableAshirwadBeams) {
      ctx.save();
      const handX = 290;
      const handY = 440;
      const pulseSec = elapsedSec * 2.5;

      for (let w = 0; w < 3; w++) {
        const ringProgress = (pulseSec + w * 0.8) % 3;
        const ringRad = 40 + ringProgress * 110;
        const ringAlpha = Math.max(0, 0.65 - ringProgress * 0.22);

        ctx.strokeStyle = `rgba(254, 240, 138, ${ringAlpha})`;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(handX, handY, ringRad, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // E. Dhunuchi Smoke
    if (enableDhunuchiSmoke) {
      particlesRef.current.forEach((p) => {
        if (p.type === 'smoke') {
          p.y += p.vy;
          p.x += Math.sin(elapsedSec * 1.2 + p.y * 0.01) * 0.8;
          if (p.y < 300) p.y = 1100;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          const smokeGrad = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, p.size);
          smokeGrad.addColorStop(0, 'rgba(254, 243, 199, 0.3)');
          smokeGrad.addColorStop(0.6, 'rgba(253, 230, 138, 0.12)');
          smokeGrad.addColorStop(1, 'rgba(253, 230, 138, 0.0)');
          ctx.fillStyle = smokeGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
    }

    // F. Swinging Bells
    if (enableSwingingBells) {
      const renderBell = (bx: number, by: number, swingOffset: number) => {
        ctx.save();
        const bellSwing = Math.sin(elapsedSec * 3.2 + swingOffset) * 0.22;
        ctx.translate(bx, by);
        ctx.rotate(bellSwing);

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(0, 0);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-18, 25);
        ctx.quadraticCurveTo(-22, 0, 0, -5);
        ctx.quadraticCurveTo(22, 0, 18, 25);
        ctx.lineTo(24, 32);
        ctx.lineTo(-24, 32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      };

      renderBell(70, 70, 0);
      renderBell(650, 70, Math.PI * 0.6);
    }

    // G. Petals, Diyas & Sparkles
    particlesRef.current.forEach((p) => {
      if (p.type === 'smoke') return;

      p.y += p.vy;
      p.x += p.vx + Math.sin(p.y * 0.02) * 0.6;
      p.rot += p.rotSpeed;

      if (p.y > H + 40) p.y = -30;
      if (p.y < -40) p.y = H + 20;
      if (p.x < -30) p.x = W + 20;
      if (p.x > W + 30) p.x = -20;

      ctx.save();
      ctx.globalAlpha = p.alpha;

      if (p.type === 'petal' && enablePetals) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'diya' && enableDiyas) {
        ctx.translate(p.x, p.y);
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(0, 5, p.size * 0.7, p.size * 0.35, 0, 0, Math.PI);
        ctx.fill();

        const flameHeight = p.size * (0.8 + 0.25 * Math.sin(elapsedSec * 8 + p.x));
        const flameGrad = ctx.createRadialGradient(0, 0, 2, 0, -flameHeight * 0.5, flameHeight);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#fef08a');
        flameGrad.addColorStop(0.7, '#f97316');
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.ellipse(0, -flameHeight * 0.4, p.size * 0.3, flameHeight * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'sparkle' && enableSparkles) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // H. Dark Vignettes & Text/Photo Badge
    const topVignette = ctx.createLinearGradient(0, 0, 0, 290);
    topVignette.addColorStop(0, 'rgba(12, 10, 9, 0.94)');
    topVignette.addColorStop(0.65, 'rgba(12, 10, 9, 0.55)');
    topVignette.addColorStop(1, 'rgba(12, 10, 9, 0.0)');
    ctx.fillStyle = topVignette;
    ctx.fillRect(0, 0, W, 290);

    const bottomVignette = ctx.createLinearGradient(0, H - 560, 0, H);
    bottomVignette.addColorStop(0, 'rgba(12, 10, 9, 0.0)');
    bottomVignette.addColorStop(0.25, 'rgba(12, 10, 9, 0.75)');
    bottomVignette.addColorStop(0.7, 'rgba(12, 10, 9, 0.96)');
    bottomVignette.addColorStop(1, 'rgba(12, 10, 9, 1.0)');
    ctx.fillStyle = bottomVignette;
    ctx.fillRect(0, H - 560, W, 560);

    // J. User Photo & Name (Prominent & Lowered)
    ctx.save();
    const locketRadius = 78;
    const badgeY = H - 310;
    const badgeX = showPhotoBadge ? 125 : 80;

    const nameBannerX = showPhotoBadge ? 220 : 60;
    const nameBannerY = badgeY - 50;
    const nameBannerW = showPhotoBadge ? 450 : 600;
    const nameBannerH = 100;

    ctx.fillStyle = 'rgba(20, 14, 10, 0.92)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.roundRect(nameBannerX, nameBannerY, nameBannerW, nameBannerH, 22);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = 'bold 16px "Noto Sans Devanagari", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('💐 प्रेषक / शुभचिंतक:', nameBannerX + 22, nameBannerY + 34);

    ctx.font = '900 32px "Noto Sans Devanagari", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(251, 191, 36, 0.85)';
    ctx.shadowBlur = 12;
    ctx.fillText(senderName, nameBannerX + 22, nameBannerY + 76);
    ctx.shadowBlur = 0;

    if (showPhotoBadge) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, locketRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, locketRadius - 3, 0, Math.PI * 2);
      ctx.clip();

      if (userImgRef.current && userImgRef.current.complete && userImgRef.current.naturalWidth > 0) {
        ctx.drawImage(
          userImgRef.current, 
          badgeX - locketRadius, 
          badgeY - locketRadius, 
          locketRadius * 2, 
          locketRadius * 2
        );
      } else {
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(badgeX - locketRadius, badgeY - locketRadius, locketRadius * 2, locketRadius * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PHOTO', badgeX, badgeY + 6);
      }
      ctx.restore();
    }
    ctx.restore();

    // K. Greeting Headline & Shloka Overlay
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '900 28px "Noto Sans Devanagari", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;
    ctx.fillText(greetingHeadline, W / 2, 85);

    // Shloka
    ctx.font = 'bold 16px "Noto Sans Devanagari", sans-serif';
    ctx.fillStyle = '#fde68a';
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let curY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, curY);
          line = words[n] + ' ';
          curY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, curY);
    };

    wrapText(selectedShloka, W / 2, 135, W - 60, 24);

    // Blessing Banner at bottom
    ctx.fillStyle = 'rgba(15, 10, 8, 0.88)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(40, H - 470, W - 80, 110, 18);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 18px "Noto Sans Devanagari", sans-serif';
    ctx.fillStyle = '#ffffff';
    wrapText(customBlessing, W / 2, H - 435, W - 110, 26);
    ctx.restore();

  }, [
    enableCameraMotion, 
    enableGodRays, 
    enableRotatingChakra, 
    enableAshirwadBeams, 
    enableDhunuchiSmoke, 
    enableSwingingBells, 
    enablePetals, 
    enableDiyas, 
    enableSparkles, 
    senderName, 
    showPhotoBadge, 
    greetingHeadline, 
    selectedShloka, 
    customBlessing
  ]);

  // Animation Frame Loop
  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      drawFrame(ctx, elapsed);
      animFrameRef.current = requestAnimationFrame(render);
    };
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, drawFrame]);

  // Photo Select Handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        if (result) {
          setUserPhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Export Video Handler (Canvas Stream Recording)
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isExporting) return;
    setIsExporting(true);
    setExportProgress(10);

    try {
      const stream = canvas.captureStream(30);
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 3800000
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        setExportProgress(95);
        const videoBlob = new Blob(chunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `Maa-Durga-3D-AI-Status-${senderName.replace(/[^a-zA-Z0-9]/g, '')}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsExporting(false);
        setExportProgress(100);
      };

      recorder.start();

      const totalDuration = 15;
      let currentSec = 0;
      const progressTimer = setInterval(() => {
        currentSec += 1;
        setExportProgress(Math.min(92, Math.floor((currentSec / totalDuration) * 92)));
        if (currentSec >= totalDuration) {
          clearInterval(progressTimer);
          recorder.stop();
        }
      }, 1000);
    } catch (err) {
      console.error('Video recording failed:', err);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Maa-Durga-3D-Status-${senderName}.jpg`;
      link.click();
      setIsExporting(false);
    }
  };

  // Instant Snapshot 8K Image Card Download
  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Maa-Durga-3D-PhotoCard-${senderName}.jpg`;
    link.click();
  };

  // Direct WhatsApp Share
  const handleWhatsAppStatusShare = () => {
    setIsShared(true);
    const shareText = `🌺 *${videoItem.title}* 🌺\n\n"${selectedShloka}"\n\n— *${senderName}* की ओर से पावन नवरात्रि की हार्दिक शुभकामनाएँ ✨\n\n👇 अपने नाम, बड़ी फोटो व 3D AI वीडियो स्टेटस यहाँ बनाएँ:\nhttps://www.shubhakamna.in/video-status/?v=${videoItem.id}`;
    openWhatsAppUniversal(shareText);
    setTimeout(() => setIsShared(false), 3000);
  };

  // Copy Magic Link
  const handleCopyLink = () => {
    const magicUrl = `https://www.shubhakamna.in/video-status/?v=${videoItem.id}&name=${encodeURIComponent(senderName)}`;
    navigator.clipboard.writeText(magicUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-6">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-500/20">
        <button
          onClick={onSelectAnotherVideo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs sm:text-sm font-semibold transition border border-amber-500/30 cursor-pointer"
        >
          <span>← सभी वीडियो देखें</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs bg-red-950/80 text-rose-300 font-bold px-3 py-1 rounded-full border border-red-500/40">
            {videoItem.number}/50 • {videoItem.avatarOrScene}
          </span>
        </div>
      </div>

      {/* Main Studio Grid: 9:16 Video Player + Control Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================ */}
        {/* 9:16 ASPECT RATIO VIDEO CANVAS VIEWPORT                      */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 flex flex-col items-center">
          
          <div className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl shadow-amber-950/80 border-4 border-amber-500/70 bg-stone-950 ring-2 ring-amber-400/30 group">
            
            {/* Live 9:16 Canvas (Native 720x1280) */}
            <canvas
              ref={canvasRef}
              width={720}
              height={1280}
              className="w-full h-full object-cover block"
            />

            {/* Top Right Live AI Tag */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-yellow-300/40">
              <Sparkles className="w-3 h-3 text-yellow-200 animate-spin" />
              <span>3D AI VIDEO</span>
            </div>

            {/* Center Play/Pause Touch Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title={isPlaying ? 'वीडियो पॉज़ करें' : 'वीडियो चलाएँ'}
            >
              <div className="w-16 h-16 rounded-full bg-stone-900/90 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-2xl backdrop-blur-md transform scale-90 group-hover:scale-100 transition">
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </div>
            </button>

            {/* Floating Control Bar on Video */}
            <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between gap-2 bg-stone-950/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-amber-500/40">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:text-white cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'चालू' : 'पॉज़'}</span>
              </button>
            </div>

          </div>

          {/* Action Buttons Under The Video */}
          <div className="w-full max-w-[360px] mt-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleExportVideo}
                disabled={isExporting}
                className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                    <span>डाउनलोडिंग... {exportProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-stone-950" />
                    <span>9:16 AI वीडियो डाउनलोड</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsAppStatusShare}
                className="py-3 px-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1 shadow-xl shadow-emerald-900/40 transition cursor-pointer active:scale-95"
                title="व्हाट्सएप स्टेटस पर शेयर करें"
              >
                <Share2 className="w-4 h-4" />
                <span>{isShared ? 'शेयर हुआ!' : 'WhatsApp'}</span>
              </button>
            </div>

            {/* Instant Snapshot 8K Card Option */}
            <button
              onClick={handleDownloadSnapshot}
              className="w-full py-2 px-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>तुरंत 8K HD फोटो कार्ड भी सेव करें (बिना प्रतीक्षा के)</span>
            </button>
          </div>

        </div>

        {/* ============================================================ */}
        {/* CUSTOMIZATION CONTROLS (BADA PHOTO, NAME, FX)                */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Card 1: BADA PHOTO & NAME CONTROLS */}
          <div className="bg-stone-900/90 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span>१. अपना बड़ा फोटो व नाम जोड़ें (VIP Devotee Badge)</span>
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                बड़ा आकार
              </span>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs text-stone-300 font-medium mb-1.5">
                वीडियो में प्रदर्शित होने वाला बड़ा नाम:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => {
                    setSenderName(e.target.value);
                    localStorage.setItem('shubhakamna_my_name', e.target.value);
                  }}
                  placeholder="अपना नाम लिखें (उदा. दिनेश शर्मा)"
                  maxLength={30}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
                />
                <span className="absolute right-3 top-2.5 text-xs text-amber-400 font-bold">✍️</span>
              </div>
            </div>

            {/* Photo Upload Area */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/50 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>{userPhoto ? 'अपनी फोटो बदलें (बड़ा लॉकेट) 📸' : 'अपनी फोटो अपलोड करें 📷'}</span>
              </button>

              {userPhoto && (
                <button
                  type="button"
                  onClick={() => setUserPhoto(null)}
                  className="py-2.5 px-3 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold transition cursor-pointer"
                  title="फोटो हटाएँ"
                >
                  हटाएँ
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowPhotoBadge(!showPhotoBadge)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  showPhotoBadge 
                    ? 'bg-amber-500/25 text-amber-300 border-amber-400' 
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                {showPhotoBadge ? 'फोटो फ्रेम चालू' : 'फोटो फ्रेम बंद'}
              </button>
            </div>
          </div>

          {/* Card 2: AI ANIMATION EFFECTS */}
          <div className="bg-stone-900/90 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>२. 3D AI एनिमेशन लेयर्स (सिर्फ फोटो नहीं, सजीव वीडियो)</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-bold">रियल एनिमेशन</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEnableCameraMotion(!enableCameraMotion)}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                  enableCameraMotion ? 'bg-amber-950/80 border-amber-400 text-amber-300' : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}
              >
                <span>🎥 3D कैमरा ज़ूम</span>
                {enableCameraMotion && <span>✓</span>}
              </button>

              <button
                type="button"
                onClick={() => setEnableRotatingChakra(!enableRotatingChakra)}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                  enableRotatingChakra ? 'bg-amber-950/80 border-amber-400 text-amber-300' : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}
              >
                <span>☸️ 3D घूमता चक्र</span>
                {enableRotatingChakra && <span>✓</span>}
              </button>

              <button
                type="button"
                onClick={() => setEnableAshirwadBeams(!enableAshirwadBeams)}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                  enableAshirwadBeams ? 'bg-amber-950/80 border-amber-400 text-amber-300' : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}
              >
                <span>✋ आशीर्वाद तरंगें</span>
                {enableAshirwadBeams && <span>✓</span>}
              </button>

              <button
                type="button"
                onClick={() => setEnableGodRays(!enableGodRays)}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                  enableGodRays ? 'bg-amber-950/80 border-amber-400 text-amber-300' : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}
              >
                <span>☀️ दिव्य सूर्य किरणें</span>
                {enableGodRays && <span>✓</span>}
              </button>

              <button
                type="button"
                onClick={() => setEnableSwingingBells(!enableSwingingBells)}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                  enableSwingingBells ? 'bg-amber-950/80 border-amber-400 text-amber-300' : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}
              >
                <span>🔔 झूलती घंटियां</span>
                {enableSwingingBells && <span>✓</span>}
              </button>

              <button
                type="button"
                onClick={() => setEnableDhunuchiSmoke(!enableDhunuchiSmoke)}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                  enableDhunuchiSmoke ? 'bg-amber-950/80 border-amber-400 text-amber-300' : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}
              >
                <span>💨 धुनुची धूप धुंध</span>
                {enableDhunuchiSmoke && <span>✓</span>}
              </button>

              <button
                type="button"
                onClick={() => setEnablePetals(!enablePetals)}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                  enablePetals ? 'bg-rose-950/80 border-rose-400 text-rose-300' : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}
              >
                <span>🌸 पुष्प वर्षा</span>
                {enablePetals && <span>✓</span>}
              </button>

              <button
                type="button"
                onClick={() => setEnableDiyas(!enableDiyas)}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                  enableDiyas ? 'bg-amber-950/80 border-amber-400 text-amber-300' : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}
              >
                <span>🪔 तैरते दीपक</span>
                {enableDiyas && <span>✓</span>}
              </button>

              <button
                type="button"
                onClick={() => setEnableSparkles(!enableSparkles)}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                  enableSparkles ? 'bg-yellow-950/80 border-yellow-400 text-yellow-300' : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}
              >
                <span>✨ स्वर्ण कण</span>
                {enableSparkles && <span>✓</span>}
              </button>
            </div>
          </div>

          {/* Card 3: SHUBHKAAMNA & SHLOKA CONTROLS */}
          <div className="bg-stone-900/90 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>३. पावन शुभकामना व शक्ति मंत्र (सुस्पष्ट व सुंदर टेक्स्ट)</span>
            </h3>

            {/* Quick Shloka Chips */}
            <div>
              <label className="block text-xs text-stone-300 font-medium mb-1.5">
                पावन शक्ति मंत्र चुनें:
              </label>
              <div className="space-y-1.5">
                {[
                  'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥',
                  'या देवी सर्वभूतेषु शक्ति-रूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥',
                  'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे ॥ जय माता दी',
                  'दुर्गे स्मृता हरसि भीतिमशेषजन्तोः स्वस्थैः स्मृता मतिमतीव शुभां ददासि ॥'
                ].map((sh, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedShloka(sh)}
                    className={`w-full text-left p-2 rounded-xl text-xs transition cursor-pointer border ${
                      selectedShloka === sh
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-amber-500/30'
                    }`}
                  >
                    {sh}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Blessing Input */}
            <div>
              <label className="block text-xs text-stone-300 font-medium mb-1">
                आशीर्वाद संदेश बदलें:
              </label>
              <input
                type="text"
                value={customBlessing}
                onChange={(e) => setCustomBlessing(e.target.value)}
                maxLength={90}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          {/* Card 4: SHARE & MAGIC LINK */}
          <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <p className="text-xs font-bold text-amber-300">
                🔗 अपने नाम का जादुई 3D लिंक दोस्तों को भेजें
              </p>
              <p className="text-[11px] text-stone-300">
                वे भी तुरंत अपना नाम व फोटो जोड़कर यह वीडियो स्टेटस बना सकेंगे!
              </p>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/50 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'लिंक कॉपी हुआ!' : 'लिंक कॉपी करें'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
