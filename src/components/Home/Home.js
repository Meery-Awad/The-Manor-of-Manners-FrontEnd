
import './Home.scss'
import Slider from "./Slider";
import CoursesContaner from '../Courses/CoursesCont';

const Home = () => {

  return (
    <div className="Home">
      <Slider />
      <div className='recommended'>
        <p className="topic">Recommended</p>
        <div className="line-container">
          <span className="line"></span>
          <i className="fas fa-star"></i>
        </div>
        <div className='noti'>Please be advised that once the payment for the course has been completed, cancellations and refunds are not permitted.</div>
     
       <CoursesContaner type="recommended" />
      </div>

    </div>
  );
};

export default Home;
