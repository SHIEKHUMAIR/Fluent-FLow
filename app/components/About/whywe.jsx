import React from 'react';

const WhyWe = () => {
  return (
    <section className="why-are-we">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full xl:w-1/3">
            <div className="why-are-we__left">
              <div className="why-are-we__img">
                <img src="assets/rice/About-Us.webp" alt="" />
              </div>
            </div>
          </div>
          <div className="w-full xl:w-2/3">
            <div className="why-are-we__right">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">Why are we best</span>
                </div>
                <h2 className="section-title__title">
                  Efficiency at its best with our<br /> logistics services
                </h2>
              </div>
              <ul className="why-are-we__list list-none">
                <li className="flex items-start mb-4">
                  <div className="why-are-we__icon mr-4">
                    <span className="icon-arrow-down-left"></span>
                  </div>
                  <div className="icon mr-4">
                    <span className="icon-location why-are-we__location"></span>
                  </div>
                  <div className="content">
                    <h3 className="text-lg font-semibold">Real Time tracking</h3>
                    <p>Logistic service involves the ntation and control</p>
                  </div>
                </li>
                <li className="flex items-start mb-4">
                  <div className="why-are-we__icon-2 mr-4">
                    <span className="icon-arrow-down-right"></span>
                  </div>
                  <div className="icon mr-4">
                    <span className="icon-shopping-cart why-are-we__cart"></span>
                  </div>
                  <div className="content">
                    <h3 className="text-lg font-semibold">On time delivery</h3>
                    <p>Logistic service involves the ntation and control</p>
                  </div>
                </li>
                <li className="flex items-start mb-4">
                  <div className="icon mr-4">
                    <span className="icon-call why-are-we__call"></span>
                  </div>
                  <div className="content">
                    <h3 className="text-lg font-semibold">24/7 online support</h3>
                    <p>Logistic service involves the ntation and control</p>
                  </div>
                </li>
              </ul>
              <div className="why-are-we__img-2 relative mt-8">
                <img src="assets/rice/images.jpg" alt="" />
                <div className="why-are-we__year absolute bottom-0 left-0 bg-white p-4 wow fadeInLeft" data-wow-delay="300ms">
                  <h3 className="text-2xl font-bold">Since 1920</h3>
                  <p>
                    Logistic service involves the planning, implementation, and control of the efficient and effective movement and storage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWe;