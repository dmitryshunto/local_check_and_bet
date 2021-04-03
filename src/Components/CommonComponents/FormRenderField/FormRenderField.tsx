import React from 'react'
import { WrappedFieldProps } from 'redux-form'

type InputType = 'text' | 'password'

type RenderFieldOwnParamsType = {
    label: string
    type: InputType
    placeholder?: string
}

type RenderFieldType = RenderFieldOwnParamsType & WrappedFieldProps

const RenderField = ({
    input,
    label,
    type,
    meta: { touched, error, warning },
    ...props
}: RenderFieldType): React.ReactNode => {
    return (
        <div>
            <div>
                {label}
            </div>
            <div>
                <input {...input} placeholder = {props.placeholder} type={type} />
                {touched &&
                    ((error && <span>{error}</span>) ||
                        (warning && <span>{warning}</span>))}
            </div>
        </div>
    )
}

export default RenderField