// app/components/GoldenSpiral.js
'use client';

import { useEffect, useRef } from 'react';

const GoldenSpiral = () => {
  const canvasRef = useRef(null);
  const scrollOffsetRef = useRef(0); // Continuous scroll offset

  const drawSpiral = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Define the spiral's intrinsic dimensions
    const spiralWidth = 6.3;
    const spiralHeight = 3.9;
    const aspectRatio = spiralWidth / spiralHeight;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth * 0.9;
    const viewportHeight = window.innerHeight * 0.9;

    // Calculate canvas size
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

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Base squares with initial positions and rotations (unchanged boxes, fixed spiral)
    const baseSquares = [
      { x1: 0, y1: 0, x2: 3.9, y2: 3.9, centerX: 3.9, centerY: 0, radius: 3.9, startAngle: Math.PI, endAngle: 3 * Math.PI / 2, rotation: 0, label: 'F(7)' }, // Normal (0°)
      { x1: 3.9, y1: 1.5, x2: 6.3, y2: 3.9, centerX: 6.3, centerY: 1.5, radius: 2.4, startAngle: 3 * Math.PI / 2, endAngle: 0, rotation: Math.PI / 2, label: 'F(6)' }, // Right (90°)
      { x1: 4.8, y1: 0, x2: 6.3, y2: 1.5, centerX: 4.8, centerY: 1.5, radius: 1.5, startAngle: 0, endAngle: Math.PI / 2, rotation: Math.PI, label: 'F(5)' }, // Down (180°)
      { x1: 3.9, y1: 0.9, x2: 4.8, y2: 0, centerX: 4.8, centerY: 0.9, radius: 0.9, startAngle: Math.PI / 2, endAngle: Math.PI, rotation: 3 * Math.PI / 2, label: 'F(4)' }, // Left (270°)
      { x1: 3.9, y1: 1.5, x2: 4.5, y2: 0.9, centerX: 4.5, centerY: 0.9, radius: 0.6, startAngle: Math.PI, endAngle: 3 * Math.PI / 2, rotation: 0, label: 'F(3)' }, // Normal (0°)
      { x1: 4.5, y1: 1.2, x2: 4.8, y2: 1.5, centerX: 4.5, centerY: 1.2, radius: 0.3, startAngle: 3 * Math.PI / 2, endAngle: 0, rotation: Math.PI / 2, label: 'F(2)' }, // Right (90°)
      { x1: 4.8, y1: 0.9, x2: 4.5, y2: 1.2, centerX: 4.5, centerY: 1.2, radius: 0.3, startAngle: 0, endAngle: Math.PI / 2, rotation: Math.PI, label: 'F(1)' }, // Down (180°)
    ];

    // Scroll offset drives rotation and scaling
    const scrollOffset = scrollOffsetRef.current;
    const cycleLength = baseSquares.length; // 7 squares
    const progress = scrollOffset % 1; // Fractional part for interpolation
    const shift = Math.floor(scrollOffset); // Integer part for cycling
    const rotationIncrement = -Math.PI / 2 * progress; // Counterclockwise 90° per cycle (negative)

    // Interpolated squares with rotation and scaling
    const squares = baseSquares.map((square, index) => {
      const sourceIndex = (index - shift + cycleLength) % cycleLength;
      const targetIndex = (sourceIndex - 1 + cycleLength) % cycleLength;

      const currentSquare = baseSquares[sourceIndex];
      const nextSquare = baseSquares[targetIndex];

      // Interpolate position, size, and rotation
      const interpolated = {
        x1: currentSquare.x1 + progress * (nextSquare.x1 - currentSquare.x1),
        y1: currentSquare.y1 + progress * (nextSquare.y1 - currentSquare.y1),
        x2: currentSquare.x2 + progress * (nextSquare.x2 - currentSquare.x2),
        y2: currentSquare.y2 + progress * (nextSquare.y2 - currentSquare.y2),
        centerX: currentSquare.centerX + progress * (nextSquare.centerX - currentSquare.centerX),
        centerY: currentSquare.centerY + progress * (nextSquare.centerY - currentSquare.centerY),
        radius: currentSquare.radius + progress * (nextSquare.radius - currentSquare.radius),
        startAngle: currentSquare.startAngle,
        endAngle: currentSquare.endAngle,
        rotation: currentSquare.rotation + rotationIncrement, // Rotate counterclockwise to match next
        label: square.label,
      };

      return interpolated;
    });

    // Draw the squares
    squares.forEach(square => {
      ctx.save();
      const squareCenterX = square.centerX * scale;
      const squareCenterY = (spiralHeight - square.centerY) * scale;
      ctx.translate(squareCenterX, squareCenterY);
      ctx.rotate(square.rotation);
      ctx.translate(-squareCenterX, -squareCenterY);

      ctx.beginPath();
      ctx.rect(
        square.x1 * scale,
        (spiralHeight - square.y2) * scale,
        (square.x2 - square.x1) * scale,
        (square.y2 - square.y1) * scale
      );
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // Draw label
      const labelX = (square.x1 + square.x2) / 2 * scale;
      const labelY = (spiralHeight - (square.y1 + square.y2) / 2) * scale;
      ctx.font = `${Math.min(scale / 5, 20)}px Arial`;
      ctx.fillStyle = 'blue';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(square.label, labelX, labelY);

      ctx.restore();
    });

    // Draw the arcs to form a continuous spiral
    squares.forEach(square => {
      ctx.beginPath();
      ctx.arc(
        square.centerX * scale,
        (spiralHeight - square.centerY) * scale,
        square.radius * scale,
        square.startAngle,
        square.endAngle,
        false
      );
      ctx.strokeStyle = 'red';
      ctx.stroke();
    });

    // Draw the outer bounding rectangle
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.stroke();
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollOffsetRef.current = scrollTop / (docHeight / 7); // One cycle per "screen"
    drawSpiral();
  };

  useEffect(() => {
    drawSpiral(); // Initial draw

    window.addEventListener('resize', drawSpiral);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', drawSpiral);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '1000vh' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid black', position: 'fixed', top: '5%', left: '5%' }} />
    </div>
  );
};

export default GoldenSpiral;