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
        errors.login = 'Обязательное поле'
    } else if (values.login.length > 15 || values.login.length < 6) {
        errors.login = 'Имя пользователя должно иметь длину 6 - 12 символов'
    }
    if (!values.password) {
        errors.password = 'Обязательное поле'
    } else if (values.password.length < 6) {
        errors.password = 'Пароль должен быть больше 6 символов'
    }
    if (!values.confirm_password) {
        errors.confirm_password = 'Обязательное поле'
    } else if (values.confirm_password !== values.password) {
        errors.confirm_password = 'Пароли должны совпадать'
    } 
    return errors
}
