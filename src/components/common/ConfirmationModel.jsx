import React from "react";
import { VscSignOut } from "react-icons/vsc";

const ConfirmationModel = ({ modalData }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-richblack-800 p-6 rounded-md w-[350px] text-white">
        {/* Title */}
        <p className="text-lg font-semibold">{modalData.text1}</p>
        <p className="mt-2 text-sm text-richblack-200">{modalData.text2}</p>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          {/* Logout styled same as sidebar */}
          <button
            onClick={modalData?.btn1Handler}
            className="flex items-center gap-x-2 text-sm font-medium text-richblack-300 hover:text-red-400 transition-all"
          >
            <VscSignOut className="text-lg" />
            {modalData?.btn1Text}
          </button>

          {/* Cancel (solid gray button) */}
          <button
            onClick={modalData?.btn2Handler}
            className="px-4 py-2 bg-richblack-600 text-white text-sm rounded-md hover:bg-richblack-700 transition-all"
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModel;
