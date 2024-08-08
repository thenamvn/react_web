import React, { useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import styles from "./Slideshow.module.css";

const Carousel = ({ data }) => {
  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    setSlide(slide === data.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? data.length - 1 : slide - 1);
  };

  return (
    <div className={styles.carousel}>
      <BsArrowLeftCircleFill onClick={prevSlide} className={`${styles.arrow} ${styles.arrowLeft}`} />
      {data.map((item, idx) => {
        return (
          <img
            src={item.image_path}
            alt={`Slide ${idx}`}
            key={idx}
            className={slide === idx ? styles.slide : `${styles.slide} ${styles.slideHidden}`}
          />
        );
      })}
      <BsArrowRightCircleFill
        onClick={nextSlide}
        className={`${styles.arrow} ${styles.arrowRight}`}
      />
      <span className={styles.indicators}>
        {data.map((_, idx) => {
          return (
            <button
              key={idx}
              className={
                slide === idx ? styles.indicator : `${styles.indicator} ${styles.indicatorInactive}`
              }
              onClick={() => setSlide(idx)}
            ></button>
          );
        })}
      </span>
    </div>
  );
};

export default Carousel;