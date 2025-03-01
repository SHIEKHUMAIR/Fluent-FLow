// import React from 'react';

// function Industries() {
//   return (
// //     <section className="services-one">
// //       <div className="container mx-auto px-4">
// //         <div className="section-title text-center">
// //           <div className="section-title__tagline-box">
// //             <span className="section-title__tagline">LATEST SERVICE</span>
// //           </div>
// //           <h2 className="section-title__title">Your supply chain partner<br /> for success</h2>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //   {/* Services One Single Start */}
// //   <div className="wow fadeInLeft" data-wow-delay="100ms">
// //     <div className="services-one__single">
// //       <div className="services-one__icon">
// //         <span className="icon-postbox"></span>
// //       </div>
// //       <h3 className="services-one__title">
// //         <a href="express-freight-solutions.html">Fast and reliable logistics the solutions</a>
// //       </h3>
// //       <div className="services-one__btn-box">
// //         <a href="express-freight-solutions.html" className="thm-btn services-one__btn">Read more<span></span></a>
// //       </div>
// //     </div>
// //   </div>
// //   {/* Services One Single End */}
// //   {/* Services One Single Start */}
// //   <div className="wow fadeInUp" data-wow-delay="200ms">
// //     <div className="services-one__single">
// //       <div className="services-one__icon">
// //         <span className="icon-customer-service"></span>
// //       </div>
// //       <h3 className="services-one__title">
// //         <a href="quick-move-logistics.html">Bridges Construction is an essen industry</a>
// //       </h3>
// //       <div className="services-one__btn-box">
// //         <a href="quick-move-logistics.html" className="thm-btn services-one__btn">Read more<span></span></a>
// //       </div>
// //     </div>
// //   </div>
// //   {/* Services One Single End */}
// //   {/* Services One Single Start */}
// //   <div className="wow fadeInRight" data-wow-delay="300ms">
// //     <div className="services-one__single">
// //       <div className="services-one__icon">
// //         <span className="icon-container"></span>
// //       </div>
// //       <h3 className="services-one__title">
// //         <a href="speedy-dispatch.html">That involves building adesig the a structures</a>
// //       </h3>
// //       <div className="services-one__btn-box">
// //         <a href="speedy-dispatch.html" className="thm-btn services-one__btn">Read more<span></span></a>
// //       </div>
// //     </div>
// //   </div>
// //   {/* Services One Single End */}
// // </div>
// //       </div>
// //     </section>

//     <section className="process-one">
//       <div className="container mx-auto px-4">
//         <div className="section-title text-center">
//           <div className="section-title__tagline-box">
//             <span className="section-title__tagline">Work Process</span>
//           </div>
//           <h2 className="section-title__title">
//             Your trusted logistics a <br /> provider for success
//           </h2>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Process One Single Start */}
//           <div className="wow fadeInUp" data-wow-delay="100ms">
//             <div className="process-one__single">
              
//               <div className="process-one__count"></div>
//               <h3 className="process-one__title">Seamless Supply Chain</h3>
//               <div className="process-one__icon-and-text">
//                 <div className="icon">
//                   <span className="icon-crane"></span>
//                 </div>
//                 <p>Logistic service in implementation and control the efficient</p>
//               </div>
//             </div>
//           </div>
//           {/* Process One Single End */}
//           {/* Process One Single Start */}
//           <div className="wow fadeInUp" data-wow-delay="200ms">
//             <div className="process-one__single">
              
//               <div className="process-one__count"></div>
//               <h3 className="process-one__title">Reliable Distribution</h3>
//               <div className="process-one__icon-and-text">
//                 <div className="icon">
//                   <span className="icon-shipping"></span>
//                 </div>
//                 <p>Logistic service in implementation and control the efficient</p>
//               </div>
//             </div>
//           </div>
//           {/* Process One Single End */}
//           {/* Process One Single Start */}
//           <div className="wow fadeInUp" data-wow-delay="300ms">
//             <div className="process-one__single">
//               <div className="process-one__count"></div>
//               <h3 className="process-one__title">Fast and reliable logistics</h3>
//               <div className="process-one__icon-and-text">
//                 <div className="icon">
//                   <span className="icon-postbox"></span>
//                 </div>
//                 <p>Logistic service in implementation and control the efficient</p>
//               </div>
//             </div>
//           </div>
//           {/* Process One Single End */}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Industries;
"use client";

import React, { useEffect, useState } from "react";

function Industries() {
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    fetch("industries.json") 
      .then((response) => response.json())
      .then((data) => setIndustries(data))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

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
