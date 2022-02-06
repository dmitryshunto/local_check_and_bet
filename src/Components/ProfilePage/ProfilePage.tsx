import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { setMyProfileDataTC, updatePhotoTC, actions, MyPrediction, MyProfileBetType } from '../../redux/my_profile_reducer'
import { auth_user_selectors, propfile_selectors } from '../../Selectors/selectors'
import { AppStoreType } from '../../redux/redux'
import classes from './ProfilePage.module.css'
import { roundPlus } from '../../CommonFunctions/commonFunctions'
import { useSubscribeOnData } from '../../Hooks/Hooks'
import { PreloaderPageWithoutHeader } from '../CommonComponents/PreloaderPage/PreloaderPage'
import ProfileInfo from './ProfileInfo/ProfileInfo'
import { withPreloader } from '../../HOC/withPreloader'
import { withAuthRedirect } from './../../HOC/withAuthReirect';
import UserBets from './UserBetsTable/UserBets'
import UserPredictions from './UserPredictionsTable/UserPredictionsTable'
import { ColumnsType } from 'antd/lib/table'
import { ColumnFilterItem, SortOrder } from 'antd/lib/table/interface'
import { create_sorter } from '../../CommonFunctions/typed_functions'
import { ColumnsInfoType, TypeWithStringKey } from '../../config'
import { RenderFunction } from '../CommonComponents/Championship/Championship'
import { CheckCircleTwoTone, CloseCircleTwoTone, EnterOutlined } from '@ant-design/icons'

const getIconForResult = (result: 0 | 1 | -1) => {
    switch (result) {
        case 1:
            return <CheckCircleTwoTone twoToneColor='#52c41a' />
        case 0:
            return <EnterOutlined />
        case -1:
            return <CloseCircleTwoTone twoToneColor='rgb(216, 33, 33)' />
    }
}

export function create_filters_and_onFilter<DataItemType extends TypeWithStringKey>(data_items: DataItemType[], dataIndex: string) {
    let values: Array<string | number | null> = []
    data_items!.forEach(data_item => {
        if (values.indexOf(data_item[dataIndex]) === -1) values.push(data_item[dataIndex])
    })
    values.sort()
    let filters: ColumnFilterItem[] = []
    values.forEach(value => {
        if (value !== null && value !== undefined) {
            let text
            if (dataIndex === 'result') {
                if (value === 1 || value === 0 || value === -1) text = getIconForResult(value)
            } else text = value
            filters.push({ text, value })
        }
    })
    const onFilter = (value: string | number | boolean, record: DataItemType) => {
        return record[dataIndex] === value
    }
    return { filters, onFilter }
}


type IType = MyPrediction | MyProfileBetType

export function create_columns<ItemType extends IType>(user_predictions: ItemType[], columns_info: ColumnsInfoType<ItemType>[]) {
    const result: ColumnsType<ItemType> = []
    columns_info.forEach((column) => {
        let { dataIndex, title } = column
        let filters, onFilter, sorter, sortDirections: SortOrder[] | undefined, render: RenderFunction<ItemType> | undefined
        if (column.withFilter && typeof dataIndex === 'string') {
            filters = create_filters_and_onFilter<ItemType>(user_predictions, dataIndex)['filters']
            onFilter = create_filters_and_onFilter<ItemType>(user_predictions, dataIndex)['onFilter']
        }
        if (column.withSorter) {
            sorter = create_sorter(dataIndex)
            sortDirections = ['descend', 'ascend']
        }
        if (dataIndex === 'result') {
            render = (v, r) => {
                if(r.result !== undefined && r.result !== null) return getIconForResult(r.result)
            }
        }
        let align: 'center' | undefined
        if (dataIndex === 'date_of_match' || dataIndex === 'result') align = 'center'
        result.push({ filters, onFilter, sorter, render, sortDirections, title, dataIndex: dataIndex as string, key: dataIndex as string, align })
    })
    return result
}

let ProfilePageContainer: React.FC<PropsType> = (props: PropsType) => {
    useSubscribeOnData(props.setMyProfileDataTC, props.set_my_profile_page_initial_state, [props.user_login])
    useEffect(() => {
        document.title = 'My profile'
    }, [])
    return <ProfilePage {...props} />
}

ProfilePageContainer = withAuthRedirect<PropsType>()(ProfilePageContainer)

let ProfilePage: React.FC<PropsType> = ({ my_profile_data, photo_url, isLoadingPhoto, updatePhotoTC,
    defaultPhotoURL, user_login, }) => {

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
    balance = roundPlus(balance, 2)

    const winning_rating = overall_bets ? Math.round(win_bets * 100 / overall_bets) : 0;

    const average_odd = odds_sum && number_of_settled_bets ? roundPlus(odds_sum / number_of_settled_bets, 2) : 0;

    const number_of_bets = my_profile_data ? my_profile_data.length : 0

    return (
        <div className={classes.my_profile_page}>
            <ProfileInfo number_of_bets={number_of_bets}
                number_of_setled_bets={number_of_settled_bets}
                user_login={user_login}
                defaultPhotoURL={defaultPhotoURL}
                average_odd={average_odd}
                balance={balance}
                winning_rating={winning_rating}
                photo_url={photo_url}
                isLoadingPhoto={isLoadingPhoto}
                updatePhotoTC={updatePhotoTC} />
            <UserBets user_bets={my_profile_data} />
            <UserPredictions />
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
        defaultPhotoURL: propfile_selectors.get_defaultPhotoURL(state)
    }
}

type MapStatePropsType = ReturnType<typeof mapStateToProps>

let mapDispatchToProps: MapDispatchPropsType = {
    setMyProfileDataTC,
    set_my_profile_page_initial_state: actions.set_my_profile_page_initial_state,
    updatePhotoTC
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStoreType>(mapStateToProps, mapDispatchToProps)(ProfilePageContainer)
