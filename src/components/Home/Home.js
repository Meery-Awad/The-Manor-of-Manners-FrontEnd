import './Home.scss'
import PromoVideo from "./PromoVideo";
import CoursesContaner from '../Courses/CoursesCont';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux';
import { useBetween } from 'use-between';
import image from '../../images/img.jpg'

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const state = useSelector((state) => state.data);
  const { pageDescription, pageKeٍywords, HomePageKeyWords, websiteTitle } = useBetween(state.useShareState);

  const contentPoints = [
    "We offer online etiquette lessons for people of all ages and backgrounds, taught by an experienced instructor.",
    "Our courses cover a variety of styles and approaches at affordable prices, making it easy for everyone to learn proper manners.",
    "In addition, we provide free videos shared by Ms. Julie to give everyone a chance to practice proper etiquette."
  ];

  return (
    <div className="Home">
      <Helmet>
        <link rel="canonical" href="https://madeformanners.com" />
        <title>Home | {websiteTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${pageKeٍywords} ${HomePageKeyWords}}`} />
        <meta property="og:title" content={`Home - ${websiteTitle}`} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>

      <PromoVideo />

      <div className='recommended'>
        <p className="topic">Recommended</p>
        <div className="line-container">
          <span className="line"></span>
          <i className="fas fa-star"></i>
        </div>
        <NavLink className='all-courses' to='/Courses'>all courses</NavLink>
        <div className='noti'>
          Please be advised that once the payment for the course has been completed, cancellations and refunds are not permitted.
        </div>

        <CoursesContaner type="recommended" />
      </div>

      {/* --- What We Offer Section --- */}
      <div className="recommended what-we-offer ">
        <p className="topic">What We Offer</p>
        <div className="line-container">
          <span className="line"></span>
          <i className="fas fa-gem"></i>
        </div>

        <div className="offer-wrapper">
          <div className="offer-image">
            <img src={image} alt="What We Offer" />
          </div>
          <div className="offer-text">
            <ul>
              {contentPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* --- Follow Us Section --- */}
      <div className="recommended follow-us">
        <p className="topic">Follow Us on Social Media</p>
        <div className="line-container">
          <span className="line"></span>
          <i className="fas fa-heart"></i>
        </div>
        <div className="social-icons">
          <a href="https://www.instagram.com/madeformanners/" target="_blank" rel="noopener noreferrer" aria-label="instagram" title='instagram'>
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://x.com/MannersFor79214" target="_blank" rel="noopener noreferrer" aria-label="x-twitter" title='twitter'>
            <i className="fab fa-x-twitter"></i>
          </a>
          <a href="https://www.tiktok.com/@user1742031833181" target="_blank" rel="noopener noreferrer" aria-label="tiktok" title='tiktok'>
            <i className="fab fa-tiktok"></i>
          </a>
          <a href="http://www.linkedin.com/in/made-for-manners" target="_blank" rel="noopener noreferrer" aria-label="linkedin" title='linkedin'>
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

    </div>
  );
};

export default Home;
