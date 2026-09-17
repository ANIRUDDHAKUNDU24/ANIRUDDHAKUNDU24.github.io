import { useEffect, useRef } from 'react';

/**
 * Pressure-sensitive variable-font text.
 * The font must support the wght, wdth, and ital axes.
 */
export default function TextPressure({ text, className = '', radius = 180 }) {
  const containerRef = useRef(null);
  const characterRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let pointer = null;
    let frameId = null;

    const distanceToRect = (x, y, rect) => {
      const nearestX = Math.max(rect.left, Math.min(x, rect.right));
      const nearestY = Math.max(rect.top, Math.min(y, rect.bottom));
      return Math.hypot(x - nearestX, y - nearestY);
    };

    const update = () => {
      frameId = null;

      characterRefs.current.forEach((character) => {
        if (!character) return;

        const rect = character.getBoundingClientRect();
        const influence = pointer
          ? Math.max(0, 1 - distanceToRect(pointer.x, pointer.y, rect) / radius)
          : 0;

        const eased = influence * influence * (3 - 2 * influence);
        const weight = Math.round(100 + eased * 800);
        const width = Math.round(50 + eased * 50);
        const italic = Number((eased * 1).toFixed(3));

        character.style.setProperty('--pressure-weight', String(weight));
        character.style.setProperty('--pressure-width', String(width));
        character.style.setProperty('--pressure-italic', String(italic));
      });
    };

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    const onPointerMove = (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      scheduleUpdate();
    };

    const onPointerLeave = () => {
      pointer = null;
      scheduleUpdate();
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    return () => {
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [radius, text]);

  return (
    <span ref={containerRef} className={`text-pressure ${className}`} aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span
          key={`${character}-${index}`}
          ref={(node) => {
            characterRefs.current[index] = node;
          }}
          className={`text-pressure__char${character === ' ' ? ' text-pressure__char--space' : ''}`}
          aria-hidden="true"
        >
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
    </span>
  );
}
