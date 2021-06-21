import { OddTypeType } from "./redux/betReducer"
import { NewKindsOfBet } from "./redux/redux"

export const base_url = "http://localhost:3001/"// 'http://a0538478.xsph.ru/'
export const kinds_of_bet: NewKindsOfBet = ['goals', 'corners', 'yellow_cards', 'shots_on_goal', 'fouls']
export const types_of_bet: OddTypeType[] = ['home', 'away', 'x', '!x', 'TO', 'TU']
