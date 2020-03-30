// import Vex from 'vexflow'
import React, { useState, useRef, Fragment, useEffect } from 'react'
import {useLocation, useParams} from 'react-router-dom'
import { useVexflowInit } from './useNormalVex'
import { useSimpleInput } from './useSimpleInput'
import { useSample } from './useSample'
import querystring from 'querystring'

import { Typography } from 'antd'
const { Title, Paragraph } = Typography

export default function VexFlow () {
  let location = useLocation()
  let vexRef = useRef()
  let qs = querystring.parse(location.search.substring(1))
  qs.type = qs.type ? qs.type : 'simpleInput'
  let meta = {}
  meta['sample'] = useSample(qs.type === 'sample')
  meta['simpleInput'] = useSimpleInput(qs.type === 'simpleInput')
  let {title, content} = meta[qs.type]
  return (
    <Fragment>
      <Typography>
        <Title>{title}</Title>
        <Paragraph>{content}</Paragraph>
      </Typography>
      <div ref={vexRef}></div>
      <div id="new-song" style={{
        width: '2000px',
        height: '500px'
      }}/>
    </Fragment>
  )
}