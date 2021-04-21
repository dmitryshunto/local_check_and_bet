import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, DatePicker } from 'antd';
import moment from 'moment';

type PropsTypes = {
  selectDateOfPrediction: (selected_date_of_prediction: string) => void
  selected_date_of_prediction: string
  additional_url: string
}

const DateButton: React.FC<PropsTypes> = React.memo(({ selected_date_of_prediction, selectDateOfPrediction, additional_url }) => {
  const url = additional_url ? `${additional_url}/${selected_date_of_prediction}` : `${selected_date_of_prediction}`
  return (
    <div>
      <DatePicker
      defaultValue = {moment(new Date(selected_date_of_prediction))}
      onChange = {
        (value) => selectDateOfPrediction(value?.format('YYYY-MM-DD') as string)}/>
      <NavLink exact to = {`/${url}`}>
        <Button type = {'primary'}>Select</Button>
      </NavLink>
    </div>
  )
})

export default DateButton;