import { useEffect, useRef } from 'react';

/**
 * SplineBackground Component
 * 
 * 3D animated background using Spline viewer
 * Covers the entire application behind all content
 */
export function SplineBackground() {
  const viewerRef = useRef(null);

  useEffect(() => {
    // Ensure the spline-viewer web component is loaded
    if (typeof window !== 'undefined' && !customElements.get('spline-viewer')) {
      console.log('Waiting for spline-viewer to load...');
    }
  }, []);

  return (
    <div 
      className="fixed inset-0 w-full h-full -z-10"
      style={{ 
        pointerEvents: 'none',
        isolation: 'isolate'
      }}
    >
      <spline-viewer 
        ref={viewerRef}
        url="https://prod.spline.design/AfIlBSfqkWshXvmj/scene.splinecode"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
