"use client";

import React from "react";
import industries from "@/data/industries.json"; 

function Industries() {
  return (
    <section className="process-one">
      <div className="container mx-auto px-4">
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">Industries We Serve</span>
          </div>
          <h2 className="section-title__title">
            Reliable Rice & Salt Distribution Across Industries
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dynamically Rendering Industry Cards */}
          {industries.map((industry, index) => (
            <div key={industry.id} className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
              <div className="process-one__single">
                <div className="process-one__count"></div>
                <h3 className="process-one__title">{industry.industry}</h3>
                <div className="process-one__icon-and-text">
                  <div className="icon">
                    <span className={industry.icon}></span>
                  </div>
                  <p>{industry.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Industries;
