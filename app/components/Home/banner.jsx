import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function Banner() {
  return (
    <section className="main-slider">
      <div
        className="swiper-container thm-swiper__slider"
        data-swiper-options='{
          "slidesPerView": 1,
          "loop": true,
          "effect": "fade",
          "pagination": {
            "el": "#main-slider-pagination",
            "type": "bullets",
            "clickable": true
          },
          "navigation": {
            "nextEl": "#main-slider__swiper-button-next",
            "prevEl": "#main-slider__swiper-button-prev"
          },
          "autoplay": {
            "delay": 8000
          }
        }'
      >
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <div
              className="main-slider__bg"
              // style={{ backgroundImage: 'url()' }}
            ></div>
            <div className="main-slider__shape-1"></div>
            <div className="main-slider__shape-2"></div>
            <div className="main-slider__shape-3"></div>
            <div className="main-slider__shape-4"></div>
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap">
                <div className="w-full">
                  <div className="main-slider__content">
                    <div className="main-slider__sub-title-box">
                     
                      <p className="main-slider__sub-title">Best shipping</p>
                    </div>
                    <h2 className="main-slider__title">
                      Reliable <span>Responsive</span> <br /> Driven Logistics
                    </h2>
                    <p className="main-slider__text">
                      We have been operating for over a decade, providing top-notch services to <br /> our clients and building a strong track record in the industry.
                    </p>
                    <div className="main-slider__btn-and-call-box">
                      <div className="main-slider__btn-box">
                        <a href="about.html" className="thm-btn main-slider__btn">
                          Read more<span><FontAwesomeIcon icon={faArrowRight} /></span>
                        </a>
                      </div>
                      <div className="main-slider__call">
                        <div className="main-slider__call-icon">
                          <span className="icon-phone"></span>
                        </div>
                        <div className="main-slider__call-number">
                          <p>Need help?</p>
                          <h5>
                            <a href="tel:307555-0133">(307) 555-0133</a>
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default Banner;