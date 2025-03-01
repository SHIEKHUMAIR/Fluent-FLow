"use client";
import React, { useState, useEffect } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("saltproducts.json")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error loading product data:", error));
  }, []);

  return (
    <section className="blog-one">
      <div className="container mx-auto px-4">
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">Latest Blog</span>
          </div>
          <h2 className="section-title__title">
            Streamlining your supply<br /> chain processes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="wow fadeInLeft" data-wow-delay="100ms">
              <div className="blog-one__single">
                <div className="blog-one__img-box">
                  <div className="blog-one__img">
                    <img src={product.image} alt={product.title} />
                  </div>
                </div>
                <div className="blog-one__content text-center">
                  <h3 className="blog-one__title">
                    <a href={product.link}>{product.title}</a>
                  </h3>
                  <p className="w-100 border-b-2 border-black pt-2"></p>
                  {/* <p className="blog-one__text">{product.description}</p> */}
                  <div className="blog-one__read-more pt-2">
                    <a href={product.link}>
                      Read More<span className="icon-arrow-right"></span>
                    </a>
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

export default Products;