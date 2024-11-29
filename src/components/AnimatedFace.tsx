'use client'

import { motion } from "framer-motion";
import React from "react";

interface AnimatedBearProps {
  isPasswordField: boolean;
  inputValue: string;
  focused: boolean;
}

const AnimatedBear: React.FC<AnimatedBearProps> = ({
  isPasswordField,
  inputValue,
  focused,
}) => {
  // Configuración para el movimiento circular
  const maxRadius = 5; // Máximo desplazamiento en píxeles dentro del área blanca
  const angleStep = 10; // Incremento del ángulo por carácter ingresado

  // Posiciones base de los ojos
  const leftEyeX = 80;
  const rightEyeX = 120;
  const eyeY = 95;
  const pupilRadius = 8; // Radio de la pupila

  // Calcular posición circular para las pupilas
  const angle = 360 - (inputValue.length * angleStep) % 360; // Ángulo inverso basado en el input
  const radians = (Math.PI / 360) * angle;
  const offsetX = Math.cos(radians) * maxRadius;
  const offsetY = Math.sin(radians) * maxRadius;

  return (
    <motion.svg width="200" height="200" viewBox="0 0 200 200" initial={false}>
      {/* Orejas */}
      <circle cx="60" cy="60" r="20" fill="#8B4513" />
      <circle cx="140" cy="60" r="20" fill="#8B4513" />

      {/* Cara */}
      <circle cx="100" cy="100" r="70" fill="#D2691E" />

      {/* Hocico */}
      <circle cx="100" cy="120" r="20" fill="#F4A460" />
      <ellipse cx="100" cy="130" rx="15" ry="10" fill="#8B4513" />

      {/* Ojos */}
      <g>
        {/* Ojo Izquierdo */}
        <motion.g
          animate={{
            scaleY: isPasswordField ? 0.1 : 1, // Simula cerrar el ojo
          }}
          transition={{
            duration: 0.5, // Más lento para un cierre natural
          }}
        >
          <circle cx={leftEyeX} cy={eyeY} r="15" fill="white" />
          {!isPasswordField && (
            <motion.circle
              cx={leftEyeX + offsetX}
              cy={eyeY + (focused ? offsetY : 0)} // Solo mira hacia abajo si está enfocado
              r={pupilRadius}
              fill="black"
              animate={{
                cx: leftEyeX + offsetX,
                cy: eyeY + (focused ? offsetY : 0),
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
            />
          )}
        </motion.g>

        {/* Ojo Derecho */}
        <motion.g
          animate={{
            scaleY: isPasswordField ? 0.1 : 1, // Simula cerrar el ojo
          }}
          transition={{
            duration: 0.6, // Más lento para un cierre natural
          }}
        >
          <circle cx={rightEyeX} cy={eyeY} r="15" fill="white" />
          {!isPasswordField && (
            <motion.circle
              cx={rightEyeX + offsetX}
              cy={eyeY + (focused ? offsetY : 0)} // Solo mira hacia abajo si está enfocado
              r={pupilRadius}
              fill="black"
              animate={{
                cx: rightEyeX + offsetX,
                cy: eyeY + (focused ? offsetY : 0),
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
            />
          )}
        </motion.g>
      </g>

      {/* Sonrisa */}
      <motion.path
        d="M85,160 Q100,155 115,150" // Bajamos la sonrisa 5 unidades más en el eje Y
        fill="none"
        stroke="#8B4513"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{
          d: focused
            ? "M85,145 Q100,160 115,145" // Más curva cuando está enfocado
            : "M85,145 Q100,155 115,145", // Sonrisa más neutral
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
        }}
      />
    </motion.svg>
  );
};

export default AnimatedBear;
