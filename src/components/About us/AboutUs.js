import React, { useEffect } from "react";
import './AboutUs.scss';
import teacherImg from "../../images/1.jpg";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useBetween } from "use-between";

const AboutUs = () => {
    const state = useSelector((state) => state.data);
    const { serverUrl, pageDescription, pageKeywords } = useBetween(state.useShareState);
    useEffect(() => {
        window.scrollTo(0, 0);
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
            <Helmet>
                <title>The Manor of Manners</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={pageKeywords} />
                <meta property="og:title" content="About Us - The Manor of Manners" />
                <meta property="og:description" content={pageDescription} />
            </Helmet>

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
                            Our courses cover a variety of styles and approaches at affordable prices, making it easy for everyone to learn proper manners.
                        </p>
                        <p>
                            In addition, we provide free videos shared by Ms. Julie to give everyone a chance to practice proper etiquette.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
