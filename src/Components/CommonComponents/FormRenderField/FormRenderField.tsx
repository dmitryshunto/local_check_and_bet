import React from 'react'
import { WrappedFieldProps } from 'redux-form'
import { Form, Input, InputNumber, Select } from "antd";
import { transform_name_for_ui } from '../../../CommonFunctions/typed_functions';

const FormItem = Form.Item;

type FormItemProps = {
    hasFeedback: boolean,
    label: string
    children: React.ReactNode
}

export const create_select_item = (arr: string[], label: string, name: string) => {
    const items = arr.map(item => {
        return (
            <Select.Option value={item} key={item}>
                {transform_name_for_ui(item)}
            </Select.Option>
        )
    })
    return <Form.Item label={label} name = {name}>
        <Select>
            {items}
        </Select>
    </Form.Item>
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



export const AntInput = antRenderField(Input)
export const AntInputNumber = antRenderField(InputNumber)

export default antRenderField