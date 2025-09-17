import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import RecordingControls from "./RecordingVideo";

export const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const updateStatusIcons = (uid, type, enabled) => {
  if (type === "audio") {
    const micEl = document.getElementById(`${uid}-mic`);
    if (micEl) micEl.className = enabled ? "fa fa-microphone" : "fa fa-microphone-slash";
  } else if (type === "video") {
    const camEl = document.getElementById(`${uid}-cam`);
    if (camEl) camEl.className = enabled ? "fa fa-video" : "fa fa-video-slash";
  }
};

export const createVideoCard = (uid, username, adminEmail, userEmail = "", controls = false, localTracksRef) => {
  if (document.getElementById(`card-${uid}`))
    return document.getElementById(`video-${uid}`);

  const card = document.createElement("div");
  card.id = `card-${uid}`;
  card.className = userEmail === adminEmail ? "video-card admin-card" : "video-card";

  const label = document.createElement("div");
  label.className = "video-label";
  label.innerText = username || `User ${uid}`;

  const videoBox = document.createElement("div");
  videoBox.id = `video-${uid}`;
  videoBox.className = "video-box";

  card.append(label, videoBox);

  if (controls && localTracksRef) {
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "video-controls";

    const micBtn = document.createElement("button");
    micBtn.style.color = "green";
    micBtn.innerHTML = localTracksRef.current?.[0]?.enabled
      ? '<i class="fa fa-microphone"></i>'
      : '<i class="fa fa-microphone-slash"></i>';
    micBtn.onclick = async () => {
      const micTrack = localTracksRef.current?.[0];
      if (!micTrack) return;
      const enabled = micTrack.enabled;
      await micTrack.setEnabled(!enabled);
      if (!enabled) await client.publish([micTrack]);
      else await client.unpublish([micTrack]);
      micBtn.innerHTML = enabled
        ? '<i class="fa fa-microphone-slash"></i>'
        : '<i class="fa fa-microphone"></i>';
    };

    const camBtn = document.createElement("button");
    camBtn.style.color = "green";
    camBtn.innerHTML = localTracksRef.current?.[1]?.enabled
      ? '<i class="fa fa-video"></i>'
      : '<i class="fa fa-video-slash"></i>';
    camBtn.onclick = async () => {
      const camTrack = localTracksRef.current?.[1];
      if (!camTrack) return;

      const screenTrack = localTracksRef.current?.[2];
      if (screenTrack) {
        await client.unpublish([screenTrack]);
        screenTrack.stop();
        localTracksRef.current[2] = null;
      }

      const enabled = camTrack.enabled;
      await camTrack.setEnabled(!enabled);

      const box = document.getElementById(`video-${uid}`);
      box.innerHTML = "";
      if (!enabled) {
        await client.publish([camTrack]);
        camTrack.play(box);
      } else {
        await client.unpublish([camTrack]);
      }

      camBtn.innerHTML = enabled
        ? '<i class="fa fa-video-slash"></i>'
        : '<i class="fa fa-video"></i>';
    };

    const screenBtn = document.createElement("button");
    screenBtn.style.color = "orange";
    screenBtn.innerHTML = '<i class="fa fa-desktop"></i>';
    screenBtn.onclick = async () => {
      const box = document.getElementById(`video-${uid}`);
      const camTrack = localTracksRef.current?.[1];
      let screenTrack = localTracksRef.current?.[2];

      try {
        if (!screenTrack) {
          screenTrack = await AgoraRTC.createScreenVideoTrack();
          localTracksRef.current[2] = screenTrack;
        }

        if (camTrack && camTrack.enabled) {
          await client.unpublish([camTrack]);
          camTrack.stop();
          await camTrack.setEnabled(false);
        }

        if (screenTrack.playing) {
          await client.unpublish([screenTrack]);
          screenTrack.stop();
        }

        box.innerHTML = "";
        await client.publish([screenTrack]);
        screenTrack.play(box);

        screenTrack.on("track-ended", async () => {
          await client.unpublish([screenTrack]);
          localTracksRef.current[2] = null;
          if (camTrack) {
            await camTrack.setEnabled(true);
            await client.publish([camTrack]);
            camTrack.play(box);
          }
        });
      } catch (err) {
        console.warn("Screen share canceled or denied by user", err);
        localTracksRef.current[2] = null;
        if (camTrack) {
          await camTrack.setEnabled(true);
          await client.publish([camTrack]);
          camTrack.play(box);
        }
      }
    };

    controlsDiv.append(micBtn, camBtn, screenBtn);
    card.append(controlsDiv);
  } else {
    const statusDiv = document.createElement("div");
    statusDiv.className = "video-status";
    const micStatus = document.createElement("i");
    micStatus.id = `${uid}-mic`;
    micStatus.className = "fa fa-microphone-slash";
    const camStatus = document.createElement("i");
    camStatus.id = `${uid}-cam`;
    camStatus.className = "fa fa-video-slash";
    statusDiv.append(micStatus, camStatus);
    card.append(statusDiv);
  }

  const container = document.getElementById("video-container");
  if (!container) return videoBox;

  if (userEmail === adminEmail) {
    container.append(card);
  } else {
    let othersGrid = document.getElementById("others-grid");
    if (!othersGrid) {
      othersGrid = document.createElement("div");
      othersGrid.id = "others-grid";
      othersGrid.className = "others-grid";
      container.append(othersGrid);
    }
    othersGrid.append(card);
  }

  return videoBox;
};

export const joinCallHandler = async (
  course,
  userDetails,
  admin,
  setJoined,
  setLocalTracks,
  usersMap,
  setUsersMap,
  localTracksRef,
  options = { mic: true, cam: true }
) => {
  const userId = userDetails.id || userDetails._id;
  const { name, email } = userDetails;

  try {
    const res = await axios.get("http://localhost:5000/api/agora/agora-token", { params: { courseId: course._id, uid: userId } });
    const { token, appID, channelName } = res.data;

    client.removeAllListeners();
    await client.join(appID, channelName, token, userId);

    const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await micTrack.setEnabled(options.mic);
    const camTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig: "720p_1", facingMode: "user" });
    await camTrack.setEnabled(options.cam);

    localTracksRef.current = [micTrack, camTrack, null];
    setLocalTracks([micTrack, camTrack]);

    const tracksToPublish = [];
    if (micTrack.enabled) tracksToPublish.push(micTrack);
    if (camTrack.enabled) tracksToPublish.push(camTrack);
    if (tracksToPublish.length) await client.publish(tracksToPublish);

    const localVideoBox = createVideoCard(userId, name, admin.email, email, true, localTracksRef);
    if (camTrack.enabled) camTrack.play(localVideoBox);

    setJoined(true);
    setUsersMap(prev => ({ ...prev, [userId]: { name, email } }));

    const { data: joinedUsers } = await axios.get(`http://localhost:5000/api/courses/${course._id}/joinedUsers`);
    joinedUsers.forEach(u => {
      if (u.userId !== userId && !document.getElementById(`card-${u.userId}`)) {
        createVideoCard(u.userId, u.name, admin.email, u.email, false);
        setUsersMap(prev => ({ ...prev, [u.userId]: { name: u.name, email: u.email } }));
      }
    });

    for (const remoteUser of client.remoteUsers) {
      if (remoteUser.uid === userId) continue;
      await client.subscribe(remoteUser, "video").catch(() => {});
      await client.subscribe(remoteUser, "audio").catch(() => {});

      const videoBox = createVideoCard(remoteUser.uid, usersMap[remoteUser.uid]?.name || `User ${remoteUser.uid}`, admin.email, usersMap[remoteUser.uid]?.email || "", false);
      if (remoteUser.videoTrack) remoteUser.videoTrack.play(videoBox);
      if (remoteUser.audioTrack) remoteUser.audioTrack.play();
      updateStatusIcons(remoteUser.uid, "video", !!remoteUser.videoTrack);
      updateStatusIcons(remoteUser.uid, "audio", !!remoteUser.audioTrack);
    }

    client.on("user-published", async (remoteUser, mediaType) => {
      await client.subscribe(remoteUser, mediaType);
      let userName = usersMap[remoteUser.uid]?.name || `User ${remoteUser.uid}`;
      let userEmail = usersMap[remoteUser.uid]?.email || "";

      if (!usersMap[remoteUser.uid]) {
        const { data: joinedUsers } = await axios.get(`http://localhost:5000/api/courses/${course._id}/joinedUsers`);
        const u = joinedUsers.find(x => x.userId === remoteUser.uid);
        if (u) {
          userName = u.name;
          userEmail = u.email;
          setUsersMap(prev => ({ ...prev, [remoteUser.uid]: { name: u.name, email: u.email } }));
        }
      }

      if (!document.getElementById(`card-${remoteUser.uid}`)) {
        const videoBox = createVideoCard(remoteUser.uid, userName, admin.email, userEmail, false);
        if (mediaType === "video" && remoteUser.videoTrack) remoteUser.videoTrack.play(videoBox);
        if (mediaType === "audio" && remoteUser.audioTrack) remoteUser.audioTrack.play();
      } else {
        if (mediaType === "video" && remoteUser.videoTrack) remoteUser.videoTrack.play(document.getElementById(`video-${remoteUser.uid}`));
        if (mediaType === "audio" && remoteUser.audioTrack) remoteUser.audioTrack.play();
      }
      updateStatusIcons(remoteUser.uid, mediaType, true);
    });

    client.on("user-unpublished", (remoteUser, mediaType) => {
      updateStatusIcons(remoteUser.uid, mediaType, false);
    });

    client.on("user-left", (remoteUser) => {
      const card = document.getElementById(`card-${remoteUser.uid}`);
      if (card) card.remove();
      setUsersMap(prev => { const newMap = { ...prev }; delete newMap[remoteUser.uid]; return newMap; });
    });

  } catch (err) {
    console.error("Error joining call:", err);
  }
};

export const leaveCallHandler = async (localTracksRef, course, userDetails, setJoined) => {

  try {
    const tracks = Array.isArray(localTracksRef.current) ? localTracksRef.current : [];
    for (const track of tracks) { if (track?.stop) track.stop(); if (track?.close) track.close(); }
    try { const toUnpublish = tracks.filter(t => t?.enabled); if (toUnpublish.length) await client.unpublish(toUnpublish); } catch {}
    localTracksRef.current = [];
    await client.leave();
    await axios.post(`http://localhost:5000/api/courses/${course._id}/leave`, { userId: userDetails.id || userDetails._id });
    setJoined(false);
    const container = document.getElementById("video-container");
    if (container) container.innerHTML = "";
  } catch (err) {
    console.error("Error leaving call:", err);
  }
};
