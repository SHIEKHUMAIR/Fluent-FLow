"use client";
import React, { useEffect, useState } from "react";

const RiceProducts = ({ selectedCategory }) => {
    const [data, setData] = useState({ faqs: [], whyChooseUs: {}, products: [] });
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
                const loadData = async () => {
                    if (selectedCategory) {
                        try {
                            const jsonData = await import(`@/data/${selectedCategory}.json`);
                            setData(jsonData.default); // Import returns a module, so use `.default`
                        } catch (error) {
                            console.error(`Error loading ${selectedCategory} data:`, error);
                        }
                    }
                };
        
                loadData();
            }, [selectedCategory]);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            {data.whyChooseUs && (
                <section className="why-choose-one">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap py-32 justify-center items-center">
                            <div className="w-full lg:w-1/2">
                                <div className="why-choose-one__right">
                                    <div className="why-choose-one__img">
                                        <img src={data.whyChooseUs.image} alt="Why Choose Us" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="why-choose-one__left pl-32 mr-0">
                                    <div className="section-title text-left">
                                        <div className="section-title__tagline-box">
                                            <span className="section-title__tagline">{data.whyChooseUs.tagline}</span>
                                        </div>
                                        <h2 className="section-title__title">{data.whyChooseUs.title}</h2>
                                    </div>
                                    <p className="why-choose-one__text">{data.whyChooseUs.description}</p>
                                    <div className="why-choose-one__btn-box">
                                        <a href={data.whyChooseUs.buttonLink} className="thm-btn why-choose-one__btn">
                                            {data.whyChooseUs.buttonText}<span></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {data.pageContent && (
                <section className="team-details-info pt-0">
                    <div className="container mx-auto px-4">
                        <div className="team-details__bottom">
                            <span className="section-title__tagline">{data.pageContent.tagline}</span>
                            <h2 className="section-title__title pb-6">{data.pageContent.title}</h2>
                            
                            {data.pageContent.sections?.map((section, index) => (
                                <div key={index}>
                                    <h3 className="team-details__title-3">{section.heading}</h3>
                                    <p className="team-details__text-1">{section.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
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
              {data.faqs.map((faq, index) => (
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
        </>
    );
};

export default RiceProducts;
