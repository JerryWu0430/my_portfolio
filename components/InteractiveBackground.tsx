'use client';

import { useEffect, useRef } from 'react';

export const InteractiveBackground = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeScript = (callback: () => void) => {
      const existingScript = document.querySelector('script[src^="https://cdn.unicorn.studio"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://cdn.unicorn.studio/v1.2.3/unicornStudio.umd.js';
        script.onload = callback;
        document.head.appendChild(script);
      } else {
        callback();
      }
    };

    const initializeUnicornStudio = () => {
      if (elementRef.current) {
      
        /*
        "ASCII"  - HJKVa10sftexJ7OgsOnU
        "Liquid" - lHlDvoJDIXCxxXVqTNOC
        "Folds" - YnADGzDD7LGB9cUocyyN
        "Smoke" - ezEDNzFtrAgm8yCUWUeX
        "Flow" - wYI4YirTR5lrja86ArSY
        not suitable "Pixel" - rJ39y9Nnyz3cJooDtmNM 
        */
        elementRef.current.setAttribute('data-us-project', 'YnADGzDD7LGB9cUocyyN');
        if (window.UnicornStudio) {
          window.UnicornStudio.destroy();
          window.UnicornStudio.init().then((scenes: any) => {
            console.log('Unicorn Studio scenes:', scenes);
          });
        }
      }
    };

    if (window.UnicornStudio) {
      initializeUnicornStudio();
    } else {
      initializeScript(initializeUnicornStudio);
    }

    return () => {
      if (window.UnicornStudio) {
        window.UnicornStudio.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      data-us-dpi="1"
      data-us-scale="1"
      data-us-fps="120"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Add TypeScript declaration for UnicornStudio
declare global {
  interface Window {
    UnicornStudio: {
      destroy: () => void;
      init: () => Promise<any>;
    };
  }
} 