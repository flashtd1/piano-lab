import React from 'react'
import { Link } from 'react-router-dom'
import {Result, Button} from 'antd'

export default function NonePage () {
    return (
        <Result
            status="404"
            title="404"
            subTitle="页面找不到啦！"
            extra={
                <Link to="/">
                    <Button type="primary">回首页</Button>
                </Link>
            }
        />
    )
}