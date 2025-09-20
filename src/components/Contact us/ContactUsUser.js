// ContactUs.jsx
import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, MessageCircle } from "lucide-react";
import './ContactUsUser.scss';
import { useBetween } from "use-between";
import { useSelector } from "react-redux";

const ContactUsUser = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [error, setError] = useState('');

    const state = useSelector((state) => state.data);
  const {serverUrl } = useBetween(state.useShareState);

  const handleChange = (e) => {setFormData({ ...formData, [e.target.name]: e.target.value }) ; setError('')};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.phone || !formData.message)
    {
      setError('Please enter all the fields *')
      return;
    }
    try {
      const res = await axios.post(`${serverUrl}/api/contactUs`, formData);
      alert(res.data.message);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      alert("Failed to send message");
    }
  };

  return (
    <div className="contact-us">
      <div className="header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
          alt="Contact Us"
          className="header-img"
        />
        <h1>Contact Us</h1>
        <p>Have questions or suggestions? Feel free to reach out. We’d love to hear from you!</p>
      </div>

      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="error" style={{color:'red'}}>{error}</div>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          <textarea name="message" rows="5" placeholder="Your Message" value={formData.message} onChange={handleChange}></textarea>
          <button type="submit">Send Message</button>
        </form>

        <div className="contact-info">
          <a href="mailto:info@example.com">
            <Mail className="icon" />
            <span>info@example.com</span>
          </a>
          <a href="tel:+971500000000">
            <Phone className="icon" />
            <span>+971 50 000 0000</span>
          </a>
          <a href="https://wa.me/971500000000" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="icon" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUsUser;
