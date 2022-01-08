import React from 'react';
import { Redirect } from 'react-router-dom';
import { TypeWithStringKey } from '../config';

export function withAuthRedirect<T extends TypeWithStringKey>(user_login_props_name: string = 'user_login') {
    return (WrappedComponent: React.FC<T>) => {
        const WithPreloaderHOC: React.FC<T> = (props) => {
            const is_authorized = props[user_login_props_name]
            return (
                is_authorized
                ? <WrappedComponent {...props} /> 
                : <Redirect to = {'loginpage'} />
            )
        }
        return WithPreloaderHOC
    }
}



