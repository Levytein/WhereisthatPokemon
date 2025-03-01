import { useEffect, useRef } from 'react';
import '../styles/Cursor.scss' 

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };


    window.addEventListener('mousemove', moveCursor);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
};

export default CustomCursor;
