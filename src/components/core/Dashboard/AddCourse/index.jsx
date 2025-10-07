import RenderSteps from './RenderSteps'

export default function AddCourse()
{
    return(
        <>
            <div className="text-white">
                <div>
                    <h1>Add Course</h1>
                    <div>
                        <RenderSteps></RenderSteps>
                    </div>
                </div>
                <div>
                    <p>Code upload tips</p>
                </div>
            </div>
        </>
    )
}