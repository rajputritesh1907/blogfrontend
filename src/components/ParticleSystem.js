'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ParticleSystem() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles only on client side
    const newParticles = [...Array(30)].map((_, i) => ({
      id: i,
      size: Math.random() > 0.5 ? 'w-1 h-1' : 'w-2 h-2',
      background: `linear-gradient(45deg, ${Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(168, 85, 247, 0.3)'}, ${Math.random() > 0.5 ? 'rgba(236, 72, 153, 0.2)' : 'rgba(34, 197, 94, 0.2)'})`,
      initialX: Math.random() * 1200,
      initialY: Math.random() * 800,
      animateX: Math.random() * 50 - 25,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3,
    }));

    setParticles(newParticles);
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.size} rounded-full`}
          style={{
            background: particle.background,
            boxShadow: '0 0 10px rgba(255,255,255,0.1)'
          }}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            opacity: 0,
            scale: 0
          }}
          animate={{
            y: [null, -100, null],
            x: [null, particle.animateX, null],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </>
  );
}
