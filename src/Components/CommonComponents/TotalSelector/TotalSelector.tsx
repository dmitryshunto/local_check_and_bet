import React from 'react'

type PropsTypes = {
    totals_list: number[]
    basic_total: number
    callback: (total: number) => void
}

const TotalSelector: React.FC<PropsTypes> = ({totals_list, basic_total, callback}) => {
    const options = totals_list.map(total => {
        return (
            <option key = {total} defaultValue = {+total} selected = {total === basic_total}>
                {total}
            </option>
        )
    })
    return (
        <select onChange = {(e) => callback(+e.currentTarget.value)}>
            {options}
        </select>
        
    )
}

export default TotalSelector