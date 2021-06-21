import classes from './PredictionBoard.module.css';
import { Button, Empty } from 'antd';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import { getMoreUsersPredictions, PredictionType, setUsersPredictionsTC, set_initial_state } from '../../../redux/prediction_board';
import { auth_user_selectors, prediction_board_selectors } from '../../../Selectors/selectors';
import { PreloaderPageWithoutHeader } from '../../CommonComponents/PreloaderPage/PreloaderPage';
import { useSubscribeOnData } from './../../../Hooks/Hooks';
import PublicPrediction from './PublicPrediction/PublicPrediction';
import { ArrowUpOutlined } from '@ant-design/icons';

const PredictionBoard: React.FC = () => {
    const prediction_items = useSelector(prediction_board_selectors.get_data)

    const dispatch = useDispatch()
    const set_data = () => dispatch(setUsersPredictionsTC())
    const clear_data = () => dispatch(set_initial_state())

    useSubscribeOnData(set_data, clear_data, [])

    useEffect(() => {
        document.title = 'Prediction Board'
    }, [])

    const user_login = useSelector(auth_user_selectors.get_login)
    const is_getting_data = useSelector(prediction_board_selectors.get_is_getting_data)
    const last_seen_prediction_id = useSelector(prediction_board_selectors.get_last_seen_prediction_id)
    if (is_getting_data) return <PreloaderPageWithoutHeader />
    if (!user_login) return <Redirect to='/loginpage' />

    let content

    if (!prediction_items.length) content = <Empty />
    else {
        if (last_seen_prediction_id === null || last_seen_prediction_id === prediction_items[0]['id']) {
            content = <PredictionBlock prediction_items={prediction_items} />
        } else {
            let after_last_seen_predictions = prediction_items.filter(p => p['id'] > last_seen_prediction_id)
            let new_predictons_for_user = after_last_seen_predictions.filter(p => p['user_login'] !== user_login)
            if (new_predictons_for_user.length) {
                let before_last_seen_predictions = prediction_items.filter(p => p['id'] <= last_seen_prediction_id)

                let before_content = <PredictionBlock prediction_items={before_last_seen_predictions} />
                let after_content = <PredictionBlock prediction_items={after_last_seen_predictions} />
                content = <>
                    {after_content}
                    <NewPredictionsLine />
                    {before_content}
                </>
            } else {
                content = <PredictionBlock prediction_items={prediction_items} />
            }
        }
    }
    return (
        <div>
            <h2>Prediction board</h2>
            {content}
            <MorePredictionButton />
        </div>
    )
}

type PredictionBlockType = {
    prediction_items: PredictionType[]
}

const PredictionBlock: React.FC<PredictionBlockType> = ({ prediction_items }) => {
    const content = prediction_items.map(item => <PublicPrediction key={item.id} data={item} />)
    return (
        <div className={classes.prediction_board_content}>
            {content}
        </div>
    )
}

const NewPredictionsLine: React.FC = () => {
    return (
        <div className={classes.new_predictions_line}>
            New predictions
            <ArrowUpOutlined />
        </div>
    )
}

const MorePredictionButton: React.FC = () => {
    const dispatch = useDispatch()
    const is_getting_data = useSelector(prediction_board_selectors.get_is_getting_more_prediction)
    const are_all_predictions_recieved = useSelector(prediction_board_selectors.all_predictions_recieved)

    return (
        <div className={classes.show_more_button}>
            {are_all_predictions_recieved && 'All predictions are recieved'}
            {!are_all_predictions_recieved &&
                <Button loading={is_getting_data} onClick={() => dispatch(getMoreUsersPredictions())}>
                    Show more predictions
                </Button>
            }
        </div>
    )
}
export default PredictionBoard