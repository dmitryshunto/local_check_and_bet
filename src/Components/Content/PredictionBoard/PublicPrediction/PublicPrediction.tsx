import classes from './PublicPrediction.module.css'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { transform_name_for_ui } from '../../../../CommonFunctions/typed_functions'
import { OddTypeType } from '../../../../redux/betReducer'
import { BasePredictionType, delete_public_prediction, edit_public_prediction, PredictionType } from '../../../../redux/prediction_board'
import { NewKindOfBet } from '../../../../redux/redux'
import { Button, Col, Modal, Popover, Row } from 'antd'
import { CloseSquareOutlined, EditOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { auth_user_selectors } from '../../../../Selectors/selectors'
import { CreatePredictionContent } from '../../../CommonComponents/CreatePredictionBlock/CreatePredictionBlock'

type PredictionProps = {
    data: PredictionType
}

const PublicPrediction: React.FC<PredictionProps> = ({ data }) => {
    return (
        <div className={classes.public_prediction}>
            <div className={classes.prediction_content}>
                <Header data = {data} />
                <Match league_name={data.league_name}
                    game_id={data.game_id}
                    match={data.teams}
                    db_name={data.db_name}
                    date_of_match={data.date_of_match} />
                <Bet value={data.value}
                    kind_of_bet={data.kind_of_bet}
                    odd_type={data.odd_type}
                    odd={data.odd} />
                <BetDescription description={data.description} />
                <PredictionResult result={data.result}
                    result_of_match={data.result_of_match} />
            </div>
            <PredictionAuthor author_login={data.user_login} />
        </div>
    )
}

type HeaderType = {
    data: PredictionType 
}

const Header: React.FC<HeaderType> = ({data}) => {
    const user_login = useSelector(auth_user_selectors.get_login)
    let is_match_finished = data.date_of_match ? new Date() >= new Date(data.date_of_match) : true
    return (
        <Row>
            <Col span={22}>
                <Link to={`/championships/${data.db_name}`}>{data.league_name?.toUpperCase()}</Link>
            </Col>
            { user_login === data.user_login && !is_match_finished &&
                <>
                    <EditIcon db_name={data.db_name} leagues_names_for_prediction={[data.league_name!]}
                        game_id={data.game_id}
                        matches_for_prediction={[data.teams!]} 
                        prediction_id = {data.id}
                        initial_values = {data}/>
                    <DeleteIcon prediction_id={data.id} />
                </>
            }
        </Row>
    )
}

type EditIconType = {
    matches_for_prediction: string[]
    leagues_names_for_prediction: string[]
    db_name: string
    game_id: number
    prediction_id: number
    initial_values?: BasePredictionType
}

const EditIcon: React.FC<EditIconType> = (props) => {
    const [visible, set_visible] = useState(false)
    const content =
        <div>
            <Col span={1}><EditOutlined onClick={() => set_visible(true)} /></Col>
            <CreatePredictionContent matches_for_prediction={props.matches_for_prediction}
                leagues_names_for_prediction={props.leagues_names_for_prediction}
                db_name={props.db_name}
                game_id={props.game_id}
                callback={edit_public_prediction}
                visible={visible}
                set_visible={set_visible}
                prediction_id = {props.prediction_id}
                initial_values = {props.initial_values}
                />

        </div>
    if (visible) return content
    return (
        <Popover content='Edit'>
            {content}
        </Popover>
    )
}

type DeleteIconType = {
    prediction_id: number
}

const DeleteIcon: React.FC<DeleteIconType> = (props) => {
    const [modal_visible, set_modal_visible] = useState(false)
    const dispatch = useDispatch()
    const onOk = () => {
        set_modal_visible(false)
        dispatch(delete_public_prediction(props.prediction_id))
    }
    const content =
        <div>
            <Col span={1}><CloseSquareOutlined onClick={() => set_modal_visible(true)} /></Col>
            <ModalQuestion visible={modal_visible}
                content='Confirm deletion of your prediction.'
                title='Delete prediction'
                onOk={onOk}
                onCancel={() => set_modal_visible(false)} />
        </div>
    if (modal_visible) return content
    return (
        <Popover content='Delete prediction'>
            {content}
        </Popover>
    )
}

type ModalQuestionType = {
    title: string
    content: string | React.ReactNode
    onOk: () => void
    onCancel: () => void
    visible: boolean
}

const ModalQuestion: React.FC<ModalQuestionType> = (props) => {
    return (
        <Modal visible={props.visible} title={props.title} onOk={props.onOk} onCancel={props.onCancel}>
            {props.content}
        </Modal>
    )
}

type MatchType = {
    league_name: string | undefined
    db_name: string
    game_id: number
    match: string | undefined
    date_of_match: string | undefined
}

const Match: React.FC<MatchType> = (props) => {
    const date = props.date_of_match ? new Date(props.date_of_match).toLocaleDateString() : null
    return (
        <div>
            <div>
                <Link to={`/game_stats/${props.db_name}/${props.game_id}`}>{props.match}</Link>
            </div>
            <div>{date}</div>
        </div>
    )
}

type BetProps = {
    value: number | undefined
    kind_of_bet: NewKindOfBet
    odd_type: OddTypeType
    odd: number
}

const Bet: React.FC<BetProps> = (props) => {
    const bet_content = props.value !== undefined ? `${props.odd_type} ${props.value}` : props.odd_type
    return (
        <div>
            <div>
                Bet: {`${transform_name_for_ui(props.kind_of_bet)} ${bet_content}`}
            </div>
            <div>
                Odd: {props.odd}
            </div>
        </div>
    )
}

type BetDescriptionType = {
    description: string
}

const BetDescription: React.FC<BetDescriptionType> = ({ description }) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const hide_description = () => setIsModalVisible(false)
    const show_whole_description = () => setIsModalVisible(true)

    if (!description) return null
    let description_max_length = 50
    let content, text: string
    if (description.length > description_max_length) {
        text = description.substr(0, description_max_length)
        content = <div>
            {text}
            <ShowWholeDescription cb={show_whole_description} />
            <Modal title="Prediction Description"
                visible={isModalVisible}
                onOk={hide_description}
                onCancel={hide_description}
                closable={false}
                footer={[<Button type='primary' onClick={hide_description}>Ok</Button>]}>
                <div>{description}</div>
            </Modal>
        </div>
    } else {
        content = <div>{description}</div>
    }
    return (
        <div>
            <div>Description:</div>
            {content}

        </div>
    )
}

const ShowWholeDescription: React.FC<{ cb: () => void }> = ({ cb }) => {
    return (
        <Popover className={classes.show_whole_descripton} content='Read whole prediction'>
            <span onClick={cb}>...</span>
        </Popover>
    )
}

type PredictionResultType = {
    result: number | undefined
    result_of_match: string | undefined
}

const PredictionResult: React.FC<PredictionResultType> = ({ result, result_of_match }) => {
    let className = result === 1 ? 'win_bet' :
        result === 0 ? 'back_bet' :
            result === -1 ? 'lose_bet' : undefined
    return (
        <div>
            Result: <span className={className}>{result_of_match ? result_of_match : '-'}</span>
        </div>
    )
}

type PredictionAuthorType = {
    author_login: string | undefined
}

const PredictionAuthor: React.FC<PredictionAuthorType> = (props) => {
    return (
        <div className={classes.prediction_author}>
            {`Author: ${props.author_login}`}
        </div>
    )
}
export default PublicPrediction