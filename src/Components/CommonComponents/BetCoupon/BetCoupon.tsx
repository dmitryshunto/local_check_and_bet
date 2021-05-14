import React from 'react'
import classes from './BetCoupon.module.css'
import { connect } from 'react-redux'
import { added_bets_selectors, auth_user_selectors } from '../../../Selectors/selectors'
import { actions, addBetToDBTC, BetType, selectBetTC } from '../../../redux/betReducer'
import { withRenderByCondition } from '../../../HOC/withPreloader'
import { AppStoreType } from '../../../redux/redux'
import { return_bet_object, transform_name_for_ui } from '../../../CommonFunctions/typed_functions'
import { Input } from 'antd'

type PropsType = MapStateToProps & MapDispatchToProps

let BetCoupon: React.FC<PropsType> = ({ bets, removeBet, addBetToDBTC, login, isAddingBets, setInitialBetsReducerState, selectBetTC }) => {
    if (bets.length) {
        let coupon_bets = bets.map((bet: BetType, index: number) => <BetCouponItem bet={bet}
            key={index}
            removeBet={removeBet}
            selectBetTC={selectBetTC}
        />)
        const all_bets_with_inserted_size = bets.filter(bet => bet['bet_size']).length ? true : false
        return (
            <div className={classes.bet_coupon}>
                <div className={classes.bet_coupon_head}>
                    <div className={classes.bets_length_block}>{bets.length}</div>
                    <div className={classes.remove_all_bets_button} onClick={() => setInitialBetsReducerState()}>Delete all</div>
                </div>
                {coupon_bets}
                <button className={classes.add_bet_button}
                    onClick={() => addBetToDBTC(login, bets)}
                    disabled={!all_bets_with_inserted_size || isAddingBets}>
                    Add to my bets
                </button>
            </div>
        )
    } return null
}

type BetCouponItem = {
    bet: BetType
    removeBet: typeof actions.removeBet
    selectBetTC: (bet: BetType) => void
}

const BetCouponItem: React.FC<BetCouponItem> = ({ bet, removeBet, selectBetTC }) => {
    const { market, odd_type, odd, kind_of_bet, home_team, away_team, value } = bet
    const max_size = 1000
    const min_size = 1

    const onBetSizeInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let bet_size
        let bet_size_to_num = Number(e.currentTarget.value)
        if (bet_size_to_num > max_size) {
            bet_size = max_size
        } 
        else if (bet_size_to_num >= min_size && bet_size_to_num <= max_size) {
            bet_size = bet_size_to_num
        }
        let new_bet = return_bet_object(kind_of_bet, bet.db_name, market, bet.game_id, bet.date_of_match, home_team, away_team)(
            value, odd_type, odd, bet_size
        )
        selectBetTC(new_bet) // удаляет из массива bets ставку со старым значением bet_size
        selectBetTC(new_bet) // добавляет в массив bets новую ставку с актуальным значением bet_size
    }              

    return (
        <div className={classes.bet_coupon_item}>
            <div className={classes.remove_bet_button} onClick={() => removeBet(bet)}>
                X
            </div>
            <div className={classes.coupon_odd_type}>
                <div>{`${home_team} : ${away_team}`}</div>
                <div>{transform_name_for_ui(kind_of_bet)}</div>
                <div>{`${transform_name_for_ui(market)} : ${odd_type} ${value !== null ? value : ''}`}</div>
            </div>
            <div className = {classes.input_block}>
                <Input type={'number'}
                    id = {'bet_size_input'}
                    value={bet.bet_size ? bet.bet_size : ''}
                    onChange={onBetSizeInputChange}
                />
                <label htmlFor = {'bet_size_input'}>{`Insert bet size. Max is ${max_size}$`}</label>

            </div>
            <div className = {classes.odd_block}>
                {odd}
            </div>
        </div>
    )
}

let BetSuccessMessage: React.FC<PropsType> = ({ warning_messages, setInitialBetsReducerState }) => {
    return (
        <div className={classes.bet_success_message}>
            <div className={classes.remove_message_button} onClick={() => setInitialBetsReducerState()}>X</div>
            <div className={classes.message_block}>{warning_messages}</div>
        </div>
    )
}

type MapStateToProps = {
    bets: BetType[]
    isAddingBets: boolean
    warning_messages: string[] | null
    login: string | null
}

const mapStateToProps = (state: AppStoreType): MapStateToProps => {
    return {
        bets: added_bets_selectors.get_data(state),
        isAddingBets: added_bets_selectors.get_is_getting_data(state),
        warning_messages: added_bets_selectors.get_message(state),
        login: auth_user_selectors.get_login(state)
    }
}

type MapDispatchToProps = {
    removeBet: typeof actions.removeBet
    addBetToDBTC: (login: string | null, bets: Array<BetType>) => void
    setInitialBetsReducerState: typeof actions.setInitialBetsReducerState
    selectBetTC: (bet: BetType) => void
}

const mapDispatchToProps: MapDispatchToProps = {
    removeBet: actions.removeBet, addBetToDBTC,
    setInitialBetsReducerState: actions.setInitialBetsReducerState,
    selectBetTC
}

export default connect<MapStateToProps, MapDispatchToProps, {}, AppStoreType>(mapStateToProps, mapDispatchToProps)(
    withRenderByCondition<PropsType>(BetSuccessMessage, 'warning_messages')(BetCoupon))
