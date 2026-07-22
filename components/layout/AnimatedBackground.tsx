"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (!canvasElement) return;

    const context = canvasElement.getContext("2d");

    if (!context) return;


    const canvas: HTMLCanvasElement = canvasElement;
    const ctx: CanvasRenderingContext2D = context;


    let animationFrame: number;


    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    }));


    function resizeCanvas() {

      const dpr = window.devicePixelRatio || 1;


      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;


      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;


      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

    }



    function animate() {

      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );


      particles.forEach((particle) => {

        particle.x += particle.speedX;
        particle.y += particle.speedY;


        if (
          particle.x <= 0 ||
          particle.x >= window.innerWidth
        ) {
          particle.speedX *= -1;
        }


        if (
          particle.y <= 0 ||
          particle.y >= window.innerHeight
        ) {
          particle.speedY *= -1;
        }


        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );


        ctx.fillStyle =
          "rgba(168,85,247,0.65)";


        ctx.fill();

      });


      animationFrame = requestAnimationFrame(
        animate
      );

    }



    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );


    animate();



    return () => {

      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "resize",
        resizeCanvas
      );

    };


  }, []);



  return (
    <canvas
      ref={canvasRef}
      className="
        fixed
        inset-0
        w-full
        h-full
        pointer-events-none
        z-0
      "
    />
  );
}