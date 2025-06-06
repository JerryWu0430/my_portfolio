import { useEffect, useRef } from "react";

// Add this at the top of the file to extend the Window interface
declare global {
  interface Window {
    Vara?: any;
  }
}

export default function Preloader({ onFinish }: { onFinish: () => void }) {
  const varaInitialized = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Clean up any previous SVGs in the container
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Guard: Only initialize Vara once per mount
    if (varaInitialized.current) return;
    varaInitialized.current = true;

    // Only add the script if it's not already present
    const existingScript = document.querySelector('script[src*="vara.min.js"]') as HTMLScriptElement | null;
    let script: HTMLScriptElement | null = null;
    if (!existingScript) {
      script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/vara@1.4.0/lib/vara.min.js";
      script.async = true;
      document.body.appendChild(script);
      scriptRef.current = script;
    } else {
      scriptRef.current = existingScript;
    }

    function startVara() {
      let fontSize = 72;
      if (window.screen.width < 700) fontSize = 32;
      else if (window.screen.width < 1200) fontSize = 56;
      // @ts-ignore
      const vara = new window.Vara(
        containerRef.current,
        "https://cdn.jsdelivr.net/npm/vara@1.4.0/fonts/Satisfy/SatisfySL.json",
        [
          { text: "Jerry Wu :)", y: 90, fromCurrentPosition: { y: false }, duration: 4000 }
        ],
        {
          strokeWidth: 2,
          color: "#FFFFFF",
          fontSize: fontSize,
          textAlign: "center"
        }
      );
      vara.ready(function () {
        let erase = true;
        vara.animationEnd(function (_i: any, o: any) {
          if (erase) {
            o.container.style.transition = "opacity 1s 1s";
            o.container.style.opacity = 0;
            setTimeout(onFinish, 2000); // Hide preloader after animation
          }
        });
      });
    }

    // Helper to handle script load and error
    function handleScriptLoad() {
      if (window.Vara) {
        startVara();
      }
    }
    function handleScriptError() {
      console.error("Failed to load Vara script.");
      if (containerRef.current) {
        containerRef.current.innerHTML = '<span style="color: white;">Failed to load animation.</span>';
      }
      onFinish();
    }

    if (window.Vara) {
      startVara();
    } else if (scriptRef.current) {
      scriptRef.current.addEventListener("load", handleScriptLoad);
      scriptRef.current.addEventListener("error", handleScriptError);
    }

    return () => {
      // Clean up SVGs on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      varaInitialized.current = false;
      // Clean up event listeners if scriptRef is set
      if (scriptRef.current) {
        scriptRef.current.removeEventListener("load", handleScriptLoad);
        scriptRef.current.removeEventListener("error", handleScriptError);
      }
    };
  }, [onFinish]);

  return (
    <div
      ref={preloaderRef}
      style={{
        position: "fixed",
        zIndex: 9999,
        background: "black",
        color: "white",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          minHeight: "60vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflow: "visible",
          paddingTop: "15vh",
        }}
      ></div>
      <style jsx>{`
        div[ref] {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        div[ref] svg {
          display: block;
          margin: 0 auto;
          overflow: visible;
        }
      `}</style>
    </div>
  );
} 