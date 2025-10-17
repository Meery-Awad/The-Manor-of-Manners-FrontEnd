// ContactUs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, MessageCircle } from "lucide-react";
import './ContactUsUser.scss';
import { useBetween } from "use-between";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

const ContactUsUser = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const state = useSelector((state) => state.data);
  const { serverUrl, pageDescription, pageKeywords, contactUsKeyWords, websiteTitle } = useBetween(state.useShareState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError('Please enter all the fields *');
      return;
    }
    try {
      await axios.post(`${serverUrl}/api/contactUs`, formData);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      alert(" Failed to send message, please try again");
    }
  };
  const content = "Have questions or suggestions? Feel free to reach out. We’d love to hear from you!";
  return (
    <div className="contact-us">
      <Helmet>
        <title>Contact us | {websiteTitle}</title>
        <link rel="canonical" href="https://madeformanners.com/contact" />
        <meta name="description" content="made for manners contact us +447444617264 hello@madeformanners.com " />
        <meta name="keywords" content={`${pageKeywords} ${contactUsKeyWords} ${content}`} />
        <meta property="og:title" content={`Contact Us - ${websiteTitle}`} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>

      <div className="header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
          alt="Contact Us"
          className="header-img"
        />
        <h1>Contact Us</h1>
        <p>{content}</p>
      </div>

      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="error" style={{ color: 'red' }}>{error}</div>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          <textarea name="message" rows="5" placeholder="Your Message" value={formData.message} onChange={handleChange}></textarea>
          <button type="submit">Send Message</button>
        </form>

        <div className="contact-info">
          <a href="mailto:hello@madeformanners.com">
            <Mail className="icon" />
            <span>hello@madeformanners.com</span>
          </a>
          <a href="tel:+447444617264">
            <Phone className="icon" />
            <span>+44 7444 617264</span>
          </a>
          <a href="https://wa.me/447444617264" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="icon" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUsUser;
