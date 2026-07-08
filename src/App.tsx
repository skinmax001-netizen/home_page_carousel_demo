/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
}

const Carousel: React.FC = () => {
  const DESIGN_WIDTH = 1200;

  const slides: Slide[] = [
    { id: 1, image: "https://picsum.photos/1080/1240?random=1" },
    { id: 2, image: "https://picsum.photos/1080/1240?random=2" },
    { id: 3, image: "https://picsum.photos/1080/1240?random=3" },
    // { id: 1, image: "assets/images/1111.jpg.jpeg" },
    // { id: 2, image: "assets/images/RELFYDESS.jpg.jpeg" },
    // { id: 3, image: "assets/images/工作區域 4.jpg.jpeg" },
  ];

  const [index, setIndex] = useState<number>(1);
  const [scaleRatio, setScaleRatio] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const containerWidth = Math.min(screenWidth, 720);
      const ratio = containerWidth / DESIGN_WIDTH;
      setScaleRatio(ratio);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // 4 seconds auto-play

    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = (): void => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = (): void => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    if (info.offset.x > 120) {
      prevSlide();
    } else if (info.offset.x < -120) {
      nextSlide();
    }
  };

  const getPosition = (i: number): "center" | "left" | "right" | "hidden" => {
    const diff = i - index;
    if (diff === 0) return "center";
    if (diff === -1 || diff === slides.length - 1) return "left";
    if (diff === 1 || diff === -(slides.length - 1)) return "right";
    return "hidden";
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "720px",
        margin: "0 auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "transparent",
        boxSizing: "border-box",
        padding: "20px 0",
      }}
    >
      <style>{`
        .carousel-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
          width: 100%;
          padding: 0 16px;
        }

        .carousel-title {
          font-size: 20px;
          letter-spacing: 4px;
          color: #8266AB;
          font-weight: 600;
          text-align: center;
          margin: 0;
        }

        @media (min-width: 480px) {
          .carousel-header {
            gap: 24px;
            margin-bottom: 32px;
          }
          .carousel-title {
            font-size: 24px;
            letter-spacing: 5px;
          }
        }

        @media (min-width: 768px) {
          .carousel-header {
            gap: 30px;
            margin-bottom: 40px;
          }
          .carousel-title {
            font-size: 28px;
            letter-spacing: 6px;
          }
        }

        .arrow-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: #c4b5fd;
          transition: 0.3s;
          padding: 10px;
          border-radius: 50%;
        }

        .arrow-btn:hover {
          color: #8b5cf6;
          background: rgba(139, 92, 246, 0.05);
        }

        .carousel-design {
          width: ${DESIGN_WIDTH}px;
          height: 530px;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .carousel-container {
          position: relative;
          height: 530px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slide-card {
          position: absolute;
          width: 405px;
          height: 465px;
          overflow: hidden;
          cursor: grab;
          background: white;
        }

        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }
      `}</style>

      <div className="carousel-header">
        <button className="arrow-btn" onClick={prevSlide} aria-label="上一張">
          <ChevronLeft size={24} strokeWidth={3.5} />
        </button>
 
        <h2 className="carousel-title" id="carousel-heading">最新熱門療程</h2>
 
        <button className="arrow-btn" onClick={nextSlide} aria-label="下一張">
          <ChevronRight size={24} strokeWidth={3.5} />
        </button>
      </div>
 
      <div
        style={{
          width: "100%",
          height: `${530 * scaleRatio}px`,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={wrapperRef}
          className="carousel-design"
          style={{
            transform: `scale(${scaleRatio})`,
            transformOrigin: "top center",
            position: "absolute",
            top: 0,
          }}
        >
          <div className="carousel-container" aria-labelledby="carousel-heading" role="region">
            {slides.map((slide, i) => {
              const position = getPosition(i);
 
              let x = 0;
              let scale = 0.7;
              let opacity = 0.4;
              let zIndex = 0;
 
              if (position === "center") {
                x = 0;
                scale = 1.1;
                opacity = 1;
                zIndex = 3;
              } else if (position === "left") {
                x = -390;
                scale = 0.8;
                opacity = 0.6;
                zIndex = 2;
              } else if (position === "right") {
                x = 390;
                scale = 0.8;
                opacity = 0.6;
                zIndex = 2;
              }
 
              return (
                <motion.div
                  key={slide.id}
                  id={`slide-card-${slide.id}`}
                  className="slide-card"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  onClick={() => setIndex(i)}
                  animate={{
                    x,
                    scale,
                    opacity,
                    zIndex,
                  }}
                  transition={{
                    type: "tween",
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <img
                    src={slide.image}
                    alt={`療程圖片 ${slide.id}`}
                    className="slide-image"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
