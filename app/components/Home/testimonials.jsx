"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import teamData from "@/data/teamData.json"; // Import JSON directly

const Testimonials = () => {
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
              Simplifying Your Logistics <br /> Challenges
            </h2>
          </div>

          {/* Swiper Navigation Buttons */}
          <div className="team-one__nav flex space-x-4">
            <button className="swiper-button-prev custom-nav">
              <i className="icon-arrow-left"></i>
            </button>
            <button className="swiper-button-next custom-nav">
              <i className="icon-arrow-right"></i>
            </button>
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
          {teamData.map((member) => (
            <SwiperSlide key={member.id}>
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

      {/* Custom Styling for Swiper Navigation */}
      <style jsx>{`
        .custom-nav {
          background-color: #c11425;
          color: white;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 5px;
          transition: 0.3s ease;
        }
        .custom-nav:hover {
          background-color: #a10f1e;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
