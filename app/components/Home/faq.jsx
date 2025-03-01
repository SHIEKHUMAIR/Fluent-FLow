
// import React from 'react';

// const Faq = () => {
//   return (
//     <section className="faq-one">
//       <div className="faq-one__bg-color"></div>
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1">
//           <div>
//             <div className="faq-one__left">
//               <div className="section-title text-left">
//                 <div className="section-title__tagline-box">
//                   <span className="section-title__tagline">FAQ</span>
//                 </div>
//                 <h2 className="section-title__title">
//                   Do You Have Any <br /> Question Please?
//                 </h2>
//               </div>
//               <div className="accrodion-grp faq-one-accrodion" data-grp-name="faq-one-accrodion-1">
//                 <div className="accrodion active">
//                   <div className="accrodion-title">
//                     <h4>How can I track my shipment?</h4>
//                   </div>
//                   <div className="accrodion-content">
//                     <div className="inner">
//                       <p>
//                         It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="accrodion">
//                   <div className="accrodion-title">
//                     <h4>What is the average delivery time?</h4>
//                   </div>
//                   <div className="accrodion-content">
//                     <div className="inner">
//                       <p>
//                         It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="accrodion">
//                   <div className="accrodion-title">
//                     <h4>Do you offer Smooth Running Supply?</h4>
//                   </div>
//                   <div className="accrodion-content">
//                     <div className="inner">
//                       <p>
//                         It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div>
            
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Faq;
"use client";
import React, { useEffect, useState } from "react";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // First index open by default

  // Fetch data from JSON file
  useEffect(() => {
    fetch("faqData.json")
      .then((response) => response.json())
      .then((data) => setFaqs(data))
      .catch((error) => console.error("Error fetching FAQ data:", error));
  }, []);

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
            <div className="section-title text-left">
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
