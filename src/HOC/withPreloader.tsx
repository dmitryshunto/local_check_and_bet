import React from 'react';
import { isEmpty } from '../CommonFunctions/commonFunctions';

export interface TypeWithStringKey {
    [key: string]: any
}

export function withRenderByCondition<T extends TypeWithStringKey>(NewComponent: React.FC<T>, condition: string, property?: string | undefined) {
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

export function withPreloader<T extends TypeWithStringKey>(PreloaderComponent: React.FC, condition: string) {
    return (WrappedComponent: React.FC<T>) => {
        const WithPreloaderHOC: React.FC<T> = (props) => {
            const is_getting_prediction = props[condition]
            return (
                is_getting_prediction
                ?  <PreloaderComponent />
                : <WrappedComponent {...props} />
            )
        }
        return WithPreloaderHOC
    }
}

