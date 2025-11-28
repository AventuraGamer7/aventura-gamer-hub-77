import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, Trophy, Crown } from 'lucide-react';

interface PowerUpAnimationProps {
  type: 'points' | 'levelUp';
  value: number;
  onComplete?: () => void;
}

const PowerUpAnimation = ({ type, value, onComplete }: PowerUpAnimationProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const isLevelUp = type === 'levelUp';
  const Icon = isLevelUp ? Crown : Zap;
  const color = isLevelUp ? 'from-led-yellow via-led-orange to-led-pink' : 'from-led-cyan via-led-blue to-led-violet';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background overlay with particles */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm">
            {/* Animated particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-led-cyan to-led-violet"
                initial={{
                  x: '50vw',
                  y: '50vh',
                  scale: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Main power-up animation */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            {/* Outer glow ring */}
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${color} blur-3xl`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Main content */}
            <div className="relative bg-background/90 backdrop-blur-xl rounded-3xl p-12 border-4 border-primary shadow-2xl">
              {/* Icon */}
              <motion.div
                className={`mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Icon className="w-12 h-12 text-white" />
              </motion.div>

              {/* Text */}
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isLevelUp ? (
                  <>
                    <h2 className="text-5xl font-bold font-mario text-mario animate-pulse">
                      ¡NIVEL {value}!
                    </h2>
                    <p className="text-2xl text-led-cyan font-semibold">
                      🎮 ¡Subiste de nivel! 🎮
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-6xl font-bold text-neon">
                      +{value} XP
                    </h2>
                    <p className="text-xl text-led-green font-semibold flex items-center justify-center gap-2">
                      <Star className="w-6 h-6" />
                      ¡Puntos ganados!
                      <Star className="w-6 h-6" />
                    </p>
                  </>
                )}
              </motion.div>

              {/* Bottom stars */}
              <motion.div
                className="flex justify-center gap-4 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  >
                    <Star className="w-6 h-6 text-led-yellow fill-led-yellow" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom text */}
          <motion.div
            className="absolute bottom-20 left-0 right-0 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-xl font-orbitron text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
              {isLevelUp ? '¡Sigue conquistando el gaming!' : '¡Gracias por tu compra, aventurero!'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PowerUpAnimation;
