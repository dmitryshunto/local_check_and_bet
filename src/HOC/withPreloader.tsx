import React from 'react';
import { isEmpty } from '../CommonFunctions/commonFunctions';

interface K {
    [key: string]: any
}

export function withRenderByCondition<T extends K>(NewComponent: React.FC<T>, condition: string, property?: string | undefined) {
    return (WrappedComponent: React.FC<T>) => {
        const RenderByConditionHOC = (props: T) => {
            const new_condition = property === undefined ? props[condition] : props[condition][property]           
            return (
                  isEmpty(new_condition)  
                  ? <WrappedComponent {...props}/> 
                  : <NewComponent {...props}/>)
        }
        return RenderByConditionHOC 
    }
} 

