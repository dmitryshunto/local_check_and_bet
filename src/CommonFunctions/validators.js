export const required = value => (value || typeof value === 'number' ? undefined : 'Required')
export const maxLength = max => value =>
    value && value.length > max ? `Must be ${max} characters or less` : undefined
export const minLength = min => value =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined
export const alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? 'Only alphanumeric characters'
        : undefined


export const validate = values => {
    const errors = {}
    if (!values.login) {
        errors.login = 'Required'
    } else if (values.login.length > 15 || values.login.length < 6) {
        errors.login = 'Login must have length between 6 and 15 chars'
    }
    if (!values.password) {
        errors.password = 'Required'
    } else if (values.password.length < 8) {
        errors.password = 'Password must have length 8 chars or more'
    }
    if (!values.confirm_password) {
        errors.confirm_password = 'Required'
    } else if (values.confirm_password !== values.password) {
        errors.confirm_password = 'Passwords must match'
    } 
    return errors
}

export const login_validate = values => {
    const errors = {}
    if (!values.login) {
        errors.login = 'Required'
    }
    if (!values.password) {
        errors.password = 'Required'
    }
    return errors

}


