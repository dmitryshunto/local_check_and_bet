import React from 'react';
import { isEmpty } from '../CommonFunctions/commonFunctions';

export const withRenderByCondition = (NewComponent, condition, property) => (WrappedComponent) => {
    const RenderByConditionHOC = (props) => {
        const new_condition = property === undefined ? props[condition] : props[condition][property]
        return (
              !isEmpty(new_condition)  
              ? <WrappedComponent {...props} />
              : <NewComponent {...props}/>)
    }
    return RenderByConditionHOC
}

