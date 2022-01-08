import { Form as AntForm, InputNumber, Modal, Popover, Switch } from 'antd'
import React, { useState } from 'react'
import { kinds_of_bet, types_of_bet } from '../../../config'
import { FieldData } from '../../../../node_modules/rc-field-form/lib/interface'
import { create_select_item } from '../FormRenderField/FormRenderField'
import TextArea from 'antd/lib/input/TextArea'
import { BasePredictionType, send_prediction } from '../../../redux/prediction_board'
import { useDispatch } from 'react-redux'
import { PlusSquareOutlined } from '@ant-design/icons'

type OwnPropsType = {
    matches_for_prediction: string[]
    leagues_names_for_prediction: string[]
    db_name: string
    game_id: number
}

const CreatePredictionBlock: React.FC<OwnPropsType> = (props) => {
    const [visible, set_visible] = useState(false)
    return (
        <Popover content='Add prediction'>
            <PlusSquareOutlined onClick={() => set_visible(true)} />
            <CreatePredictionContent visible = {visible}
                set_visible = {set_visible}
                callback = {send_prediction}
                matches_for_prediction = {props.matches_for_prediction}
                leagues_names_for_prediction = {props.leagues_names_for_prediction}
                db_name = {props.db_name}
                game_id = {props.game_id}/>
        </Popover>
    )
}

type CreatePredictionContent = {
    visible: boolean
    set_visible: (visible: boolean) => void
    callback: (prediction: BasePredictionType, prediction_id?: number) => void
    matches_for_prediction: string[]
    leagues_names_for_prediction: string[]
    db_name: string
    game_id: number
    prediction_id?: number
    initial_values?: BasePredictionType
}

export const CreatePredictionContent: React.FC<CreatePredictionContent> = (props) => {
    const [visibility_value_input, set_visibility_value_input] = useState(true)
    const [min_range, set_min_range] = useState<number>(-10)

    const [form] = AntForm.useForm()

    const onFieldsChange = (field_data: FieldData[], allFields: FieldData[]) => {
        let form_data = field_data[0]
        if (!form_data) return
        if (form_data.value === 'x' || form_data.value === '!x') {
            set_visibility_value_input(false)
        }
        else set_visibility_value_input(true)
        if (form_data.value === 'TO' || form_data.value === 'TU') {
            set_min_range(0.5)
        }
        else if (form_data.value === 'home' || form_data.value === 'away') {
            set_min_range(-10)
        }
    }

    const { db_name, game_id } = props

    let initial_values: BasePredictionType = props.initial_values ? props.initial_values : {
        league_name: props.leagues_names_for_prediction.length === 1 ? props.leagues_names_for_prediction[0] : undefined,
        teams: props.matches_for_prediction.length === 1 ? props.matches_for_prediction[0] : undefined,
        kind_of_bet: kinds_of_bet[0],
        odd_type: 'home',
        value: 0,
        odd: 1.9,
        public: true,
        description: '',
        db_name,
        game_id
    }

    const dispatch = useDispatch()

    return (
        <Modal visible={props.visible} title='Create Prediction'
            okText='Create'
            onOk={() => {
                form
                    .validateFields()
                    .then((values: BasePredictionType) => {
                        set_min_range(-10)
                        props.set_visible(false)
                        form.resetFields()
                        let callback = props.prediction_id ? props.callback({ ...values, db_name, game_id }, props.prediction_id)
                                                           : props.callback({ ...values, db_name, game_id }) 

                        dispatch(callback);
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}
            onCancel={() => props.set_visible(false)}>
            <div>
                <AntForm.Provider onFormChange={
                    (name, info) => {
                        if (name !== 'main') return
                        const { main } = info['forms']
                        let { changedFields } = info
                        if (!changedFields || !changedFields.length) return
                        let changedField = changedFields[0]
                        if (changedField['value'] === 'TU' || changedField['value'] === 'TO') {
                            main.setFieldsValue({ value: 0.5 })
                        }
                    }
                }>
                    <AntForm name='main' form={form} initialValues={initial_values} onFieldsChange={onFieldsChange}>
                        {create_select_item(props.leagues_names_for_prediction, 'League', 'league_name')}
                        {create_select_item(props.matches_for_prediction, 'Match', 'teams')}
                        {create_select_item(kinds_of_bet, 'Kind of Bet', 'kind_of_bet')}
                        {create_select_item(types_of_bet, 'Bet Type', 'odd_type')}
                        {visibility_value_input &&
                            <AntForm.Item label="Value" name='value'>
                                <InputNumber min={min_range} step={0.5} />
                            </AntForm.Item>}
                        <AntForm.Item label="Odd" name='odd'>
                            <InputNumber min={1} step={0.1} />
                        </AntForm.Item>
                        <Popover placement='topLeft' content='Add to public prediction board'>
                            <AntForm.Item label="Public" name='public' valuePropName="checked">
                                <Switch />
                            </AntForm.Item>
                        </Popover>
                        <AntForm.Item label="Description" name='description'>
                            <TextArea />
                        </AntForm.Item>
                    </AntForm>
                </AntForm.Provider>
            </div>
        </Modal>
    )
}

export default CreatePredictionBlock