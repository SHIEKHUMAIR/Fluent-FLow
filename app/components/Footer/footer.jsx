import React from 'react'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__shape-1 float-bob-y">
        <img src="#" alt="" />
      </div>
      <div className="site-footer__top">
        <div className="container mx-auto">
          <div className="site-footer__top-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="footer-widget__column footer-widget__about wow fadeInUp" data-wow-delay="100ms">
                <div className="footer-widget__logo">
                  <a href="/"><img src="assets/logo/ktk-logo-v2.png" alt="" className="h-[110px] w-[200px]" /></a>
                </div>
                <p className="footer-widget__about-text">It is a long established fact that a reader Empowering Communities</p>
                <ul className="footer-widget__about-contact list-unstyled">
                  <li>
                    <div className="icon">
                      <span className="icon-envolop email-icon"></span>
                    </div>
                    <p><a href="mailto:debra.holt@example.com">debra.holt@example.com</a></p>
                  </li>
                  <li>
                    <div className="icon">
                      <span className="icon-location location-icon"></span>
                    </div>
                    <p>3891 Ranchview Dr. Richardson</p>
                  </li>
                  <li>
                    <div className="icon">
                      <span className="icon-call phone-call"></span>
                    </div>
                    <p><a href="tel:0192584341342">0192584341342</a></p>
                  </li>
                </ul>
              </div>
              <div className="footer-widget__column footer-widget__company wow fadeInUp" data-wow-delay="200ms">
                <div className="footer-widget__title-box">
                  <h3 className="footer-widget__title">About Company</h3>
                </div>
                <ul className="footer-widget__company-list list-unstyled">
                  <li>
                    <a href="about.html">About Us</a>
                  </li>
                  <li>
                    <a href="faq.html">FAQ</a>
                  </li>
                  <li>
                    <a href="testimonials.html">Testimonial</a>
                  </li>
                  <li>
                    <a href="services.html">Service</a>
                  </li>
                  <li>
                    <a href="blog.html">Blog And News</a>
                  </li>
                </ul>
              </div>
              <div className="footer-widget__column footer-widget__services wow fadeInUp" data-wow-delay="300ms">
                <div className="footer-widget__title-box">
                  <h3 className="footer-widget__title">Services</h3>
                </div>
                <ul className="footer-widget__services-list list-unstyled">
                  <li>
                    <a href="express-freight-solutions.html"><span className="icon-angle-left"></span>Express Freight Solutions</a>
                  </li>
                  <li>
                    <a href="speedy-dispatch.html"><span className="icon-angle-left"></span>Rapid Delivery Services</a>
                  </li>
                  <li>
                    <a href="speedy-dispatch.html"><span className="icon-angle-left"></span>Speedy Haulage</a>
                  </li>
                  <li>
                    <a href="swift-supply-chain.html"><span className="icon-angle-left"></span>Reliable Transporters</a>
                  </li>
                  <li>
                    <a href="swift-supply-chain.html"><span className="icon-angle-left"></span>Swift Ship Solutions</a>
                  </li>
                </ul>
              </div>
              <div className="footer-widget__column footer-widget__newsletter wow fadeInUp" data-wow-delay="400ms">
                <div className="footer-widget__title-box">
                  <h3 className="footer-widget__title">Newsletter</h3>
                </div>
                <p className="footer-widget__newsletter-text">Financial planners help people to gain knowledge about</p>
                <form className="footer-widget__newsletter-form mc-form" data-url="MC_FORM_URL" noValidate>
                  <div className="footer-widget__newsletter-form-input-box">
                    <input type="email" placeholder="Your e-mail" name="EMAIL" className="border rounded p-2" />
                    <button type="submit" className="footer-widget__newsletter-btn"><span className="icon-paper-plane"></span></button>
                  </div>
                </form>
                <div className="mc-form__response"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <div className="container mx-auto">
          <div className="site-footer__bottom-inner">
            <p className="site-footer__bottom-text">© themehealer 2024 | All Rights Reserved</p>
            <ul className="list-unstyled site-footer__bottom-menu">
              <li><a href="about.html">Terms & Conditions</a></li>
              <li><a href="about.html">Privacy Policy</a></li>
              <li><a href="contact.html">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
