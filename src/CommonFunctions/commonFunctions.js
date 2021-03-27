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
    else if (str === 'ycard' || str === 'yellow_cards') return 'ЖК'
    else if (str === 'corners') return 'УГЛ'
    else if (str === 'home') return 'Дома'
    else if (str === 'away') return 'В гостях'
    else if (str === 'total_over') return 'ТБ'
    else if (str === 'total_under') return 'ТМ'
    else if (str === 'result_win1') return 'П1'
    else if (str === 'result_win2') return 'П2'
    else if (str === 'fouls') return 'Фолы'
    else if (str === 'shots_on_goal') return 'Удары в створ'

}
// проверяет есть ли ставка с выбранным типом (тотал, исход) в массиве ставок

export const filterAddedBetsArray = (addedBet, game_id, kind_of_bet, market) => {
    if (addedBet['game_id'] === game_id && addedBet.market === market && addedBet.kind_of_bet === kind_of_bet) {
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
