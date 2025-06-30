import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.png";

interface VisualPanelProps {
  title: string;
  subtitle: string;
}

const VisualPanel: React.FC<VisualPanelProps> = ({ title, subtitle }) => {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    // Generate floating particles
    const particleArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div className="relative flex-1 bg-toivo-cosmic overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-toivo-glow opacity-60" />

      {/* Animated particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-toivo-purple-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main visual content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-12 text-center">
        {/* Logo only */}
        <div className="relative mb-12">
          <img
            src={Logo}
            alt="Toivo Logo"
            className="w-32 h-32 object-contain animate-float"
          />

          {/* Floating elements around the logo */}
          <div
            className="absolute -top-4 -right-4 w-8 h-8 bg-toivo-violet-400 rounded-full opacity-60 animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute -bottom-8 -left-8 w-6 h-6 bg-toivo-purple-300 rounded-full opacity-40 animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 -right-12 w-4 h-4 bg-white rounded-full opacity-80 animate-float"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Text content */}
        <div className="space-y-6 max-w-md animate-fade-in">
          <h1 className="text-4xl font-bold text-white font-jakarta leading-tight">
            {title}
          </h1>
          <p className="text-lg text-gray-300 font-inter leading-relaxed">
            {subtitle}
          </p>

          {/* Decorative quote */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-400 font-inter italic">
              "A produtividade floresce quando encontra propósito"
            </p>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-toivo-purple-400 rounded-full opacity-50 animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </div>
      </div>

      {/* Subtle mesh overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-br from-white via-transparent to-toivo-purple-500" />
      </div>
    </div>
  );
};

export default VisualPanel;
