import React from 'react'
import classes from '../ProfilePage.module.css'
import AvatarComonent from '../../CommonComponents/PhotoEditor/PhotoEditor';

type PropsType = {
    user_login: string | null
    winning_rating: number
    average_odd: number
    number_of_bets: number
    balance: number
    photo_url: string | null
    isLoadingPhoto: boolean
    updatePhotoTC: (photo_file: File) => void
    default_photo_url: string | null
}

const ProfileInfo: React.FC<PropsType> = ({ number_of_bets, balance, isLoadingPhoto, photo_url, updatePhotoTC, user_login,
    winning_rating, average_odd, default_photo_url }) => {
    
    return (
        <div className={classes.profile_info}>
            <AvatarComonent photo_url = {photo_url}
                            default_photo_url = {default_photo_url}
                            isLoadingPhoto = {isLoadingPhoto}
                            updatePhotoTC = {updatePhotoTC}
                            />
            <div className={classes.user_info_container}>
                <div>
                    {user_login}
                    <hr />
                </div>
                <div>
                    <span>Number of bets: {number_of_bets}, balance: {balance}$.</span><br /> <br />
                    <span>Win rate: {winning_rating}%, average odd: {average_odd}.</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileInfo

