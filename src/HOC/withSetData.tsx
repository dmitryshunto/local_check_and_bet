import React from 'react';
import { useSubscribeOnData } from '../Hooks/Hooks';
import { TypeWithStringKey } from './withPreloader';

function withSetData<T extends TypeWithStringKey>(OriginalComponent: React.FC<T>, setDataFunctionName: string,
    deleteDataFunctionName: string, args: string[]): React.FC<T> {
    const WrappedComponent: React.FC<T> = (props) => {
            const setDataFunction = props[setDataFunctionName]
            const deleteDataFunction = props[deleteDataFunctionName]
            let argums: any[] = []
            for(let arg of args) {
                argums.push(props[arg])
            }
            useSubscribeOnData(setDataFunction, deleteDataFunction, [...argums])
            return <OriginalComponent {...props} />
    }
    return WrappedComponent
}

export default withSetData