import './Home.scss'
import Slider from "./Slider";
import CoursesContaner from '../Courses/CoursesCont';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux';
import { useBetween } from 'use-between';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const state = useSelector((state) => state.data);
  const {
   pageDescription, pageKeywords
  } = useBetween(state.useShareState);

  
  return (
    <div className="Home">
      <Helmet>
        <title>The Manor of Manners</title>
        <meta name="description" content={pageDescription}/>
        <meta name="keywords" content={pageKeywords}/>
        <meta property="og:title" content="Home - The Manor of Manners" />
        <meta property="og:description" content={pageDescription} />
      </Helmet>

      <Slider />
      <div className='recommended'>
        <p className="topic">Recommended</p>
        <div className="line-container">
          <span className="line"></span>
          <i className="fas fa-star"></i>
        </div>
        <NavLink className='all-courses' to='/Courses'>all courses</NavLink>
        <div className='noti'>Please be advised that once the payment for the course has been completed, cancellations and refunds are not permitted.</div>

        <CoursesContaner type="recommended" />
      </div>
    </div>
  );
};

export default Home;
