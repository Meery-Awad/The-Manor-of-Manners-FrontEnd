import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import './CourseDetailsModal.scss'
import { useEffect, useState } from "react";


const CourseDetailsModal = ({ show, onClose, course, onWatch, onBook, userDetails }) => {
    const [booked, setBokeed] = useState(false)

    useEffect(() => {

        if (course) {
           
            const isAlreadyBooked = userDetails.courses.some((c) => c._id === course._id);
            setBokeed(isAlreadyBooked);
        }
    }, [course])

    if (!course) return null;

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header >
                <Modal.Title>{course.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="course-details-modal">
                    {course.link ? <video
                        src={course.link}
                        controls
                    />
                        :
                        <div>
                            <p >This course has not been recordedd</p>
                            <img
                                src={course.img}
                                alt={course.name}

                            />
                        </div>
                    }

                    {booked && (
                        <p className="booked-label"><i className="fas fa-check"></i> Booked</p>
                    )}

                    <p><strong>Course Price:</strong> {course.price} $</p>
                    <p className="mt-3"><strong>Course Date:</strong> {course.date} / {`(${course.time}) - (${course.endtime})`}</p>
                    {/* <p><strong>Registered Users:</strong> {course.bookedUsers.length}</p> */}
                    <p><strong>Course Description:</strong> {course.description}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                {booked ? (
                    // <Button variant="primary" onClick={() => onWatch(course)}>
                    //     Watch
                    // </Button>
                    <div></div>
                ) : (
                    <Button variant="primary" onClick={() => onBook(course.name, course.price, course._id)}>
                        Book
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default CourseDetailsModal;
