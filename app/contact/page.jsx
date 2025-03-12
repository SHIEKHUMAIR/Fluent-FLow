import React from 'react'
import FaqSection from '../components/Contact/faqSection'

const page = () => {
  return (
    <>
     <section className="contact-one">
      <div className="container mx-auto px-4">
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">Contact us</span>
          </div>
          <h2 className="section-title__title">Get in Touch With Us</h2>
        </div>
        <div className="contact-one__inner">
        <ul className="contact-one__contact-list list-none grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <li className="flex items-start space-x-4 p-4 rounded-lg">
    <div className="icon">
      <span className="icon-call"></span>
    </div>
    <div className="content">
      <h3 className="text-lg font-semibold">Let's Talk</h3>
      <p>
        Phone number: <a href="tel:32566800890" className="text-blue-500">+32566 - 800 - 890</a>
      </p>
      <p>
        Fax: <a href="tel:123458963007" className="text-blue-500">1234 - 58963 - 007</a>
      </p>
    </div>
  </li>

  <li className="flex items-start space-x-4 p-4 rounded-lg">
    <div className="icon">
      <span className="icon-location"></span>
    </div>
    <div className="content">
      <h3 className="text-lg font-semibold">Address</h3>
      <p>Dhaka 102, 8000 Sent Behavior <br /> Road 45, House of Street</p>
    </div>
  </li>

  <li className="flex items-start space-x-4 p-4rounded-lg">
    <div className="icon">
      <span className="icon-envelope"></span>
    </div>
    <div className="content">
      <h3 className="text-lg font-semibold">Send us an Email</h3>
      <p>
        <a href="mailto:nafizislam1223@gmail.com" className="text-blue-500">nafizislam1223@gmail.com</a>
      </p>
      <p>
        <a href="mailto:demo23@gmail.com" className="text-blue-500">demo23@gmail.com</a>
      </p>
    </div>
  </li>
</ul>

        </div>
      </div>
    </section>

    <FaqSection />
    </>
  )
}

export default page
