import React from 'react';

function PinkSalt() {
  return (
    <section className="why-choose-one py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2">
            <div className="why-choose-one__left mr-40">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">Why Chose us</span>
                </div>
                <h2 className="section-title__title">Delivering excellence every a time Express Logistics</h2>
              </div>
              <p className="why-choose-one__text">
                Construction is an essential industry that involves building adesigning the an structures such as buildings roads, bridges Construction is an essent industry that involves building adesigning the a structures such
              </p>
              <div className="why-choose-one__btn-box">
                <a href="about.html" className="thm-btn why-choose-one__btn">Read more<span></span></a>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="why-choose-one__right">
              <div className="why-choose-one__img wow slideInRight" data-wow-delay="100ms" data-wow-duration="2500ms">
                <img src="/assets/logo/pinksaltymass-1024x576.webp" alt="" />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PinkSalt;