'use client';
import React, { useState, useEffect } from "react";

const SaltProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("saltproducts.json")
      .then((response) => response.json())
      .then((data) => setProducts(data.slice(0, 5))) // Limit to first 5 entries
      .catch((error) => console.error("Error loading blog data:", error));
  }, []);

  return (
    <section className="project-two">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Static Project Two Single Start */}
          <div className="wow fadeInUp" data-wow-delay="100ms">
            <div className="project-two__single">
              <div className="project-two__content-box">
                <div className="section-title text-left">
                  <div className="section-title__tagline-box">
                    <span className="section-title__tagline">latest project</span>
                  </div>
                  <h2 className="section-title__title">Seamless logistics for your logo</h2>
                </div>
                <div className="project-two__btn-box">
                  <a href="project-details.html" className="thm-btn project-two__btn">
                    more project<span></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Dynamically Rendered Products */}
          {products.map((product) => (
            <div key={product.id} className="wow fadeInUp" data-wow-delay="300ms">
              <div className="project-two__single">
                <div className="project-two__img">
                  <img src={product.image} alt={product.title} />
                  <div className="project-two__content">
                    {/* <p className="project-two__sub-title">{product.title}</p> */}
                    <h3 className="project-two__title">
                      <a href={product.link}>{product.title}</a>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SaltProducts;
