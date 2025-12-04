"use client";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
const heroImages = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg"
];
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [headingTransform, setHeadingTransform] = useState("translate(-50%, -50%)");
  const [overlayOpacity, setOverlayOpacity] = useState(0.3);
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Scale down from 1 to 0.7 as you scroll 0-400px
      const newScale = Math.max(0.7, 1 - scrollY / 1000);
      setScale(newScale);
      // Parallax heading: move up as you scroll
      const headingY = Math.max(-50, -50 - scrollY / 10);
      setHeadingTransform(`translate(-50%, ${headingY}%)`);
      // Overlay opacity increases as you scroll
      setOverlayOpacity(Math.min(0.7, 0.3 + scrollY / 1000));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
        setFade(true);
      }, 1000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="overflow-x-hidden w-100vw">
      <div
        ref={heroRef}
        className="relative h-screen flex items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transition: "transform 1s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <img
          src={heroImages[currentImage]}
          alt="Hero Slideshow"
          className={`absolute top-0 left-0 w-screen max-w-full h-screen object-cover select-none pointer-events-none transition-opacity duration-500 ease-out ${fade ? 'opacity-300' : 'opacity-0'}`}
          draggable={false}
        />
        {/* Overlay for parallax effect */}
        <div
          className="absolute top-0 left-0 w-screen max-w-full h-screen pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,) 0%, rgba(255,255,255,1 ) 100%)",
            opacity: overlayOpacity,
            zIndex: 1,
            transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <h1
          className="absolute text-white text-5xl md:text-7xl font-bold z-20 text-center w-full drop-shadow-lg"
          style={{
            left: "50%",
            top: "50%",
            transform: headingTransform,
            textShadow: "0 2px 16px rgba(0,0,0,0.7)",
            transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="flex flex-col text-shadow-none text-8xl">
            NEXT <span className="text-orange-500">MARINER</span>
            </div>
        </h1>
      </div>
      {/* Revealed content section */}
      <section
        className="transition-all duration-700"
        style={{
          opacity: 0,
          transform: "translateY(40px)",
        }}
        id="reveal-content"
      >
        <div
          className="max-w-2xl mx-auto my-10 p-8 bg-white/95 rounded-2xl shadow-lg text-center"
        >
          <h2 className="text-3xl font-semibold mb-4">Scroll Reveal Content</h2>
          <p className="text-lg text-zinc-700">
            This content appears as you scroll past the hero section. You can add more details, features, or calls to action here.
          </p>
        </div>
      </section>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('scroll', function() {
            var section = document.getElementById('reveal-content');
            if (!section) return;
            var trigger = window.innerHeight * 0.7;
            var top = section.getBoundingClientRect().top;
            if (top < trigger) {
              section.style.opacity = 1;
              section.style.transform = 'translateY(0)';
            } else {
              section.style.opacity = 0;
              section.style.transform = 'translateY(40px)';
            }
          });
        `
      }} />
    </main>
  );
}
