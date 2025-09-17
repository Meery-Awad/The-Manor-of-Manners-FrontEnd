import { useEffect, useState } from "react";
import axios from 'axios';

const reminders = (state = [], action) => {

    const useShareState = () => {

        const [editOrAdd, setEditOrAdd] = useState('Add')
        const [courses, setCourses] = useState([])
        const [allCourses, setAllCourses] = useState([])
        const [Loading, setLoading] = useState(false);
        const [reload, setReload] = useState(false);
        const courseValid ='Please note that the course will be available to watch for only one week after the course date'
        
        const [userDetails, setUserDetails] = useState(() => {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : {
                id: '', name: '', email: '', password: '', confirmPassword: '', img: '', courses: [] 
            };
        });
        const [updatedData, setUpdatedData]= useState(userDetails);
        console.log(updatedData)
      
        
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
                    const { data } = await axios.get("http://localhost:5000/api/courses");
                    console.log(data)
                    setCourses(data);
                    setAllCourses(data)
                    setLoading(false)
                } catch (error) {
                    console.log(error);
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
            showDetails,setShowDetails,
            updatedData, setUpdatedData,
            courseValid
        };
    };

    const data = {
        useShareState,
    };

    return data;
};

export default reminders;
