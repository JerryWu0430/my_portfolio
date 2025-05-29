import { useEffect } from "react";

export default function Preloader({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    // Clean up any previous SVGs in the container
    const container = document.getElementById("container");
    if (container) {
      container.innerHTML = "";
    }

    // Only add the script if it's not already present
    const existingScript = document.querySelector('script[src*="vara.min.js"]');
    let script: HTMLScriptElement | null = null;
    if (!existingScript) {
      script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/vara@1.4.0/lib/vara.min.js";
      script.async = true;
      document.body.appendChild(script);
    }

    function startVara() {
      let fontSize = 72;
      if (window.screen.width < 700) fontSize = 32;
      else if (window.screen.width < 1200) fontSize = 56;
      // @ts-ignore
      const vara = new window.Vara(
        "#container",
        "https://cdn.jsdelivr.net/npm/vara@1.4.0/fonts/Satisfy/SatisfySL.json",
        [
          { text: "Jerry's Portfolio :)", y: 90, fromCurrentPosition: { y: false }, duration: 4000 }
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

    if (window.Vara) {
      startVara();
    } else {
      // If script is newly added, wait for it to load
      if (script) {
        script.onload = startVara;
      } else if (existingScript) {
        existingScript.addEventListener("load", startVara);
      }
    }

    return () => {
      // Clean up SVGs on unmount
      const container = document.getElementById("container");
      if (container) {
        container.innerHTML = "";
      }
      // Optionally, remove the script if you want, but not necessary if only loaded once
    };
  }, [onFinish]);

  return (
    <div
      id="preloader"
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
        id="container"
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
        #preloader {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #container svg {
          display: block;
          margin: 0 auto;
          overflow: visible;
        }
      `}</style>
    </div>
  );
} 