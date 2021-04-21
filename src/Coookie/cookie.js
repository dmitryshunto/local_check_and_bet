import { getTodayDate } from '../CommonFunctions/commonFunctions';

export const setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const deleteCookie = (cname) => {
    var d = new Date();
    d.setTime(d.getTime() - (60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=  ;" + expires + ";path=/";
}

export const changeCheckedChampionshipStatus = (name_of_championship, date) => {
    const checked_championships = JSON.parse(localStorage.getItem('checked_championships'))
    const championshipChecked = isChamponshipChecked(name_of_championship, date, checked_championships)
    if(championshipChecked === false) {
        checked_championships[date].push(name_of_championship)
    } else if (championshipChecked === true) {
        checked_championships[date].splice(checked_championships[date].indexOf(name_of_championship), 1)
    }
    localStorage.setItem('checked_championships', JSON.stringify(checked_championships))
}

export const isChamponshipChecked = (name_of_championship, date) => {
    const checked_championships = JSON.parse(localStorage.getItem('checked_championships'))
    if(checked_championships[date]) {
        if(checked_championships[date].indexOf(name_of_championship) === -1) return false
        if(checked_championships[date].indexOf(name_of_championship) !== -1) return true
    }   
}

export const create_new_date_for_checked_championsips_storage = (new_date) => {
    let checked_championships = JSON.parse(localStorage.getItem('checked_championships'))
    if(!checked_championships) checked_championships = {}
    const dates = Object.keys(checked_championships)
    if(dates.indexOf(new_date) === -1) {
        checked_championships[new_date] = []
    }
    localStorage.setItem('checked_championships', JSON.stringify(checked_championships))
}
export const delete_data_about_checked_championship_from_storage = () => {
    const today_date = getTodayDate()
    const checked_championships = JSON.parse(localStorage.getItem('checked_championships')) 
    const dates = Object.keys(checked_championships)
    dates.forEach(date => {
      if(date < today_date) delete checked_championships[date]  
    })
    localStorage.setItem('checked_championships', JSON.stringify(checked_championships))
}