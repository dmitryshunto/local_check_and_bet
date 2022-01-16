import React from 'react'
import classes from '../ProfilePage.module.css'
import AvatarComonent from '../../CommonComponents/PhotoEditor/PhotoEditor';

type PropsType = {
    user_login: string | null
    winning_rating: number
    average_odd: number
    number_of_bets: number
    number_of_setled_bets: number
    balance: number
    photo_url: string | null
    isLoadingPhoto: boolean
    updatePhotoTC: (photo_file: File) => void
    defaultPhotoURL: string | null
}

const ProfileInfo: React.FC<PropsType> = ({ number_of_bets, balance, isLoadingPhoto, photo_url, updatePhotoTC, user_login,
    winning_rating, average_odd, defaultPhotoURL, number_of_setled_bets }) => {

    return (
        <div className={classes.profile_info}>
            <div className={classes.avatar_container}>
                <AvatarComonent photo_url={photo_url}
                    defaultPhotoURL={defaultPhotoURL}
                    isLoadingPhoto={isLoadingPhoto}
                    updatePhotoTC={updatePhotoTC}
                />

            </div>
            <div className={classes.user_info_container}>
                <div>
                    {user_login}
                    <hr />
                </div>
                <div>
                    <span>Total number of bets: {number_of_bets}. Balance: {balance}$.</span><br /> <br />
                    <span>Number of settled bets: {number_of_setled_bets}. Win rate: {winning_rating}%. Average odd: {average_odd}.</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileInfo

