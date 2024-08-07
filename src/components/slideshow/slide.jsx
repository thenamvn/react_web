import React, { useState } from 'react';
import './Slideshow.module.css';

const Slideshow = ({ images }) => {
  const [slideIndex, setSlideIndex] = useState(1);

  const showDivs = (n) => {
    let newIndex = n;
    if (n > images.length) newIndex = 1;
    if (n < 1) newIndex = images.length;
    setSlideIndex(newIndex);
  };

  const plusDivs = (n) => showDivs(slideIndex + n);
  const currentDiv = (n) => showDivs(n);

  return (
    <div className="w3-content w3-display-container" style={{ maxWidth: '800px' }}>
      {images.map((src, index) => (
        <img
          key={index}
          className={`mySlides ${slideIndex === index + 1 ? 'show' : ''}`}
          src={src}
          style={{ width: '100%' }}
          alt={`Slide ${index + 1}`}
        />
      ))}
      <div
        className="w3-center w3-container w3-section w3-large w3-text-white w3-display-bottommiddle"
        style={{ width: '100%' }}
      >
        <div className="w3-left w3-hover-text-khaki" onClick={() => plusDivs(-1)}>
          &#10094;
        </div>
        <div className="w3-right w3-hover-text-khaki" onClick={() => plusDivs(1)}>
          &#10095;
        </div>
        {images.map((_, index) => (
          <span
            key={index}
            className={`w3-badge demo w3-border w3-transparent w3-hover-white ${slideIndex === index + 1 ? 'w3-white' : ''
              }`}
            onClick={() => currentDiv(index + 1)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
