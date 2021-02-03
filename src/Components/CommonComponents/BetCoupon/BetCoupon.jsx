import React from 'react';
import classes from './BetCoupon.module.css'
import { connect } from 'react-redux';
import { getAddedBets, getLoginOfLU, getIsAddingBetToDB, getMessageFromBetReducer } from '../../../Selectors/selectors';
import { actions, addBetToDBTC } from '../../../redux/betReducer';
import { translate_kind_of_bet_and_home_away } from '../../../CommonFunctions/commonFunctions';
import { withRenderByCondition } from '../../../HOC/withPreloader'
import { compose } from 'redux';

const BetCoupon = ({ bets, removeBet, addBetToDBTC, login, isAddingBets, setInitialBetsReducerState }) => {
    if (bets.length) {
        let coupon_bets = bets.map(bet => <BetCouponItem bet = {bet} 
                                                         key={bet.name_of_team1 + ' ' + bet.market}
                                                         removeBet={removeBet}
        />)
        return (
            <div className={classes.bet_coupon}>
                <div className = {classes.bet_coupon_head}>
                    <div className = {classes.bets_length_block}>{bets.length}</div>
                    <div className = {classes.remove_all_bets_button} onClick = {() => setInitialBetsReducerState()}>Удалить все</div>
                </div>
                {coupon_bets}
                <button className={classes.add_bet_button}
                        onClick={() => addBetToDBTC(login, bets)}
                        disabled={isAddingBets ? 'disabled' : null}>
                    Добавить к моим ставкам
                </button>
            </div>
        )
    } else return null
}

const BetCouponItem = ({ bet, removeBet }) => {
    const {market, name_of_team1, name_of_team2, odd_type, odd, kind_of_bet} = bet

    return (
        <div className={classes.bet_coupon_item}>
            <div className={classes.remove_bet_button} onClick={() => removeBet(bet)}>
                X
            </div>
            <div className={classes.coupon_odd_type}>
                <div>{translate_kind_of_bet_and_home_away(kind_of_bet)}</div>
                <div>{name_of_team1 + ' : ' + name_of_team2}</div>
                <div>{market + ' : ' + odd_type}</div>
            </div>
            <div>
                {odd}
            </div>
        </div>
    )
}

const NullComponent = () => {
    return null
}

const BetSuccessMessage = withRenderByCondition(NullComponent, 'message')(({message, setInitialBetsReducerState}) => {
    return (
        <div className={classes.bet_success_message}>
            <div className = {classes.remove_message_button} onClick = {() => setInitialBetsReducerState()}>X</div>
            <div className = {classes.message_block}>{message}</div>
        </div>
    )
})

const mapStateToProps = (state) => {
    return {
        bets: getAddedBets(state),
        isAddingBets: getIsAddingBetToDB(state),
        message: getMessageFromBetReducer(state),
        login: getLoginOfLU(state)
    }
}

const mapDispatchToProps = {
    removeBet: actions.removeBet, addBetToDBTC,
    setInitialBetsReducerState: actions.setInitialBetsReducerState
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withRenderByCondition(BetSuccessMessage, 'bets'))(BetCoupon);