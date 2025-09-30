import { useEffect, useState } from "react";
import axios from 'axios';


const reminders = (state = [], action) => {

    const useShareState = () => {

        const [editOrAdd, setEditOrAdd] = useState('Add')
        const [courses, setCourses] = useState([])
        const [allCourses, setAllCourses] = useState([])
        const [Loading, setLoading] = useState(false);
        const [reload, setReload] = useState(false);

        //  const serverUrl = 'http://localhost:5000'
        const serverUrl = 'https://the-manor-of-manners-backend-7pw8.onrender.com'
        const courseValid = 'Please note that the course will be available to watch for only one week after the course date'
        const pageDescription = "Explore online etiquette courses at The Manor of Manners. Learn social skills, professional behavior, and proper manners through interactive video lessons and expert guidance.";
        const pageKeywords = "online etiquette courses, manners training, social skills, professional behavior, The Manor of Manners, online learning, etiquette lessons";

        const [userDetails, setUserDetails] = useState(() => {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : {
                id: '', name: '', email: '', password: '', confirmPassword: '', img: '', courses: []
            };
        });


        const [updatedData, setUpdatedData] = useState(userDetails);

        const [selectedCourse, setSelectedCourse] = useState(0); // ✅ تخزين الكورس المحدد
        const [showDetails, setShowDetails] = useState(false);
        const color = '#817f7fff'
        const categories = [
            {
                id: 0,
                level: 'Kids',
                icon: '',
                color: color
            },
            {
                id: 1,
                level: 'Adults',
                icon: '',
                color: color,
            },
            {
                id: 2,
                level: 'Girls',
                icon: '',
                color: color,
            },
            {
                id: 3,
                level: 'Important figures',
                icon: '',
                color: color,
            }
        ]
        const [courseDetails, setCourseDetails] = useState({
            id: '',
            name: '',
            description: '',
            date: '',
            time: '',
            price: Number,
            recommended: false,
            img: null,
            categories: [],
            bookedUsers: [],
            joinedUsers: [],

        })
        const admin = { email: 'iuliana.esanu28@gmail.com', passport: 'julia12345' };

        useEffect(() => {
            setLoading(true)
            const CoursesData = async () => {
                try {
                    const { data } = await axios.get(`${serverUrl}/api/courses`);
                    setCourses(data);
                    setAllCourses(data)
                    setLoading(false)
                } catch (error) {
                    alert("Error loading the page, please try again");
                }
            };

            CoursesData();
        }, [reload]);

        useEffect(() => {
            localStorage.setItem("user", JSON.stringify(userDetails));
        }, [userDetails]);


        return {
            userDetails, setUserDetails,
            admin,
            courses, setCourses,
            courseDetails, setCourseDetails,
            editOrAdd, setEditOrAdd,
            Loading, setLoading,
            reload, setReload,
            categories,
            allCourses,
            selectedCourse, setSelectedCourse,
            showDetails, setShowDetails,
            updatedData, setUpdatedData,
            courseValid,
            serverUrl,
            pageDescription, pageKeywords,

        };
    };

    const data = {
        useShareState,
    };

    return data;
};

export default reminders;
