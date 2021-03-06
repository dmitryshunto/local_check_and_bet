import React from 'react';
import { TypeWithStringKey } from '../CommonFunctions/common_types';
import { useSubscribeOnData } from '../Hooks/Hooks';

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