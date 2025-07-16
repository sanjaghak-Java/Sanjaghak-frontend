import React, { useEffect, useState } from 'react';
import '/src/styles/backgroundPattern.css';
import patternImg from '../assets/abstract-grunge-halftone-circles-textured-background-design.png';

const BackgroundPattern = ({ parentRef }) => {
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    if (parentRef?.current) {
      const height = parentRef.current.offsetHeight;
      const count = Math.ceil(height / 300);
      setImageCount(count);
    }
  }, [parentRef]);

  const positions = Array.from({ length: imageCount }, (_, i) => {
    const pos = i % 2 === 0 ? 'left' : 'right';
    const verticalOffset = i * 320 + (i % 2 !== 0 ? 80 : 0);
    return { top: verticalOffset, position: pos };
  });

  return (
    <div className="background-pattern-container">
      {positions.map((item, index) => (
        <img
          key={index}
          src={patternImg}
          alt="pattern"
          className={`pattern-img ${item.position}`}
          style={{ top: `${item.top}px` }}
        />
      ))}
    </div>
  );
};

export default BackgroundPattern;