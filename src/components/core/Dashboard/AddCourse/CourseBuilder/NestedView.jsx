import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import SubSectionModal from "./SubSectionModal";
import ConfirmationModal from "../../../../common/ConfirmationModel";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";

const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection({ sectionId, courseId: course._id }, token);
    if (result) dispatch(setCourse(result));
    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId }, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((sec) =>
        sec._id.toString() === sectionId.toString() ? result : sec
      );
      dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
    }
    setConfirmationModal(null);
  };

  // Safety check
  if (!course?.courseContent || !Array.isArray(course.courseContent)) {
    return (
      <div className="mt-10 rounded-lg bg-richblack-700 p-6 text-center text-richblack-5">
        No sections available yet.
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 rounded-lg bg-richblack-700 p-6 px-8">
        {course.courseContent.map((section) => (
          <details key={section._id} open className="mb-6">
            {/* Section Header */}
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-richblack-600 py-4">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">{section.sectionName}</p>
              </div>
              <div className="flex items-center gap-x-3">
                <button onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}>
                  <CiEdit className="text-xl text-richblack-300 hover:text-yellow-50" />
                </button>
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <MdDeleteOutline className="text-xl text-richblack-300 hover:text-red-500" />
                </button>
                <span className="text-richblack-400">|</span>
                <IoMdArrowDropdown className="text-xl text-richblack-300" />
              </div>
            </summary>

            {/* SubSections (Lectures) */}
            <div className="pl-12">
              {/* FORCE IT TO BE AN ARRAY NO MATTER WHAT BACKEND SENDS */}
              {Array.isArray(section.subSection) &&
                section.subSection.map((subSec) => (
                  <div
                    key={subSec._id}
                    onClick={() => setViewSubSection(subSec)}
                    className="flex cursor-pointer items-center justify-between border-b border-richblack-600 py-4 hover:bg-richblack-800 transition-all"
                  >
                    <div className="flex items-center gap-x-3">
                      <RxDropdownMenu className="text-lg text-richblack-300" />
                      <p className="text-sm font-medium text-richblack-50">{subSec.title}</p>
                    </div>

                    <div className="flex items-center gap-x-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setEditSubSection({ ...subSec, sectionId: section._id })}
                        className="hover:text-yellow-50 transition-all"
                      >
                        <CiEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Delete this Lecture?",
                            text2: "This lecture will be permanently deleted",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () => handleDeleteSubSection(subSec._id, section._id),
                            btn2Handler: () => setConfirmationModal(null),
                          })
                        }
                        className="hover:text-pink-500 transition-all"
                      >
                        <MdDeleteOutline className="text-lg" />
                      </button>
                    </div>
                  </div>
                ))}

              {/* Add Lecture Button */}
              <button
                onClick={() => setAddSubSection(section._id)}
                className="mt-4 flex items-center gap-x-2 text-yellow-50 font-medium hover:text-yellow-100 transition-all"
              >
                <FaPlus className="text-sm" />
                <span>Add Lecture</span>
              </button>
            </div>
          </details>
        ))}
      </div>

      {/* Modals */}
      {addSubSection && (
        <SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true} />
      )}
      {viewSubSection && (
        <SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true} />
      )}
      {editSubSection && (
        <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} />
      )}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default NestedView;