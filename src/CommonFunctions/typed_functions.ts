import {TotalsInfoType} from '../redux/championship_stats_reducer'

type GetTotalInfo = {
    over: number
    under: number
}

export const get_total_info = (totals_info: TotalsInfoType, total: number): GetTotalInfo => {
    
    const result: GetTotalInfo = {
        over: 0.5,
        under: 0.5
    }

    totals_info.forEach(total_info => {
        if(total_info.total === total) {
            result.over = total_info.over
            result.under = total_info.under
        }
    })

    return result
}
