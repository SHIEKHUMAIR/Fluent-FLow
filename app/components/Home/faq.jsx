"use client";
import React, { useState } from "react";
import faqs from "@/data/faqData.json"; // Import JSON directly

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(0); // First index open by default

  // Toggle accordion state
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-one bg-[#0f1b24]">
      <div className="faq-one__bg-color"></div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1">
          <div className="faq-one__left">
            <div className="section-title text-center">
              <div className="section-title__tagline-box">
                <span className="section-title__tagline text-[#C11425]">FAQ</span>
              </div>
              <h2 className="section-title__title">
                Do You Have Any <br /> Question Please?
              </h2>
            </div>

            {/* Accordion List */}
            <div className="accrodion-grp faq-one-accrodion w-1/2 mx-auto">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`accrodion ${activeIndex === index ? "active" : ""}`}
                >
                  <div className="accrodion-title" onClick={() => toggleAccordion(index)}>
                    <h4>{faq.question}</h4>
                  </div>
                  {activeIndex === index && (
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
