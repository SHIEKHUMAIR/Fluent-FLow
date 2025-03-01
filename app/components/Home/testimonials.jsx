"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Testimonials = () => {
  const [team, setTeam] = useState([]);

  // Fetch data from JSON file
  useEffect(() => {
    fetch("/teamData.json")
      .then((response) => response.json())
      .then((data) => setTeam(data))
      .catch((error) => console.error("Error fetching team data:", error));
  }, []);

  return (
    <section className="team-one">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="team-one__top flex justify-between items-center">
          <div className="section-title text-left">
            <div className="section-title__tagline-box">
              <span className="section-title__tagline">Our Team</span>
            </div>
            <h2 className="section-title__title">
              Simplifying your logistics of <br /> the challenges
            </h2>
          </div>
          {/* Swiper Navigation Buttons */}
          <div className="team-one__nav flex space-x-4">
          <div className="swiper-button-prev"style={{color: "#c11425 !important"}}>
              <i className="icon-arrow-left"></i>
            </div>
          <div className="swiper-button-next"style={{color: "#c11425 !important"}}>
              <i className="icon-arrow-right"></i>
            </div>
          
            
          </div>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          pagination={{ clickable: true, el: ".swiper-pagination" }}
          breakpoints={{
            768: { slidesPerView: 1 },
            992: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {team.map((member, index) => (
            <SwiperSlide key={index}>
              <div className="team-one__single">
                <div className="team-one__img">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-one__content">
                  <h3 className="team-one__title">
                    <a href="team-details.html">{member.name}</a>
                  </h3>
                  <p className="team-one__sub-title">{member.title}</p>
                  <p>{member.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Swiper Pagination */}
        <div className="swiper-pagination"></div>
      </div>
    </section>
  );
};

export default Testimonials;
