import { io, Socket } from 'socket.io-client'
import { base_url } from '../config'
import { BasePredictionType, EditPredictionArgsType, PredictionType } from '../redux/prediction_board'
import { BaseAPIType } from './api_types'

let subscribers = {
    'predictions-received': [] as SubscriberType<PredictionType>[],
    'status-changed': [] as SubscriberType<boolean>[],
    'prediction_sent_success': [] as SubscriberType<BaseAPIType>[],
    'prediction_deleted': [] as SubscriberType<number>[],
    'prediction_deleted_success': [] as SubscriberType<BaseAPIType>[],
    'prediction_edited': [] as SubscriberType<EditPredictionArgsType>[],
    'prediction_edition_success': [] as SubscriberType<BaseAPIType>[]
}

export type EventType = keyof typeof subscribers

const PREDICTION_RECEIVED: EventType = 'predictions-received'
const PREDICTION_RECEIVING_SUCCESS: EventType = 'prediction_sent_success'
const PUBLIC_PREDICTION_DELETED: EventType = 'prediction_deleted'
const PREDICTION_DELETION_SUCCESS: EventType = 'prediction_deleted_success'
const PUBLIC_PREDICTION_EDITED: EventType = 'prediction_edited'
const PREDICTION_EDITION_SUCCESS: EventType = 'prediction_edition_success'

type SubscriberType<SubscriberArgsType> = (payload: SubscriberArgsType) => void

let socket: Socket | null = null

const operation_success_handler = (event: 'prediction_sent_success' | 'prediction_deleted_success' | 'prediction_edition_success') => {
    socket?.on<EventType>(event, (response: BaseAPIType) => {
        subscribers[event].forEach(cb => cb(response))
    })
}

const create_channel = () => {
    socket = io(base_url, {
        path: '/socket.io',
        transports: ['websocket'],
        secure: true,

    })
    socket.on('connect', () => {
        subscribers['status-changed'].forEach(cb => cb(true))
    })
    socket.on('disconnect', () => {
        subscribers['status-changed'].forEach(cb => cb(false))
    })
    socket.on('connect_error', () => {
        subscribers['status-changed'].forEach(cb => cb(false))
    })
    socket.on<EventType>(PREDICTION_RECEIVED, (prediction: PredictionType) => {
        subscribers[PREDICTION_RECEIVED].forEach(cb => cb(prediction))
    })
    socket.on<EventType>(PUBLIC_PREDICTION_DELETED, (prediction_id: number) => {
        subscribers[PUBLIC_PREDICTION_DELETED].forEach(cb => cb(prediction_id))
    })
    socket.on<EventType>(PUBLIC_PREDICTION_EDITED, ({ prediction_id, prediction }: EditPredictionArgsType) => {
        subscribers[PUBLIC_PREDICTION_EDITED].forEach(cb => cb({ prediction_id, prediction }))
    })

    operation_success_handler(PREDICTION_DELETION_SUCCESS)
    operation_success_handler(PREDICTION_EDITION_SUCCESS)
    operation_success_handler(PREDICTION_RECEIVING_SUCCESS)
}

const remove_channel = () => {
    socket?.close()
    subscribers['status-changed'].forEach(cb => cb(false))
}

export const prediction_board_api = {
    start() {
        create_channel()
    },
    stop() {
        remove_channel()
    },
    subscribe: function <SubscriberArgsType>(cb: SubscriberType<SubscriberArgsType>, event: EventType) {
        //@ts-ignore
        subscribers[event].push(cb)
        return () => {
            //@ts-ignore
            const new_subscribers = subscribers[event].filter(s => s !== cb)
            subscribers[event] = new_subscribers
        }
    },
    send_prediction: (prediction: BasePredictionType, login: string) => {
        socket?.emit<EventType>(PREDICTION_RECEIVED, { prediction, login })
    },
    delete_public_prediction: (prediction_id: number) => {
        socket?.emit<EventType>(PUBLIC_PREDICTION_DELETED, prediction_id)
    },
    edit_prediction: (prediction_id: number, prediction: BasePredictionType) => {
        socket?.emit<EventType>(PUBLIC_PREDICTION_EDITED, { prediction_id, prediction })
    }
}