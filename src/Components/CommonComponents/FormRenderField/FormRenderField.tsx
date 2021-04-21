import React from 'react'
import { WrappedFieldProps } from 'redux-form'
import { Form, Input } from "antd";

const FormItem = Form.Item;

type FormItemProps = {
    hasFeedback: boolean,
    label: string
    children: React.ReactNode
}

const antRenderField = (Component: React.ComponentType) => {
    return ({ input, meta, children, hasFeedback, label, ...props }: FormItemProps & WrappedFieldProps) => {
        const hasError = meta.touched && meta.invalid;
        return (
            <FormItem                
                label={label}
                validateStatus={hasError ? "error" : "success"}
                hasFeedback={hasFeedback && hasError}
                help={hasError && meta.error}
            >
                <Component {...input} {...props} children={children} />
            </FormItem>
        );
    }
}

export const AntInput = antRenderField(Input);

export default antRenderField