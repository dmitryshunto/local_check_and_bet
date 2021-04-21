import React from 'react'
import { connect } from 'react-redux'
import { setMyProfileDataTC, updatePhotoTC, actions } from '../../redux/my_profile_reducer'
import { auth_user_selectors, propfile_selectors } from '../../Selectors/selectors'
import { AppStoreType } from '../../redux/redux'
import classes from './ProfilePage.module.css'
import { round_plus } from '../../CommonFunctions/commonFunctions'
import { useSubscribeOnData } from '../../Hooks/Hooks'
import { PreloaderPageWithoutHeader } from '../CommonComponents/PreloaderPage/PreloaderPage'
import ProfileInfo from './ProfileInfo/ProfileInfo'
import { withPreloader } from '../../HOC/withPreloader'
import { withAuthRedirect } from './../../HOC/withAuthReirect';
import UserBets from './UserBetsTable/UserBets'


let ProfilePageContainer: React.FC<PropsType> = (props: PropsType) => {
    useSubscribeOnData(props.setMyProfileDataTC, props.set_my_profile_page_initial_state, [props.user_login])
    return <ProfilePage {...props} />
}

ProfilePageContainer= withAuthRedirect<PropsType>()(ProfilePageContainer)

let ProfilePage: React.FC<PropsType> = ({ my_profile_data, photo_url, isLoadingPhoto, updatePhotoTC,
    default_photo_url, user_login, }) => {

    let balance = 0
    let win_bets = 0
    let overall_bets = 0
    let odds_sum = 0
    let number_of_settled_bets = 0
    my_profile_data?.forEach(item => {
        if (item.balance !== null && item.result !== null) {
            balance = balance + +item.balance
            if (+item.result > 0) {
                win_bets = win_bets + 1
            }
            if (+item.result !== 0) {
                overall_bets = overall_bets + 1
            }
            odds_sum = odds_sum + +item.odd
            number_of_settled_bets++
        }
    })


    const winning_rating = overall_bets ? Math.round(win_bets * 100 / overall_bets) : 0;

    const average_odd = odds_sum && number_of_settled_bets ? round_plus(odds_sum / number_of_settled_bets, 2) : 0;
    
    const number_of_bets = my_profile_data ? my_profile_data.length : 0
    
    return (
        <div className={classes.my_profile_page}>
            <ProfileInfo number_of_bets={number_of_bets}
                number_of_setled_bets = {number_of_settled_bets}
                user_login={user_login}
                default_photo_url = {default_photo_url}
                average_odd={average_odd}
                balance={balance}
                winning_rating={winning_rating}
                photo_url={photo_url}
                isLoadingPhoto={isLoadingPhoto}
                updatePhotoTC={updatePhotoTC} />
            <UserBets user_bets = {my_profile_data}/>
        </div>
    )
}

ProfilePage = withPreloader<PropsType>(PreloaderPageWithoutHeader, 'isGettingData')(ProfilePage)

type MapDispatchPropsType = {
    setMyProfileDataTC: () => void
    set_my_profile_page_initial_state: () => void
    updatePhotoTC: (photo_file: File) => void
}

type OwnPropsType = {

}

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType

let mapStateToProps = (state: AppStoreType) => {
    return {
        my_profile_data: propfile_selectors.get_data(state),
        user_login: auth_user_selectors.get_login(state),
        isGettingData: propfile_selectors.get_is_getting_data(state),
        photo_url: propfile_selectors.get_profile_photo_url(state),
        isLoadingPhoto: propfile_selectors.get_is_loading_profile_photo(state),
        default_photo_url: propfile_selectors.get_default_photo_url(state)
    }
}

type MapStatePropsType = ReturnType<typeof mapStateToProps>

let mapDispatchToProps: MapDispatchPropsType = {
    setMyProfileDataTC,
    set_my_profile_page_initial_state: actions.set_my_profile_page_initial_state,
    updatePhotoTC
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(ProfilePageContainer)
