import React from 'react'
import { connect } from 'react-redux'
import { MyProfileDataType, MyProfileDataItemType, setMyProfileDataTC, updatePhotoTC, actions } from '../../redux/my_profile_reducer'
import { getMyProfileData,getLoginOfLU, getIsGettingMyProfileData, getProfilePhotoUrl, getIsLoadingProfilePhoto } from '../../Selectors/selectors'
import { AppStoreType } from '../../redux/redux'
import classes from './ProfilePage.module.css'
import { round_plus, translate_kind_of_bet_and_home_away } from '../../CommonFunctions/commonFunctions'
import { useSubscribeOnData } from '../../Hooks/Hooks'
import { PreloaderPageWithoutHeader } from '../CommonComponents/PreloaderPage/PreloaderPage'
import ProfileInfo from './ProfileInfo/ProfileInfo'
import UserBetsTable from './UserBetsTable/UserBetsTable'


const ProfilePageContainer: React.FC<PropsType> = (props: PropsType) => {
    useSubscribeOnData(props.setMyProfileDataTC, props.set_my_profile_page_initial_state, [props.user_login])
    if(props.isGettingData || !props.my_profile_data) return <PreloaderPageWithoutHeader /> 
    return <ProfilePage {...props}/>
}

const ProfilePage: React.FC<PropsType> = ({my_profile_data, photo_url, isLoadingPhoto, updatePhotoTC, user_login}) => {

    let balance = 0
    let win_bets = 0
    let overall_bets = 0
    let odds_sum = 0
    my_profile_data?.forEach(item => {
        balance = balance + +item.balance
        if(+item.result > 0) {
            win_bets = win_bets + 1
        }
        if(+item.result !== 0) {
            overall_bets = overall_bets + 1
        }
        odds_sum = odds_sum + +item.odd
    })

    const winning_rating = overall_bets ? Math.round(win_bets*100 / overall_bets) : 0;

    const average_odd = my_profile_data? round_plus(odds_sum / my_profile_data.length, 2) : 0;

    return (
        <div className = {classes.my_profile_page}>
            <ProfileInfo number_of_bets = {my_profile_data!.length}
                         user_login = {user_login}
                         average_odd = {average_odd}
                         balance = {balance}
                         winning_rating = {winning_rating}
                         photo_url = {photo_url}
                         isLoadingPhoto = {isLoadingPhoto}
                         updatePhotoTC = {updatePhotoTC}/>
            <UserBetsTable my_profile_data_items = {my_profile_data}
                           classes = {classes}/>
        </div>
    )
}

export const MyProfileDataItem: React.FC<MyProfileDataItemType> = (props) => {
    let result_className = ''
    let result_content = '-'
    if(+props.result === 1) {
        result_className = 'win_bet'
        result_content = 'Победа'
    } else if (+props.result === 0 && props.result !== null) {
        result_className = 'back_bet'
        result_content = 'Возврат'
    } else if (+props.result === -1) {
        result_className = 'lose_bet'
        result_content = 'Проигрыш'
    } 
    return (
        <div className = {classes.my_profile_data_item}>
            <div className = {classes.date_of_match_block}>{props.date_of_match}</div>
            <div className = {classes.name_of_championship_block}>{props.name_of_championship.toUpperCase()}</div>
            <div className = {classes.teams_block}>{props.name_of_team1 + ' - ' + props.name_of_team2}</div>
            <div className = {classes.kind_of_bet_block}>{translate_kind_of_bet_and_home_away(props.kind_of_bet)}</div>
            <div className = {classes.odd_block}>{props.odd_type + ' ' + props.odd}</div>
            <div className = {classes.result_of_match_block}>{props.result_of_match}</div>
            <div className = {classes.result_of_bet_block + ' ' + classes[result_className]}>{result_content}</div>
            <div className = {classes.balance_block}>{props.balance}</div>
        </div>
    )
}

type MapStatePropsType = {
    my_profile_data: MyProfileDataType
    user_login: string | null
    isGettingData: boolean
    photo_url: string | null
    isLoadingPhoto: boolean
}

type MapDispatchPropsType = {
    setMyProfileDataTC: (user_login: string) => any
    set_my_profile_page_initial_state: () => void
    updatePhotoTC: (photo_file: File) => void
}

type OwnPropsType = {
   
}

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType

let mapStateToProps = (state: AppStoreType): MapStatePropsType => {
    return {
        my_profile_data: getMyProfileData(state),
        user_login: getLoginOfLU(state),       
        isGettingData: getIsGettingMyProfileData(state),
        photo_url: getProfilePhotoUrl(state),
        isLoadingPhoto: getIsLoadingProfilePhoto(state)
    }
}

let mapDispatchToProps: MapDispatchPropsType = {
    setMyProfileDataTC, 
    set_my_profile_page_initial_state: actions.set_my_profile_page_initial_state,
    updatePhotoTC   
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(ProfilePageContainer)
