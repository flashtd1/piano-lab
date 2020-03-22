import React, { useRef, useEffect, useState } from 'react'
import { Note, AccidentalEnum, Fraction, Pitch, SourceMeasure, PointF2D, Staff, GraphicalMeasure, VoiceEntry } from 'opensheetmusicdisplay'
import { Button, Affix } from 'antd'
import { useMidi } from '../../hooks/useMidi'
import { useLoadXml, useOsmdInit, usePlay, useResize } from './useOsmdLoader'

let osmd

function Osmd(props) {
  let {xmlPath} = props
  let [toggle, setToggle] = useState(false)
  let [follow, setFollow] = useState(false)
  let [isPlaying, setIsPlaying] = useState(false)
  let [playerState, setState] = useState('stop')
  let osmdRef = useRef()
  let midi = useMidi()
  osmd = useOsmdInit(osmdRef)
  let isLoaded = useLoadXml(xmlPath)
  usePlay(midi, playerState, (key,state) => {
    if (key === 'playing') {
      setIsPlaying(state)
    }
    if (key === 'step') {
      setState('none')
    }
  })

  return (
    <div>
      {
        isLoaded ? (<Affix offsetTop={90}>
        <Button
          shape="circle"
          icon={
            toggle ? 'eye-invisible' : 'eye' 
          }
          onClick={() => {
            toggle = !toggle
            if (toggle) {
              osmd.cursor.show()
            } else {
              osmd.cursor.hide()
            }
            setToggle(toggle)
          }}
          />
        <Button
          shape="circle"
          icon={
            follow ? 'eye-invisible' : 'eye' 
          }
          onClick={() => {
            follow = !follow
            osmd.FollowCursor = follow
            setFollow(follow)
          }}
          />
        <Button
          shape="circle"
          icon="step-forward"
          onClick={() => {
            setState('step-forward')
            // console.log(osmd.Sheet.MusicPartManager)
            // console.log(osmd.cursor.iterator.CurrentEnrolledTimestamp)
          }}
          />
        <Button
          shape="circle"
          icon="step-backward"
          onClick={() => {
            console.log(osmd.Sheet.MusicPartManager)
            osmd.cursor.iterator = osmd.Sheet.MusicPartManager.getIterator(new Fraction(7, 8))
            osmd.cursor.update()
          }}
        />
        <Button
          shape="circle"
          icon={
            isPlaying ? 'pause' : 'caret-right'
          }
          onClick={() => {
            isPlaying = !isPlaying
            if (isPlaying) {
              setState('play')
            } else {
              setState('pause')
            }
            setIsPlaying(isPlaying)
          }}
        />
        <Button
          shape="circle"
          icon="fast-backward"
          onClick={() => {
            osmd.cursor.reset()
          }}
        />
      </Affix>) : (<div />)
      }
      <div 
        ref={osmdRef}
        style={{
            width: '100%'
        }}
        />
    </div>
  )
}

export default Osmd