"use client";
import React, { useState, useEffect } from "react";

const FaqSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // No FAQ open initially

  useEffect(() => {
    import("@/data/contact.json")
      .then((module) => setFaqs(module.default))
      .catch((error) => console.error("Error loading FAQ data:", error));
  }, []);

  // Toggle accordion state
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-two">
        {/* <div className="faq-one__bg-color"></div> */}
        <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2">
                    <div className="faq-one__left mr-4">
                        <div className="section-title text-left">
                            <div className="section-title__tagline-box">
                                <span className="section-title__tagline">FAQ</span>
                            </div>
                            <h2 className="section-title__title textDark">Do You Have Any<br />Question Please?</h2>
                        </div>
                        <div className="accrodion-grp faq-two-accrodion ">
              {faqs.map((faq, index) => (
                <div
                key={index}
                className={`accrodion ${activeIndex === index ? "active " : ""} border-solid border-[#c11425]`}>
            
                  <div className="accrodion-title textDark" onClick={() => toggleAccordion(index)}>
                    <h4 className="textDark ">{faq.question}</h4>
                  </div>
                  {activeIndex === index && (
                    <div className="accrodion-content">
                      <div className="inner textDark border-t border-solid border-[#c11425]">
                        <p className="textDark">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="faq-one__right wow fadeInRight" data-wow-delay="300ms">
                        <h3 className="faq-one__from-title">Get in touch with us</h3>
                        <form className="contact-form-validated faq-one__form" action="assets/inc/sendemail.php" method="post" noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="faq-one__input-box">
        <input type="text" name="name" placeholder="First Name" required className="w-full p-2 border border-gray-300 rounded" />
    </div>
    <div className="faq-one__input-box">
        <input type="text" name="name" placeholder="Last Name" required className="w-full p-2 border border-gray-300 rounded" />
    </div>
    <div className="faq-one__input-box">
        <input type="email" name="email" placeholder="Your Email" required className="w-full p-2 border border-gray-300 rounded" />
    </div>
    <div className="faq-one__input-box">
        <input type="text" name="text" placeholder="Phone Number" required className="w-full p-2 border border-gray-300 rounded" />
    </div>
    <div className="faq-one__input-box text-message-box md:col-span-2">
        <textarea name="message" placeholder="Message here.." className="w-full p-2 border border-gray-300 rounded"></textarea>
    </div>
    <div className="faq-one__btn-box md:col-span-2 flex justify-center">
        <button type="submit" className="thm-btn faq-one__btn bg-blue-500 text-white py-2 px-4 rounded">Submit Now<span></span></button>
    </div>
</div>


                        </form>
                        <div className="result"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default FaqSection;
