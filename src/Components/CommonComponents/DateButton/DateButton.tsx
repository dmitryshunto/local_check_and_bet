import React from 'react';

import classes from './DateButton.module.css';
import { NavLink } from 'react-router-dom';

type PropsTypes = {
  selectDateOfPrediction: (selected_date_of_prediction: string) => void
  selected_date_of_prediction: string
  additional_url: string
}

const DateButton: React.FC<PropsTypes> = React.memo(({ selected_date_of_prediction, selectDateOfPrediction, additional_url }) => {
  const url = additional_url ? `${additional_url}/${selected_date_of_prediction}` : `${selected_date_of_prediction}` 
  return (
    <div className={classes.date_button}>
      <input type = "date" value = {selected_date_of_prediction} onChange = {(e) => selectDateOfPrediction(e.currentTarget.value)}/>
      <NavLink exact to = {`/${url}`}>
        <button>Select</button>
      </NavLink>
    </div>
  )
})

export default DateButton;