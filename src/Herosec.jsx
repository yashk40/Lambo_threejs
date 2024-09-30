import React, { useRef, useEffect } from 'react';
import { initThreeScene } from './Three'; // Adjust the import path as needed

export default function Herosec() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initThreeScene(canvasRef.current);
      return cleanup;
    }
  }, []);

  return (
    <>
      <h1 className="font-bold text-center py-20 text-white absolute" style={{zIndex:"234"}} id='title'>Lamborghini</h1>
      <canvas ref={canvasRef} id="Three" style={{ width: '100vw', height: '100%' , position:'absolute' ,zIndex:"231"}} >egw</canvas>
    </>
  );
}

