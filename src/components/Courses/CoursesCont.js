import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useBetween } from "use-between";
import axios from "axios";
import "./CoursesCont.scss";
import Delete from "./Delete";
import { useWatch } from "./Watch";
import ModalMessage from "./AlertModal/ModalMessage";
import CourseDetailsModal from "./CourseDetailsModal"; // ✅ استدعاء مودال التفاصيل
import { useLocation } from "react-router-dom";

const CoursesContaner = ({ type = "all" }) => {
  const state = useSelector((state) => state.data);
  const {
    courses,
    userDetails,
    admin,
    setCourseDetails,
    setEditOrAdd,
    reload,
    setReload,
    setLoading, showDetails, setShowDetails, selectedCourse, setSelectedCourse
  } = useBetween(state.useShareState);

  const [indexDelete, setIndexDelete] = useState(-1);
  const { handleWatch, showModal, setShowModal, modalMsg, modalTitle, setModalMsg } = useWatch();

  const location = useLocation();
  
  const openDetails = (course) => {

    setSelectedCourse(course);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setSelectedCourse(null);
    setShowDetails(false);
  };

  const deleteCourse = (index) => {
    setLoading(true);
    const CourseToDelete = courses[index]._id;
    axios
      .delete(`http://localhost:5000/api/courses/${CourseToDelete}`)
      .then(() => {
        setReload(!reload);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error deleting Course:", error);
      });
  };

  const editCourse = (index) => {
    const CourseToEdit = courses[index];
    if (CourseToEdit) {
      setEditOrAdd("Edit");
      setCourseDetails({ ...CourseToEdit, id: CourseToEdit._id });
    }
  };


  const handleCheckout = async (courseName, price, courseId) => {

    if (!userDetails.id) {
      setModalMsg('Please log in to book and watch the videos')
      setShowModal(true);
      return;

    }

    try {
      const res = await axios.post("http://localhost:5000/api/payments/create-checkout-session", {
        courseName,
        price,
        courseId,
        userName: userDetails.name
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Error creating checkout session:", err);
    }

  };

  const playCoursesList = () => {

    const displayedCourses =
      type === "recommended"
        ? courses.filter((course) => course.recommended)
        : courses;
    if (displayedCourses.length === 0) return <p className="NoCourses">No courses available.</p>;

    return displayedCourses.map((item, index) => {

      const isAlreadyBooked = userDetails.courses.some((c) => c._id === item._id);

      return (
        <div
          className="CourseItem"
          key={item._id || index}
          onClick={() => openDetails(item)} // ✅ فتح مودال التفاصيل عند الضغط على الكرت
          style={{ cursor: "pointer" }}
        >
          <div className="imageWrapper">
            <img src={item.img} alt="Course" />
            <span className="particNum">
              <i className="fas fa-user"></i> {Math.ceil(item.bookedUsers.length/2)}
            </span>
          </div>
          <div className="details">
            <div className="bottomRow">
              <div className="price">{item.price} $</div>
              {userDetails.email === admin.email && type !== "recommended" && (
                <div
                  className="icons "
                  onClick={(e) => e.stopPropagation()} // ✅ منع فتح المودال عند ضغط الأيقونات
                >

                  <i
                    className="fas fa-edit"
                    onClick={() => editCourse(index)}
                    title="Edit"
                  ></i>
                  <i
                    className="fas fa-trash"
                    onClick={() => setIndexDelete(index)}
                    title="Delete"
                  ></i>
                </div>
              )}
            </div>
            <div className="name">{item.name}</div>
            <div className="date">
              <span><i className="fas fa-calendar-alt"></i>{" "}{item.date} </span>
              <span ><i className="fas fa-clock"></i> {" "} {`(${item.time}) - (${item.endtime})`}</span>

            </div>
            <div className="description">{item.description}</div>

            {isAlreadyBooked || userDetails.email == admin.email ? (
              <button
                className="courseBtn"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ منع فتح المودال عند الضغط على الزر
                  const now = new Date();

                  // نحول تاريخ الكورس لشيء نقدر نركب عليه الوقت
                  const courseDate = new Date(item.date);

                  // نركب وقت النهاية
                  const [endHour, endMinute] = item.endtime.split(":");
                  const endDateTime = new Date(courseDate);
                  endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

                  // الشرط
                
                  if (now > endDateTime) {
                    openDetails(item);


                  } else {
                    handleWatch(item);
                  }

                }}
              >
                Join
              </button>
            ) : (
              <button
                className="courseBtn"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ منع فتح المودال عند الضغط على الزر
                  handleCheckout(item.name, item.price, item._id);
                }}
              >
                Book
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="itemsContaner">

      <div className="mainContaner">
        {Array.isArray(courses) ? (
          playCoursesList()
        ) : (
          <p className="NoCourses">Loading...</p>
        )}
      </div>


      <Delete index={indexDelete} setIndexDelete={setIndexDelete} onDelete={deleteCourse} />

      <ModalMessage
        show={showModal}
        onClose={() => setShowModal(false)}
        message={modalMsg}
        title={modalTitle}

      />

      {/* ✅ مودال التفاصيل */}
      <CourseDetailsModal
        show={showDetails}
        onClose={closeDetails}
        course={selectedCourse}
        userDetails={userDetails}
        onBook={handleCheckout}
        onWatch={handleWatch}
      />
    </div>
  );
};

export default CoursesContaner;
