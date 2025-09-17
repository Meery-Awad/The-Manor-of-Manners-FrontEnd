import React, { useEffect } from "react";
import './AboutUs.scss';
import teacherImg from "../../images/1.jpg";

const AboutUs = () => {
    useEffect(() => {
        const elements = document.querySelectorAll("[data-animate]");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(entry.target.dataset.animate);
                    }
                });
            },
            { threshold: 0.2 }
        );
        elements.forEach(el => observer.observe(el));
    }, []);

    return (
        <div className="about-us">
            <div className="container">
                <h1>About Us</h1>
                <div className="content">
                    <div className="image" data-animate="slide-left">
                        <img src={teacherImg} alt="Ms. Julie" />
                    </div>
                    <div className="text" data-animate="slide-right">
                        <p>
                            We offer online etiquette lessons for people of all ages and backgrounds, taught by an experienced instructor.
                        </p>
                        <p>
                            Our courses cover a variety of styles and approaches at affordable prices, making it easy for everyone to learn.
                        </p>
                        <p>
                            In addition, we provide some free videos shared by Ms. Julie to give everyone a chance to practice proper etiquette.
                        </p>
                        <div>if u are in the brea</div>

                    </div>
                </div>
            </div>
       
        </div>
    );
};

export default AboutUs;
