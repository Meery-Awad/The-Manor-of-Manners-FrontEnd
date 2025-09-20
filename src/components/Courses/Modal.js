import React, { useEffect, useRef, useState } from "react";
import './Modal.scss';
import { useSelector } from "react-redux";
import { useBetween } from "use-between";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import noPhoto from '../../images/noPhoto.png'

const CourseModal = () => {
  const state = useSelector((state) => state.data);
  const {
    userDetails,
    courseDetails,
    setCourseDetails,
    editOrAdd,
    admin,
    loading,
    setLoading,
    reload,
    setReload,
    setEditOrAdd,
    serverUrl
  } = useBetween(state.useShareState);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const errorRef = useRef(null);

  const { name, description, date, time, endtime, img, price, recommended, categories: selectedCategories = [] } = courseDetails;

  // مصفوفة التصنيفات
  const categories = [
    { id: 0, level: 'Kids', icon: '', color: 'blue' },
    { id: 1, level: 'Adults', icon: '', color: 'green' },
    { id: 2, level: 'Girls', icon: '', color: 'pink' },
    { id: 3, level: 'Important figures', icon: '', color: 'gold' }
  ];

  const initCourseModal = () => {
    setCourseDetails({
      name: '',
      description: '',
      date: '',
      time: '', // 👈 حقل الوقت
      endtime: '',
      img: null,
      price: 0,
      recommended: false,
      categories: [],
      bookedUsers: [],
      joinedUsers: [],

    });
    setError(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseDetails((prev) => ({ ...prev, img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCourseDetails((prev) => ({ ...prev, [name]: value }));
    setError(false);
  };


  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    if (selected && !selectedCategories.includes(selected)) {
      setCourseDetails((prev) => ({
        ...prev,
        categories: [...prev.categories, selected]
      }));
    }
  };

  // حذف تصنيف
  const removeCategory = (cat) => {
    setCourseDetails((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat)
    }));
  };

  const handleCheckboxChange = () => {
    setCourseDetails((prev) => ({ ...prev, recommended: !recommended }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !date || !time || !endtime || selectedCategories.length === 0) {
      setError(true);
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      return;
    }

    const headers = { "Content-Type": "application/json;charset=UTF-8" };
    setLoading(true);
    const [year, month, day] = courseDetails.date.split("-");
    const formattedValue = `${day}/${month}/${year}`;

    // let courseData = {
    //   ...courseDetails,
    //   date: formattedValue
    // };

    const id = courseDetails.id;
    if (editOrAdd === 'Add') {
      const courseData = {
        ...courseDetails,
        img: courseDetails.img || noPhoto
      };
      setLoading(true);
      axios.post(`${serverUrl}/api/courses`, courseData, { headers })
        .then((res) => {
          console.log("Course added:", res.data);
          setModalIsOpen(false);
          initCourseModal();
          setLoading(false);
          setReload(!reload);

        })
        .catch((err) => {
          console.error("Error adding course:", err);
          setLoading(false);
        });
    } else {
      axios.put(`${serverUrl}/api/courses/${id}`, courseDetails, { headers })
        .then((res) => {
          console.log("Course updated:", res.data);
          setModalIsOpen(false);
          initCourseModal();
          setLoading(false);
          setReload(!reload);
        })
        .catch((err) => {
          console.error("Error updating course:", err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (courseDetails.name !== '') {
      setModalIsOpen(true);
    }
  }, [courseDetails]);

  return (
    <div className="Courses">
      {userDetails.email === admin.email && (
        <button
          className="Btn"
          onClick={() => {
            initCourseModal();
            setModalIsOpen(true);
            setEditOrAdd('Add');
          }}
        >
          <i className="fas fa-plus"></i>
        </button>
      )}

      <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} className="Model">
        <Modal.Body ref={errorRef}>
          <form className="Form" onSubmit={handleSubmit}>
            {error && <p className="error">Please fill out all required fields (*)</p>}

            <div>
              <label className="lable">Course Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label className="lable">Course Price <span className="required">*</span></label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                placeholder="Course Price"
                required
              />
            </div>

            <div>
              <label className="lable">Course Description <span className="required">*</span></label>
              <textarea
                name="description"
                value={description}
                onChange={handleChange}
                placeholder="Enter description"
                rows="3"
                required
              ></textarea>
            </div>

            <div>
              <label className="lable">Course Date <span className="required">*</span></label>
              <input
                type="date"
                name="date"
                value={date}
                onChange={handleChange}
                className="form-control mb-2"
              />
            </div>

            <div>
              <label className="lable">Course Time <span className="required">*</span></label>
              <p>from</p>
              <input
                type="time"
                name="time"
                value={time || ""}
                onChange={(e) => setCourseDetails(prev => ({ ...prev, time: e.target.value }))}
                className="form-control mb-2"
              />
              <p>to</p>
              <input
                type="time"
                name="endtime"
                value={endtime || ""}
                onChange={(e) => setCourseDetails(prev => ({ ...prev, endtime: e.target.value }))}
                className="form-control mb-2"
              />
            </div>

            {/* Dropdown للتصنيفات المتعددة */}
            <div>
              <label className="lable">Categories <span className="required">*</span></label>
              <select
                onChange={handleCategoryChange}
                className="form-control mb-2"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.level}>
                    {cat.level}
                  </option>
                ))}
              </select>

              {/* عرض التصنيفات المختارة */}
              <div className="selected-categories">
                {selectedCategories.map((cat) => (
                  <span key={cat} className="tag">
                    {cat}
                    <button type="button" onClick={() => removeCategory(cat)}>x</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="lable">Upload Image <span className="description">(optional)</span></label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {img && (
                <div className="img">
                  <img src={img} alt="Preview" />
                </div>
              )}
            </div>

            <div className="checkBox">
              <input type="checkbox" checked={recommended} onChange={handleCheckboxChange} />
              <label className="lable"> Recommended</label>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer dir="auto">

          <Button
            variant="secondary"
            onClick={() => {
              initCourseModal();
              setModalIsOpen(false);
            }}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editOrAdd}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseModal;
