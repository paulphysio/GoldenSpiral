'use client';

import { useEffect, useRef } from 'react';
import './ResumeSpiral.css';
import Header from './sections/Header';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Education from './sections/Education';
import Projects from './sections/Projects';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';

const ResumeSpiral = () => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const animationFrameRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const spiralWidth = 6.3;
  const spiralHeight = 3.9;
  const cycleLength = 7;

  const resumeSections = [
    { centerX: 1.95, centerY: 1.95, side: 3.9, rotation: 0, label: 'Header', color: '#1C2526', component: Header },
    { centerX: 5.1, centerY: 2.7, side: 2.4, rotation: Math.PI / 2, label: 'Experience', color: '#2E3532', component: Experience },
    { centerX: 5.55, centerY: 0.75, side: 1.5, rotation: Math.PI, label: 'Skills', color: '#3A403D', component: Skills },
    { centerX: 4.35, centerY: 0.45, side: 0.9, rotation: 3 * Math.PI / 2, label: 'Education', color: '#464C49', component: Education },
    { centerX: 4.2, centerY: 1.2, side: 0.6, rotation: 0, label: 'Projects', color: '#525855', component: Projects },
    { centerX: 4.65, centerY: 1.35, side: 0.3, rotation: Math.PI / 2, label: 'Certifications', color: '#5E645F', component: Certifications },
    { centerX: 4.65, centerY: 1.05, side: 0.3, rotation: Math.PI, label: 'Contact', color: '#6A706B', component: Contact },
  ];

  const drawSpiral = (scrollOffset, isOverlay = false) => {
    const canvas = isOverlay ? overlayRef.current : canvasRef.current;
    const ctx = canvas.getContext('2d');

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = spiralWidth / spiralHeight;

    let canvasWidth, canvasHeight;
    if (viewportWidth / viewportHeight > aspectRatio) {
      canvasHeight = viewportHeight;
      canvasWidth = canvasHeight * aspectRatio;
    } else {
      canvasWidth = viewportWidth;
      canvasHeight = canvasWidth / aspectRatio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const scale = canvasWidth / spiralWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const progress = scrollOffset % 1;
    const shift = Math.floor(scrollOffset);

    if (isOverlay) {
      const largestIndex = shift;
      const section = resumeSections[largestIndex];

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, section.color);
      gradient.addColorStop(1, '#121212');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = -canvas.height; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + canvas.height, canvas.height);
        ctx.stroke();
      }

      section.component(ctx, canvas.width, canvas.height, viewportWidth);
    } else {
      const rotationIncrement = -Math.PI / 2 * progress;
      const squares = resumeSections.map((square, index) => {
        const sourceIndex = (index - shift + cycleLength) % cycleLength;
        const targetIndex = (sourceIndex - 1 + cycleLength) % cycleLength;

        const currentSquare = resumeSections[sourceIndex];
        const nextSquare = resumeSections[targetIndex];

        const interpolatedCenterX = currentSquare.centerX + progress * (nextSquare.centerX - currentSquare.centerX);
        const interpolatedCenterY = currentSquare.centerY + progress * (nextSquare.centerY - currentSquare.centerY);
        const interpolatedSide = currentSquare.side + progress * (nextSquare.side - currentSquare.side);
        const halfSide = interpolatedSide / 2;

        return {
          x1: interpolatedCenterX - halfSide,
          y1: interpolatedCenterY - halfSide,
          x2: interpolatedCenterX + halfSide,
          y2: interpolatedCenterY + halfSide,
          rotation: currentSquare.rotation + rotationIncrement,
          label: square.label,
          color: square.color,
        };
      });

      squares.forEach(square => {
        ctx.save();
        const boxCenterX = (square.x1 + square.x2) / 2 * scale;
        const boxCenterY = (spiralHeight - (square.y1 + square.y2) / 2) * scale;
        ctx.translate(boxCenterX, boxCenterY);
        ctx.rotate(square.rotation);
        ctx.translate(-boxCenterX, -boxCenterY);

        ctx.beginPath();
        ctx.rect(
          square.x1 * scale,
          (spiralHeight - square.y2) * scale,
          (square.x2 - square.x1) * scale,
          (square.y2 - square.y1) * scale
        );
        ctx.fillStyle = square.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = `${Math.min(scale / 5, viewportWidth < 768 ? 16 : 20)}px "Helvetica Neue"`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(square.label, boxCenterX, boxCenterY);

        ctx.restore();
      });
    }
  };

  const animateRotation = (direction) => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const startOffset = scrollOffsetRef.current;
    const maxOffset = cycleLength - 1;
    const targetOffset = direction === 'down'
      ? Math.min(startOffset + 1, maxOffset)
      : Math.max(startOffset - 1, 0);

    if (startOffset === targetOffset) {
      isAnimatingRef.current = false;
      return;
    }

    const startTime = performance.now();
    const duration = 1200;

    const overlayCanvas = overlayRef.current;
    overlayCanvas.classList.remove('visible', 'glitch', 'fade-in', 'glow');

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      scrollOffsetRef.current = startOffset + (targetOffset - startOffset) * easeProgress;
      drawSpiral(scrollOffsetRef.current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        scrollOffsetRef.current = targetOffset;
        drawSpiral(scrollOffsetRef.current);
        drawSpiral(scrollOffsetRef.current, true);
        overlayCanvas.classList.add('visible', 'glitch', 'fade-in', 'glow');
        isAnimatingRef.current = false;
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleScroll = (event) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 'down' : 'up';
    animateRotation(direction);
  };

  useEffect(() => {
    drawSpiral(0);
    drawSpiral(0, true);
    overlayRef.current.classList.add('visible', 'glitch', 'fade-in', 'glow');
    window.addEventListener('wheel', handleScroll, { passive: false });

    const resizeHandler = () => {
      drawSpiral(scrollOffsetRef.current);
      drawSpiral(scrollOffsetRef.current, true);
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          background: '#121212',
        }}
      />
      <canvas
        ref={overlayRef}
        className="overlay-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default ResumeSpiral;