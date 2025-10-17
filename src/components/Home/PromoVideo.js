import React from "react";
import "./PromoVideo.scss";
// import promoVideo from "../../videos/promo.mp4"; 
import waving from '../../images/waving.gif'

const PromoVideo = () => {
  return (

    <div className="recommended">

      <p className="topic">Welcome to Made for Manners </p>
      <div className="line-container">
        <span className="line"></span>
        <i ><img src={waving } alt="waving "/></i>

      </div>

      <div className="video-slider-container">

        <iframe
          src=""
          width="100%"
          height="100%"
          allow="autoplay; fullscreen"
          title="promo"

        ></iframe>

      </div>
    </div>
  );
};

export default PromoVideo;
