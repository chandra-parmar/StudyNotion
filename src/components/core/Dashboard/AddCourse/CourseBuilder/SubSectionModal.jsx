import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RxCross1 } from "react-icons/rx"
import Upload from '../Upload'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI'
import toast from 'react-hot-toast'
import IconBtn from '../../../../common/IconBtn'
import { setCourse } from '../../../../../slices/courseSlice'

const SubSectionModal = ({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false
}) => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)

    useEffect(() => {
        if (view || edit) {
            setValue("lectureTitle", modalData?.title || "")
            setValue("lectureDesc", modalData?.description || "")
            setValue("lectureVideo", modalData)
        }
    }, [modalData, view, edit, setValue])

    const isFormUpdated = () => {
        const currentValues = getValues()
        return (
            currentValues.lectureTitle !== modalData?.title ||
            currentValues.lectureDesc !== modalData?.description ||
            (currentValues.lectureVideo && typeof currentValues.lectureVideo !== "string")
        )
    }

    const handleEditSubSection = async () => {
        const currentValues = getValues()
        const formData = new FormData()

        const sectionId = modalData.sectionId || modalData.section?._id
        if (!sectionId || !modalData._id) {
            toast.error("Missing section or lecture ID")
            return
        }

        formData.append("sectionId", sectionId)
        formData.append("subSectionId", modalData._id)

        if (currentValues.lectureTitle !== modalData.title) formData.append("title", currentValues.lectureTitle)
        if (currentValues.lectureDesc !== modalData.description) formData.append("description", currentValues.lectureDesc)
        if (currentValues.lectureVideo && typeof currentValues.lectureVideo !== "string") {
            formData.append("video", currentValues.lectureVideo)
        }

        setLoading(true)
        const result = await updateSubSection(formData, token)

        if (result) {
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id.toString() === sectionId.toString() ? result : section
            )
            dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
            toast.success("Lecture Updated")
        }
        setModalData(null)
        setLoading(false)
    }

    const onSubmit = async (data) => {
        if (view) return

        if (edit) {
            if (!isFormUpdated()) {
                toast.error("No changes made")
                return
            }
            await handleEditSubSection()
            return
        }

        // ADD NEW LECTURE
        const formData = new FormData()
        formData.append("sectionId", modalData) // modalData = sectionId (string)
        formData.append("title", data.lectureTitle)
        formData.append("description", data.lectureDesc)
        formData.append("video", data.lectureVideo)

        setLoading(true)
        const result = await createSubSection(formData, token)

        if (result) {
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id.toString() === modalData.toString() ? result : section
            )
            dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
            toast.success("Lecture Added Successfully 🎉")
        } else {
            toast.error("Failed to add lecture")
        }

        setModalData(null)
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
                <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 px-5 py-4">
                    <p className="text-xl font-semibold text-richblack-5">
                        {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
                    </p>
                    <button disabled={loading} onClick={() => setModalData(null)}>
                        <RxCross1 className="text-2xl text-richblack-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-6">
                    <Upload
                        name="lectureVideo"
                        label="Lecture Video*"
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        video={true}
                        viewData={view ? modalData?.videoUrl : null}
                        editData={edit ? modalData : null}
                    />

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
                            Lecture Title <sup className="text-pink-200">*</sup>
                        </label>
                        <input
                            id="lectureTitle"
                            placeholder="Enter lecture title"
                            {...register("lectureTitle", { required: true })}
                            className="form-style w-full"
                        />
                        {errors.lectureTitle && <span className="text-pink-200">Lecture title is required</span>}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
                            Lecture Description <sup className="text-pink-200">*</sup>
                        </label>
                        <textarea
                            id="lectureDesc"
                            placeholder="Enter lecture description"
                            {...register("lectureDesc", { required: true })}
                            className="form-style w-full min-h-[130px]"
                        />
                        {errors.lectureDesc && <span className="text-pink-200">Lecture description is required</span>}
                    </div>

                    {!view && (
                        <div className="flex justify-end">
                            <IconBtn
                                type="submit"
                                disabled={loading}
                                text={loading ? "Saving..." : edit ? "Save Changes" : "Save"}
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default SubSectionModal