import React, { useRef, useEffect, useState } from "react";
import { joinCallHandler, leaveCallHandler } from "./videoCallUtils";
import axios from "axios";
import "./JoinLeaveButtons.scss";
import { useBetween } from "use-between";
import { useSelector } from "react-redux";
import RecordingControls from "./RecordingVideo";

const JoinLeaveButtons = ({ joined, setJoined, localTracks, setLocalTracks, course, userDetails, admin, usersMap, setUsersMap }) => {
  const localTracksRef = useRef([]);
  const state = useSelector((state) => state.data);
  const { setUserDetails, serverUrl } = useBetween(state.useShareState);
  const [joinWithMic, setJoinWithMic] = useState(true);
  const [joinWithCam, setJoinWithCam] = useState(true);
  const leavingRef = useRef(false);
  

  useEffect(() => {
    // 👇 يطلع على أعلى الصفحة عند أول تحميل
    window.scrollTo(0, 0);
  }, []);

  const cleanup = async () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    await leaveCallHandler(localTracksRef, course, userDetails, setJoined);
    leavingRef.current = false;
  };

  const handleJoinClick = async () => {

    try {
      await axios.post(`${serverUrl}/api/courses/${course._id}/join`, {
        userId: userDetails.id || userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
      });
    } catch (err) {
      console.error("Error joining course:", err);
    }
    try {
      
      const response = await axios.post(`${serverUrl}/api/payments/UserCoursesStatus`, {
        userId: userDetails.id|| userDetails._id,
        courseId: course._id,
        key: "2",
      });

      const { course1 } = response.data;
      if (course1) {
        setUserDetails((prev) => ({
          ...prev,
          courses: [...prev.courses, { ...course1, status: "watched" }],
        }));
      }
      await joinCallHandler(
        course,
        userDetails,
        admin,
        setJoined,
        setLocalTracks,
        usersMap,
        setUsersMap,
        localTracksRef,
        { mic: joinWithMic, cam: joinWithCam }
      );
    } catch (err) {
      console.error("Error adding course:", err);
    }
  };

  const handleLeaveClick = async () => {
    await cleanup();
  };

  useEffect(() => {
    const handleUnload = () => cleanup();
    window.addEventListener("beforeunload", handleUnload);
    return () => {
     
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [course, userDetails]);

  return (
    <div className="btn-wrapper">
      {!joined ? (
        <>
          <button type="button" className="join-btn" onClick={handleJoinClick}>
            Watch Video
          </button>
          <div className="pre-join-options">
            <label>
              <input
                type="checkbox"
                checked={joinWithMic}
                onChange={() => setJoinWithMic(!joinWithMic)}
              />
              {joinWithMic ? (
                <i className="fa-solid fa-microphone"></i>
              ) : (
                <i className="fa-solid fa-microphone-slash"></i>
              )}{" "}
              Join with Microphone
            </label>
            <label>
              <input
                type="checkbox"
                checked={joinWithCam}
                onChange={() => setJoinWithCam(!joinWithCam)}
              />
              {joinWithCam ? (
                <i className="fa-solid fa-video"></i>
              ) : (
                <i className="fa-solid fa-video-slash"></i>
              )}{" "}
              Join with Camera
            </label>
          </div>
        </>
      ) : (
        <div className="btn">
          <button type="button" className="leave-btn" onClick={handleLeaveClick}>
            Leave Video
          </button>
          <RecordingControls userDetails={userDetails} admin={admin} course={course} />
        </div>
      )}
    </div>
  );
};

export default JoinLeaveButtons;
