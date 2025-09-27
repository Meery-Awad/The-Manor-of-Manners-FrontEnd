import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { useSelector } from "react-redux";
import { useBetween } from "use-between";
import ProfileModal from "./ProfileModal";
import { useWatch } from "../Courses/Watch";
import ModalMessage from "../Courses/AlertModal/ModalMessage";
import CourseDetailsModal from '../Courses/CourseDetailsModal'

const Profile = () => {
  const state = useSelector((state) => state.data);
  const { userDetails, setUserDetails, showDetails, setShowDetails, selectedCourse, setSelectedCourse, courseValid, setUpdatedData } = useBetween(state.useShareState);
  const { name, img, courses, email } = userDetails;
  const [watchedCourseLeng, setWatchedCourseLeng] = useState(0);
  const [bookedCourseLeng, setBookedCourseLeng] = useState(0)

  const [activeTab, setActiveTab] = useState("watched");
  const [watchedCourses, setWatchedCourses] = useState([]);
  const [bookingCourses, setBookingCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { handleWatch, showModal, setShowModal, modalMsg } = useWatch();

  const closeDetails = () => {
    setSelectedCourse(null);
    setShowDetails(false);
  };
  useEffect(() => {

    if (courses && courses.length > 0) {

      const watched = courses.filter((course) => course.status === "watched" && course.link);
      setWatchedCourses(watched);
      setBookingCourses(courses);
    }
  }, [userDetails]);
  useEffect(() => {
    if (watchedCourses) {
      setWatchedCourseLeng(
        [...new Map(watchedCourses.map((c) => [c._id, c])).values()].length
      );
    }
  }, [watchedCourses]);

  useEffect(() => {
    if (bookingCourses) {
      setBookedCourseLeng(
        [...new Map(bookingCourses.map((c) => [c._id, c])).values()].length
      );
    }
  }, [bookingCourses]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const renderVideos = (coursesArray) => {
    const uniqueCourses = [
      ...new Map(coursesArray.map((c) => [c._id, c])).values(),
    ];


    return (
      <div className="VideosGrid">
        {uniqueCourses.length ? (
          uniqueCourses.map((courseItem) => (
            <div key={courseItem._id} className="VideoCard"
              onClick={() => { setSelectedCourse(courseItem); setShowDetails(true) }}>
              <img src={courseItem.img} alt={courseItem.name} />
              <h3>
                {courseItem.name}
                {/* <button onClick={(e) => {
                  e.stopPropagation();
                  handleWatch(courseItem);
                }} >watch</button> */}
              </h3>
            </div>
          ))
        ) : (
          <div className="NoCourses">No Courses Yet!!</div>
        )}
      </div>
    );
  };

  return (
    <div className="ProfilePage">
      <div className="ProfileHeader">
        <img src={img} alt="Profile" />
        <div className="info">
          <h2>{name}</h2>
          <i>{email}</i>
        </div>
        <button className="edit-btn" onClick={() => setModalOpen(true)}>
          <i className="fas fa-pen"></i>
        </button>
      </div>

      <div className="TabsList">
        <button
          className={activeTab === "watched" ? "active" : ""}
          onClick={() => setActiveTab("watched")}
        >
          <i className="fas fa-check"></i> Videos to watch({watchedCourseLeng})
        </button>
        <button
          className={activeTab === "registered" ? "active" : ""}
          onClick={() => setActiveTab("registered")}
        >
          <i className="fas fa-hourglass-half"></i> Booked Videos ({bookedCourseLeng})
        </button>
      </div>
      <p className='courseValid' style={{ color: 'rgb(243, 98, 98)' }}>{courseValid} </p>
      {activeTab === "watched" && renderVideos(watchedCourses)}
      {activeTab === "registered" && renderVideos(bookingCourses)}

      <ProfileModal
        show={modalOpen}
        handleClose={() => setModalOpen(false)}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        setUpdatedData={setUpdatedData}
      />


      <ModalMessage
        show={showModal}
        onClose={() => setShowModal(false)}
        message={modalMsg}
        title="Course Notice"
      />
      <CourseDetailsModal
        show={showDetails}
        onClose={closeDetails}
        course={selectedCourse}
        userDetails={userDetails}
        onWatch={() => handleWatch(selectedCourse)}
      />
    </div>
  );
};

export default Profile;
