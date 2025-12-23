import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CiCircleChevDown } from 'react-icons/ci';
import IconBtn from '../../common/IconBtn';

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState('');
  const [videoBarActive, setVideoBarActive] = useState('');
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  // Set active section and subsection when sectionId/subSectionId changes
  useEffect(() => {
    if (!courseSectionData?.length) return;

    console.log("course section data",courseSectionData)
    const currentSectionIndex = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    );

    if (currentSectionIndex === -1) return;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (sub) => sub._id === subSectionId
    );

    const activeSubSectionId =
      courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex]?._id;

    setActiveStatus(courseSectionData[currentSectionIndex]._id);
    setVideoBarActive(activeSubSectionId || '');
  }, [sectionId, subSectionId, courseSectionData]);

  // Toggle active section
  const toggleSection = (sectionId) => {
    setActiveStatus((prev) => (prev === sectionId ? '' : sectionId));
  };

  return (
    <div className="w-full md:w-[320px] bg-richblack-800 h-full p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard/enrolled-courses')}
          className="flex items-center gap-2 text-richblack-100 hover:text-richblack-50"
        >
          <span>Back to Enrolled Courses</span>
        </button>

        {/* Course Name & Progress */}
        <div>
          <p className="text-xl font-bold text-richblack-5">
            {courseEntireData?.courseName}
          </p>
          <p className="text-sm text-richblack-100">
            {completedLectures.length} / {totalNoOfLectures} lectures completed
          </p>
        </div>

        {/* Add Review Button */}
        <IconBtn
          text="Add Review"
          onclick={() => setReviewModal(true)}
          className="bg-yellow-50 text-richblack-900"
        />
      </div>

      {/* Sections & Subsections */}
      <div className="flex flex-col gap-4">
        {courseSectionData.map((section) => (
          <div key={section._id} className="border-b border-richblack-600 pb-4">
            {/* Section Header (collapsible) */}
            <div
              className="flex justify-between items-center cursor-pointer py-2"
              onClick={() => toggleSection(section._id)}
            >
              <p className="font-semibold text-richblack-5">{section.sectionName}</p>
              <CiCircleChevDown
                className={`text-xl transition-transform ${
                  activeStatus === section._id ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Subsections (only shown if section is active) */}
            {activeStatus === section._id && (
              <div className="mt-2 flex flex-col gap-2">
                {section.subSection.map((topic) => (
                  <div
                    key={topic._id}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData._id}/section/${section._id}/sub-section/${topic._id}`
                      );
                      setVideoBarActive(topic._id);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all ${
                      videoBarActive === topic._id
                        ? 'bg-yellow-200 text-richblack-900'
                        : 'bg-richblack-700 text-richblack-5 hover:bg-richblack-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(topic._id)}
                      onChange={() => {}} // Prevent default checkbox behavior
                      className="cursor-pointer"
                    />
                    <span className="text-sm">{topic.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetailsSidebar;