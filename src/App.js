
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import './App.scss';

import Header from './components/Header/Header';
import VideoCall from "./components/VideoCallPage/VideoCallPage";
import LoginPage from "./components/LogIn/Login";
import Home from "./components/Home/Home";
import CoursesPage from "./components/Courses/CoursesPage";
import Profile from "./components/Profile/Profile";
import SuccessPayment from "./components/Courses/SuccessPayment";
import Loading from "./components/Loading/Loading";
import AboutUs from "./components/About us/AboutUs";
import ContactUs from "./components/Contact us/ContactUs";

function App() {

  return (

    <div className="App">

      <Router>
        <Header />
        <Loading/>
        <Routes>

          <Route path="/" element={<Navigate replace to='/Home' />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Courses" element={<CoursesPage />} />
          <Route path="/VideoCall/:courseId" element={<VideoCall />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Register" element={<LoginPage />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Success" element={<SuccessPayment />} />
          <Route path="/About us" element ={<AboutUs/>}/>
          <Route path="/Contact us" element={<ContactUs/>}/>
          {/* other rotes  */}

        </Routes>

        {/* <Footer /> */}
      </Router>

    </div >
  );
}

export default App;
