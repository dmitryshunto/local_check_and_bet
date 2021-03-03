import React from 'react'
import classes from '../ProfilePage.module.css'
import PhotoEditor from '../../CommonComponents/PhotoEditor/PhotoEditor';
import { useState } from 'react';
import Modal from '../../CommonComponents/Modal/Modal';

type PropsType = {
    user_login: string | null
    winning_rating: number
    average_odd: number
    number_of_bets: number
    balance: number
    photo_url: string | null
    isLoadingPhoto: boolean
    updatePhotoTC: (photo_file: File) => void
}

const ProfileInfo: React.FC<PropsType> = ({ number_of_bets, balance, isLoadingPhoto, photo_url, updatePhotoTC, user_login,
    winning_rating, average_odd }) => {
    const [upload_mode, set_upload_mode] = useState<boolean | null>(false)

    return (
        <div className={classes.profile_info}>
            <div className={classes.avatar_container}>
                <ProfileAvatar photo_url = {photo_url}
                               cb = {set_upload_mode}/>
            </div>
            <div className={classes.user_info_container}>
                <div>
                    {user_login}
                    <hr />
                </div>
                <div>
                    <span>Ставок сделано: {number_of_bets}, баланс: {balance}$.</span><br/> <br/>
                    <span>Процент побед: {winning_rating}%, ср. коэффициент: {average_odd}.</span>
                </div>                
            </div>
            <Modal close_modal = {set_upload_mode}
                   active = {upload_mode}>
                <UploadNewPhotoWindow updatePhotoTC = {updatePhotoTC}
                                      active = {upload_mode}
                                      isLoadingPhoto = {isLoadingPhoto}/>
            </Modal>
            
        </div>
    )
}

type ProfileAvatarPropsType = {
    photo_url: string | null
    cb: (upload_mode: boolean) => void
}

const ProfileAvatar: React.FC<ProfileAvatarPropsType> = ({photo_url, cb}) => {
    return (
        <div className = {classes.avatar}>
           {photo_url && <img src = {photo_url} alt = {'avatar'} />}
           <button onClick = {() => cb(true)}>Редактировать</button>
        </div>
    )
}

type UploadNewPhotoWindow = {
    updatePhotoTC: (photo_file: File) => void
    active: boolean | null
    isLoadingPhoto: boolean
}

const UploadNewPhotoWindow: React.FC<UploadNewPhotoWindow> = ({updatePhotoTC, active, isLoadingPhoto}) => {
    return (
        <div className = {classes.upload_new_photo_window}>
            <div className = {classes.signing_block}>Вы можете загрузить изображение в формате JPG, JPEG или PNG и размером до 4 Mb.</div>
            <PhotoEditor updatePhotoTC = {updatePhotoTC}
                         active = {active}
                         isLoadingPhoto = {isLoadingPhoto}/>
        </div>
)}

export default ProfileInfo

