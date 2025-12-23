import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Player, BigPlayButton } from "video-react";
import IconBtn from "../../common/IconBtn";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"; // ← Add this action in your slice

import "video-react/dist/video-react.css";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef(null);

  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, completedLectures } = useSelector(
    (state) => state.viewCourse
  );

  const [videoData, setVideoData] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseSectionData || courseSectionData.length === 0) return;

    const section = courseSectionData.find((s) => s._id === sectionId);
    if (!section || !section.subSection) return;

    const subSection = section.subSection.find((sub) => sub._id === subSectionId);
    if (!subSection) return;

    setVideoData(subSection);
    setVideoEnded(false);
  }, [courseSectionData, sectionId, subSectionId]);

  const isFirstVideo = () => {
    if (!courseSectionData?.length) return true;
    const secIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIdx = courseSectionData[secIdx]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    );
    return secIdx === 0 && subIdx === 0;
  };

  const isLastVideo = () => {
    if (!courseSectionData?.length) return true;
    const secIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIdx = courseSectionData[secIdx]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    );
    return (
      secIdx === courseSectionData.length - 1 &&
      subIdx === courseSectionData[secIdx].subSection.length - 1
    );
  };

  const goToNextVideo = () => {
    const secIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIdx = courseSectionData[secIdx]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    );

    if (subIdx < courseSectionData[secIdx].subSection.length - 1) {
      const nextId = courseSectionData[secIdx].subSection[subIdx + 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextId}`);
    } else if (secIdx < courseSectionData.length - 1) {
      const nextSec = courseSectionData[secIdx + 1];
      const nextId = nextSec.subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${nextSec._id}/sub-section/${nextId}`);
    }
  };

  const goToPrevVideo = () => {
    const secIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIdx = courseSectionData[secIdx]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    );

    if (subIdx > 0) {
      const prevId = courseSectionData[secIdx].subSection[subIdx - 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevId}`);
    } else if (secIdx > 0) {
      const prevSec = courseSectionData[secIdx - 1];
      const prevId = prevSec.subSection[prevSec.subSection.length - 1]._id;
      navigate(`/view-course/${courseId}/section/${prevSec._id}/sub-section/${prevId}`);
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete({ courseId, subSectionId }, token);

    if (res) {
      // Update Redux store so sidebar reflects completion immediately
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  if (!videoData) {
    return (
      <div className="mt-20 text-center text-3xl font-medium text-richblack-100">
        Loading video...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6 text-richblack-5">
      <div className="relative">
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          src={videoData.videoUrl}
          onEnded={() => setVideoEnded(true)}
        >
          <BigPlayButton position="center" />
        </Player>

        {/* Overlay when video ends */}
        {videoEnded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-black bg-opacity-80">
            <div className="flex flex-wrap justify-center gap-6">
              {/* Mark as Completed Button */}
              {!completedLectures?.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={handleLectureCompletion}
                  text={loading ? "Loading..." : "Mark As Completed"}
                  customClasses="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-bold text-lg"
                />
              )}

              {/* Rewatch Button */}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef.current) {
                    playerRef.current.seek(0);
                    playerRef.current.play();
                    setVideoEnded(false);
                  }
                }}
                text="Rewatch"
                customClasses="bg-richblack-700 px-6 py-3 rounded-lg font-bold text-lg"
              />

              {/* Previous Button */}
              {!isFirstVideo() && (
                <button
                  disabled={loading}
                  onClick={goToPrevVideo}
                  className="rounded-lg bg-richblack-600 px-8 py-3 font-semibold transition-all hover:bg-richblack-700"
                >
                  Previous
                </button>
              )}

              {/* Next Button */}
              {!isLastVideo() && (
                <button
                  disabled={loading}
                  onClick={() => {
                    goToNextVideo();
                    setVideoEnded(false); // Hide overlay when moving next
                  }}
                  className="rounded-lg bg-yellow-50 px-8 py-3 font-semibold text-richblack-900 transition-all hover:bg-yellow-100"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video Title & Description */}
      <div className="mt-10">
        <h1 className="text-3xl font-bold">{videoData.title}</h1>
        <p className="mt-4 text-lg text-richblack-200">{videoData.description}</p>
      </div>
    </div>
  );
};

export default VideoDetails;