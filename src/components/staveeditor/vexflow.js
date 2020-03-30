// import Vex from 'vexflow'
import React, { useState, useRef, Fragment, useEffect } from 'react'
import {useLocation, useParams} from 'react-router-dom'
import { useVexflowInit } from './useNormalVex'
import { useSimpleInput } from './useSimpleInput'
import { useSample } from './useSample'
import querystring from 'querystring'

export default function VexFlow () {
  let location = useLocation()
  let vexRef = useRef()
  let qs = querystring.parse(location.search.substring(1))
  console.log(qs)
  useSample(qs.type === 'sample')
  useSimpleInput(qs.type === 'simpleInput' || !qs.type)

  return (
    <Fragment>
      <div ref={vexRef}></div>
      <div id="new-song" style={{
        width: '2000px',
        height: '500px'
      }}/>
    </Fragment>
  )
}