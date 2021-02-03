import withAddedBets from "../HOC/withSelectionAddedBets";

export const getTodayDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}

export const objectRoundTo = (obj, to) => {
    let x = (a) => {
        return typeof (a) === 'number' ? +a.toFixed(to) : a;
    };
    let newObj = {};
    for (let key in obj) {
        newObj[key] = x(obj[key]);
    }
    return newObj;
}

export const notNullProp = (obj) => {
    let number = [];
    for (let key in obj) {
        if (obj[key]) number.push(key);
    }
    return number;
}
export const translate_kind_of_bet_and_home_away = (str) => {
    if (str === 'goals') return 'Голы'
    else if (str === 'ycard') return 'ЖК'
    else if (str === 'corners') return 'УГЛ'
    else if (str === 'home') return 'Дома'
    else if (str === 'away') return 'В гостях'
    else if (str === 'total_over') return 'ТБ'
    else if (str === 'total_under') return 'ТМ'
    else if (str === 'result_win1') return 'П1'
    else if (str === 'result_win2') return 'П2'
}

export const betEqual = (bet1) => (bet2) => {
    return JSON.stringify(bet1) === JSON.stringify(bet2);
}

export const filterAddedBetsArray = (addedBet, names_of_teams, kind_of_bet, market) => {
    if (addedBet.name_of_team1 === names_of_teams[0] && addedBet.name_of_team2 === names_of_teams[1]
        && addedBet.market === market && addedBet.kind_of_bet === kind_of_bet) {
        return true
    } else return false
}
export const isEmpty = (prop) => {
    return (
        prop === null
        || prop === undefined
        || (Array.isArray(prop) && prop.length === 0)
        || (prop.constructor === Object && Object.keys(prop).length === 0)
    )
}


export const createBetMarkets = (props, classes, ThreeWayBetMarket, TwoWayBetMarket, name_of_championship) => {
    const { bet_block, names_of_teams, kind_of_bet, addBet, removeBet, addedBets, basic_total, date_of_match } = props
    const kind_of_markets = Object.keys(bet_block) // ставки на два исхода или на три
    const result = kind_of_markets.map(kind_of_market => {
        const markets = Object.keys(props.bet_block[kind_of_market]) // вид ставки (результат, тотал и т.д.)
        return markets.map((market, index) => {
            const market_with_data = bet_block[kind_of_market][market]
            let odd_blocks = []
            let Component
            if (kind_of_market === 'three_way_bets') {
                odd_blocks = [market_with_data.leftblock, market_with_data.centerblock, market_with_data.rightblock]
                Component = ThreeWayBetMarket
            } else if (kind_of_market === 'two_way_bets') {
                odd_blocks = [market_with_data.leftblock, market_with_data.rightblock]
                Component = TwoWayBetMarket
            }
            return withAddedBets({
                name_of_championship, date_of_match,
                market, names_of_teams, kind_of_bet,
                addedBets, classes, odd_className: 'market_odd', odd_blocks,
                filterAddedBetsArray: filterAddedBetsArray,
                addBet, removeBet, index, basic_total
            })(Component)
        })
    })
    return result
}

export const filterFunction = () => {
    let input, filter, championships_list, championship_item, a, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    championships_list = document.getElementById("championships_list");
    championship_item = championships_list.getElementsByTagName('li');

    for (i = 0; i < championship_item.length; i++) {
        a = championship_item[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            championship_item[i].style.display = "";
        } else {
            championship_item[i].style.display = "none";
        }
    }
}

export const set_initial_state = (type) => () => {
    return { type }
}

export const round_plus = (x, n) => { //x - число, n - количество знаков
    const m = Math.pow(10, n);
    return Math.round(x * m) / m;
}
