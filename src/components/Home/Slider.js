import React, { useEffect, useState } from "react";
import image1 from "../../images/1.jpg";
import image2 from "../../images/2.jpg";
import image3 from "../../images/3.jpg";
import './Slider.scss'

const Sliders = [
  {
    text: 'Etiquette reflects your respect for others and strengthens social relationships.',
    img: image1

  },
  {
    text: 'Following etiquette rules gives you greater confidence in public and professional settings',
    img: image2,
  },
  {
    text: 'Etiquette facilitates communication and creates a comfortable and respectful environment for everyone.',
    img: image3
  }];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? Sliders.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === Sliders.length - 1 ? 0 : current + 1);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // كل 3 ثواني
    return () => clearInterval(interval); // تنظيف الانترفال عند فك المكون
  }, [current]);

  return (
    <div className="relative w-full">
      {/* Indicators */}
      <ol className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {Sliders.map((_, i) => (
          <li
            key={i}
            className={`w-2 h-2 rounded-full ${i === current ? "bg-primary" : "bg-gray-400"}`}
            onClick={() => setCurrent(i)}
          ></li>
        ))}
      </ol>

      {/* Slides */}
      <div className="overflow-hidden relative mx-auto" style={{ height: "100%", width: "80vw" }}>
        <div
          className="flex transition-transform duration-1000"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {Sliders.map((item, i) => (
            <div key={i} className="w-full h-full object-cover flex-shrink-0 slide">
              <img src={item.img} alt={`Slide ${i}`} />
              {item.text && <div className="slide-text">{item.text}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white p-1  z-20"

      >
        {" < "}
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white p-1  z-20"

      >
        {" > "}
      </button>
    </div>
  );
};

export default Slider;



