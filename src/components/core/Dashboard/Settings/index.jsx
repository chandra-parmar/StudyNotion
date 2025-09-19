import EditProfile from "./EditProfile"
import ChangeProfilePicture from "./ChangeProfilePicture"
import UpdatePassword from "./UpdatePassword"
import DeleteAccount from "./DeleteAccount"


export default function Settings()
{
    return(
        <>
            <h1>Edit Profile</h1>
             {/** change profile picture */}
             <ChangeProfilePicture></ChangeProfilePicture>

             {/** profile */}
             <EditProfile></EditProfile>
             {/** updatepassword */}
             <UpdatePassword></UpdatePassword>
             {/** delete account */}
             <DeleteAccount></DeleteAccount>
        </>

    )
}