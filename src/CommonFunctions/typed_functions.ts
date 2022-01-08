import { NewKindOfBet, OddTypeType } from '../config'
import { BetType, Book_bet_name_type, MarketType } from '../redux/betReducer'
import { TotalsInfoType } from '../redux/championship_stats_reducer'
import { TypeWithStringKey, ObjectKeys } from '../config'

type GetTotalInfo = {
    over: number
    under: number
}
// bet_value это значение тотала или форы
export const get_odd_types_and_values_from_market = (market: MarketType, bet_value: number | null = null): OddTypeAndValue[] => {
    const book_names = get_book_names_from_market_name(market)
    const result = []
    for (let book_name of book_names) {
        if (bet_value) result.push(get_odd_type_and_value_by_bet_book_name(book_name, bet_value))
        else result.push(get_odd_type_and_value_by_bet_book_name(book_name, bet_value))
    }
    return result
}

export const get_book_names_from_market_name = (market: MarketType): Book_bet_name_type[] => {
    if (market === 'totals') return ['TO', 'TU']
    else if (market === 'double_chance') return ['x1', '!x', 'x2']
    else if (market === 'handicaps') return ['h1', 'h2']
    else return ['w1', 'x', 'w2']
}

export type OddTypeAndValue = { odd_type: OddTypeType, value: number | null }

export const get_odd_type_and_value_by_bet_book_name = (book_bet_name: Book_bet_name_type, bet_value: number | null = null): OddTypeAndValue => {
    let odd_type: OddTypeType = 'home'
    let value = null
    if (book_bet_name.includes('1')) odd_type = 'home'
    if (book_bet_name.includes('2')) odd_type = 'away'
    if (bet_value) {
        if (book_bet_name.includes('h') || book_bet_name.includes('T')) value = bet_value
    }
    if (book_bet_name.includes('w')) value = -0.5
    if (book_bet_name.includes('x') && book_bet_name.length > 1 && !book_bet_name.includes('!')) value = 0.5
    if (book_bet_name === 'x' || book_bet_name === '!x') odd_type = book_bet_name
    return { odd_type, value }
}

export const get_total_info = (totals_info: TotalsInfoType, total: number): GetTotalInfo => {

    const result: GetTotalInfo = {
        over: 0.5,
        under: 0.5
    }

    totals_info.forEach(total_info => {
        if (total_info.total === total) {
            result.over = total_info.over
            result.under = total_info.under
        }
    })

    return result
}

export const get_text_selection_and_condition = (value: number | null, value_probability: number, red_text_class: string,
    green_text_class: string) => {
    let condition = null, className = null
    if (value) {
        if (value_probability * value > 1.3) {
            condition = true
            className = green_text_class
        }
        if (value_probability * value < 0.7) {
            condition = true
            className = red_text_class
        }
    } else {
        if (value_probability >= 0.65) {
            condition = true
            className = green_text_class
        }
    }
    return { condition, className }
}


export const return_bet_object = (kind_of_bet: NewKindOfBet, db_name: string, market: MarketType, game_id: number,
    date_of_match: string, home_team: string, away_team: string) => (value: number | null, odd_type: OddTypeType, odd: number | null, bet_size?: number): BetType => {
        return { kind_of_bet, db_name, market, game_id, date_of_match, value, odd, odd_type, home_team, away_team, bet_size }
    }

export const get_bet_info = (market: MarketType) => {
    switch (market) {
        case 'totals': {
            const result: OddTypeType[] = ['TO', 'TU']
            return result
        }
    }
}
export const isBetInArrayOfBets = (bet: BetType, bets: BetType[] | []) => {
    const bet_in_arr = bets.filter(b => {
        if (b.game_id === bet.game_id && b.kind_of_bet === bet.kind_of_bet && b.odd_type === bet.odd_type && b.value === bet.value) return true
        return false
    })
    if (bet_in_arr.length) return true
    return false
}

export const transform_date_for_UI = (string_date: Date) => {
    const days = string_date.getDate()
    const months = string_date.getMonth() + 1
    const dd = days < 10 ? `0${days}` : days
    const mm = months < 10 ? `0${months}` : months
    return `${dd}-${mm}-${string_date.getFullYear()}`
}

export const transform_name_for_ui = (name: string) => {
    if(!name) return null
    const reg_exp = new RegExp('_', 'g')
    const without_space = name.replace(reg_exp, ' ')
    const minus_reg_exp = new RegExp('-', 'g')
    return without_space.replace(minus_reg_exp, ' ')
}

export function create_sorter<T extends TypeWithStringKey>(key: ObjectKeys<T>) {
    return (a: T, b: T) => {
        if (a[key] > b[key]) return 1
        else if (a[key] < b[key]) return -1
        else return 0
    }
}

export const play_sound = (src: string) => {
    const sound = new Audio(src)
    sound.load()
    sound.play()
}
