import React, { Fragment } from 'react'
import { useSimpleInput } from './useSimpleInput'

import { Typography } from 'antd'
const { Title, Paragraph } = Typography

export default function VexFlow () {
  let {title, content} = useSimpleInput()
  return (
    <Fragment>
      <Typography>
        <Title>{title}</Title>
        <Paragraph>{content}</Paragraph>
      </Typography>
      <div id="new-song" style={{
        width: '2000px',
        height: '500px'
      }}/>
    </Fragment>
  )
}