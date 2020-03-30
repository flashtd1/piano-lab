// import Vex from 'vexflow'
import React, { useState, useRef, Fragment, useEffect } from 'react'
import { useVexflowInit } from './useNormalVex'
import { useSimpleInput } from './useSimpleInput'
import { useSample } from './useSample'

export default function VexFlow () {
  let vexRef = useRef()
  // useSample()
  useSimpleInput()

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