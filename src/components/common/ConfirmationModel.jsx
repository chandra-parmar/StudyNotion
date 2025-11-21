import React from "react";
import { VscSignOut } from "react-icons/vsc";

const ConfirmationModel = ({ modalData }) => {
  return (
     <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">
          {modalData.text1}
        </p>
        <p className="mt-3 mb-5 text-sm leading-6 text-richblack-200">
          {modalData.text2}
        </p>
        <div className="flex gap-x-4">
          <button
            onClick={modalData.btn1Handler}
            disabled={modalData.btn1Text.includes("Deleting")}
            className="cursor-pointer rounded-md bg-yellow-500 py-2 px-5 font-semibold text-richblack-900 transition-all duration-200 hover:bg-yellow-600"
          >
            {modalData.btn1Text}
          </button>
          <button
            onClick={modalData.btn2Handler}
            className="cursor-pointer rounded-md bg-richblack-200 py-2 px-5 font-semibold text-richblack-900 transition-all duration-200 hover:bg-richblack-300"
          >
            {modalData.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModel;
