import React from 'react';
import { cn } from '@/lib/utils';

// Composant d'animation de chargement façon Apple
// Affiche des carrés animés avec une ligne de progression qui charge en boucle
interface AppleLoadingAnimationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AppleLoadingAnimation({ 
  className, 
  size = 'md' 
}: AppleLoadingAnimationProps) {
  // Configuration des tailles selon la prop size
  const sizeConfig = {
    sm: { container: 'w-16 h-16', square: 'w-2 h-2', line: 'h-0.5' },
    md: { container: 'w-24 h-24', square: 'w-3 h-3', line: 'h-1' },
    lg: { container: 'w-32 h-32', square: 'w-4 h-4', line: 'h-1.5' }
  };

  const config = sizeConfig[size];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4",
      className
    )}>
      {/* Conteneur principal pour les carrés animés */}
      <div className={cn(
        "relative flex items-center justify-center",
        config.container
      )}>
        {/* Grille de 9 carrés (3x3) avec animations décalées */}
        {Array.from({ length: 9 }).map((_, index) => {
          // Calcul de la position en grille 3x3
          const row = Math.floor(index / 3);
          const col = index % 3;
          
          // Délai d'animation basé sur la position (effet vague)
          const delay = (row + col) * 0.1;
          
          return (
            <div
              key={index}
              className={cn(
                "absolute bg-gray-400 dark:bg-gray-600 rounded-sm animate-pulse",
                config.square
              )}
              style={{
                // Position calculée pour former une grille 3x3
                left: `${col * 33.33}%`,
                top: `${row * 33.33}%`,
                // Animation avec délai décalé pour chaque carré
                animationDelay: `${delay}s`,
                animationDuration: '1.5s',
                animationIterationCount: 'infinite',
                // Variation d'opacité pour l'effet de pulsation
                animationName: 'apple-square-pulse'
              }}
            />
          );
        })}
      </div>

      {/* Ligne de progression qui charge en boucle */}
      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={cn(
            "bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-1000 ease-in-out",
            config.line,
            "animate-apple-loading-line"
          )}
        />
      </div>

      {/* Styles CSS intégrés pour les animations personnalisées */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes apple-square-pulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
              transform: scale(1.1);
            }
          }
          
          @keyframes apple-loading-line {
            0% {
              width: 0%;
            }
            50% {
              width: 100%;
            }
            100% {
              width: 0%;
            }
          }
          
          .animate-apple-loading-line {
            animation: apple-loading-line 2s ease-in-out infinite;
          }
        `
      }} />
    </div>
  );
}