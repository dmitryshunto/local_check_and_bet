export const base_url = "http://localhost:3001/" // 'http://a0538478.xsph.ru/'

export type ObjectKeys<T> = keyof T

export interface TypeWithStringKey {
    [key: string]: any
}
export type OddTypeType = 'home' | 'away' | 'TO' | 'TU' | 'x' | '!x'
export type NewKindOfBet = 'goals' | 'corners' | 'yellow_cards' | 'fouls' | 'shots_on_goal'
export type NewKindsOfBet = NewKindOfBet[]

export const kinds_of_bet: NewKindsOfBet = ['goals', 'corners', 'yellow_cards', 'shots_on_goal', 'fouls']
export const types_of_bet: OddTypeType[] = ['home', 'away', 'x', '!x', 'TO', 'TU']
export type ColumnsInfoType<DataType> = {
    title: string
    dataIndex: ObjectKeys<DataType>
    withSorter?: boolean
    withFilter?: boolean
}