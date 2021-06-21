import { Button, Result } from 'antd'
import React from 'react'

const PageNotFound: React.FC = () => {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="link" href = 'my_net_main_page'>Back Home</Button>}
        />)
}

export default PageNotFound