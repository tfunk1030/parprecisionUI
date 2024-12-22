import React, { createContext, useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WebGLContextType {
  renderer: THREE.WebGLRenderer | null;
  initRenderer: (canvas: HTMLCanvasElement) => void;
}

const WebGLContext = createContext<WebGLContextType>({
  renderer: null,
  initRenderer: () => {},
});

export function WebGLProvider({ children }: { children: React.ReactNode }) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const initRenderer = (canvas: HTMLCanvasElement) => {
    if (!rendererRef.current) {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      
      // Enable WebGL optimizations
      renderer.physicallyCorrectLights = true;
      
      rendererRef.current = renderer;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <WebGLContext.Provider value={{ renderer: rendererRef.current, initRenderer }}>
      {children}
    </WebGLContext.Provider>
  );
}

export function useWebGL() {
  return useContext(WebGLContext);
}
