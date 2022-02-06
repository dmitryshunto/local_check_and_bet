export const getTodayDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}

export const notNullProp = (obj) => {
    let number = [];
    for (let key in obj) {
        if (obj[key]) number.push(key);
    }
    return number;
}
export const translate_kind_of_bet_and_home_away = (str) => {
    switch (str) {
        case 'goals': return 'Голы'
        case 'ycard': return 'ЖК'
        case 'yellow_cards': return 'ЖК'
        case 'corners': return 'УГЛ'
        case 'home': return 'Дома'
        case 'away': return 'В гостях'
        case 'total_over': return 'ТБ'
        case 'total_under': return 'ТМ'
        case 'result_win1': return 'П1'
        case 'result_win2': return 'П2'
        case 'fouls': return 'Фолы'
        case 'shots_on_goal': return 'Удары в створ'
        default : return str
    }
}

export const isEmpty = (prop) => {
    return (
        prop === null
        || prop === undefined
        || (Array.isArray(prop) && prop.length === 0)
        || (prop.constructor === Object && Object.keys(prop).length === 0)
    )
}

export const set_initial_state = (type) => () => {
    return { type }
}

export const roundPlus = (number, charactersNumber) => { 
    if(typeof number !== 'number' || typeof charactersNumber !== 'number') return number
    const m = Math.pow(10, charactersNumber);
    return Math.round(number * m) / m;
}

export const objectRoundTo = (obj, to) => {
    let newObj = {}
    for (let key in obj) {
        newObj[key] = roundPlus(obj[key])
    }
    return newObj
}

