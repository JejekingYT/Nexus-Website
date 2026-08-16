"use client";

import { useEffect, useRef } from "react";


export default function AnimatedBackground() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  useEffect(() => {

    const canvasElement = canvasRef.current;

    if (!canvasElement) return;

    const canvas: HTMLCanvasElement = canvasElement;


    const context = canvas.getContext("2d");

    if (!context) return;

    const ctx: CanvasRenderingContext2D = context;


    let animationFrame: number;


    const particles = Array.from(
      { length: 70 },
      () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,

        size: Math.random() * 2 + 1,

        speedX:
          (Math.random() - 0.5) * 0.35,

        speedY:
          (Math.random() - 0.5) * 0.35,
      })
    );



    function resize() {

      const dpr =
        window.devicePixelRatio || 1;


      canvas.width =
        window.innerWidth * dpr;

      canvas.height =
        window.innerHeight * dpr;


      canvas.style.width =
        `${window.innerWidth}px`;

      canvas.style.height =
        `${window.innerHeight}px`;


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



      particles.forEach((particle, index) => {


        particle.x += particle.speedX;
        particle.y += particle.speedY;



        if (
          particle.x < 0 ||
          particle.x > window.innerWidth
        ) {
          particle.speedX *= -1;
        }


        if (
          particle.y < 0 ||
          particle.y > window.innerHeight
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


        const gradient =
          ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            10
          );


        gradient.addColorStop(
          0,
          "rgba(168,85,247,0.9)"
        );


        gradient.addColorStop(
          1,
          "rgba(59,130,246,0)"
        );


        ctx.fillStyle = gradient;

        ctx.fill();




        particles
          .slice(index + 1)
          .forEach((other) => {

            const distance =
              Math.sqrt(
                Math.pow(
                  particle.x - other.x,
                  2
                ) +
                Math.pow(
                  particle.y - other.y,
                  2
                )
              );


            if (distance < 120) {

              ctx.beginPath();


              ctx.moveTo(
                particle.x,
                particle.y
              );


              ctx.lineTo(
                other.x,
                other.y
              );


              ctx.strokeStyle =
                `rgba(139,92,246,${
                  0.15 -
                  distance / 900
                })`;


              ctx.lineWidth = 1;


              ctx.stroke();

            }

          });


      });



      animationFrame =
        requestAnimationFrame(
          animate
        );

    }




    resize();


    window.addEventListener(
      "resize",
      resize
    );


    animate();



    return () => {

      cancelAnimationFrame(
        animationFrame
      );


      window.removeEventListener(
        "resize",
        resize
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