import Vex from 'vexflow'
import React, { useState } from 'react'
import { useRef, Fragment, useEffect } from 'react'
import { useVexflowInit } from './useNormalVex'
import _ from 'lodash'

const VF = Vex.Flow

export default function VexFlow () {
  let vexRef = useRef()

  // 数据层，存放所有小节，所有voice
  // system数量和staves数量相等staves是一个数组，存放每个system下所有的stave
  let [systems, setSystems] = useState([])
  let [staves, setStaves] = useState([])
  let [m, setM] = useState(0)

  // 操作层，存当前小节信息
  let [currentNotesStr, setCurrentNotesStr] = useState('')
  let [costTime, setCostTime] = useState(new VF.Fraction(0,1))
  let [canInput, setCanInput] = useState(false)
  let [stave, setStave] = useState([])
  // useVexflowInit(vexRef)
  useEffect(() => {
    let vf = new VF.Factory({
      renderer: {elementId: 'new-song', width: 2000, height: 2000}
    })

    let score = vf.EasyScore()

    // 在当前stave编写note
    function writeNote(pitch, rhythm) {
      if (!canInput) {
        console.log('current stave is full')
        return
      }
      // 计算新写的note
      let noteTime = null
      if (rhythm === '/8') {
        noteTime = new VF.Fraction(1, 8)
        costTime.add(noteTime)
      } else if (rhythm === '/q') {
        noteTime = new VF.Fraction(1, 4)
        costTime.add(noteTime)
      } else if (rhythm === '/h') {
        noteTime = new VF.Fraction(1, 2)
        costTime.add(noteTime)
      }
      let newNoteStr = `${pitch + rhythm}`
      
      // 计算rest
      let wholeTime = new VF.Fraction(4,4)
      let restTime = wholeTime.subtract(costTime)
      let restNum = restTime.divide(new VF.Fraction(1,8)).quotient()
      
      let restStr = `,B4/8/r`.repeat(restNum)
      // 获取已经编写的note，添加这次添加的noteStr
      currentNotesStr = currentNotesStr ? `${currentNotesStr}, ${newNoteStr}` : newNoteStr
      let notes = score.notes(`${currentNotesStr}${restStr}`)
      // 替换当前stave中的notes
      stave[0].notes = notes
      let voices = systems[m-1].vfSystem.parts[0].voices
      // voices[0] = score.voice(notes)
      // voices[0].setStave(stave[0].vfStave)
      // console.log('systems', systems[m-1].vfSystem.parts[0].voices[0], m)
      
      // 更新数据
      if (restNum === 0) {
        canInput = false
        setCanInput(canInput)
      }
      setCostTime(costTime)
      setStave(stave)
      setCurrentNotesStr(currentNotesStr)
      // 渲染
      VF.Formatter.FormatAndDraw(vf.getContext(), stave[0].vfStave, notes)
      // render()
      // console.log(voices[0])
      // voices[0].draw(vf.getContext(), stave[0].vfStave)
      // if (stave[0].vfStave.rendered) {
      //   stave[0].vfStave.draw()
      // }
    }

    function addStave() {
      staves.push([
        {
          notes: score.notes('B4/1/r')
        }
      ])
      stave = staves[staves.length -1]
      setStaves(staves)
      setStave(stave)
      canInput = true
      setCanInput(canInput)
      currentNotesStr = ''
      setCurrentNotesStr(currentNotesStr)
      costTime = new VF.Fraction(0,1)
      setCostTime(costTime)
      render()
    }

    function addSystem(){
      let systemData = {
        index: m,
        width: 300
      }
      systems.push(systemData)
      setSystems(systems)
      setM(++m)
    }

    function render() {
      clear()
      console.log(systems, staves)
      systems = systems.map((sysData) => {
        let vfSystem = vf.System({
          x: sysData.index * sysData.width,
          width: sysData.width
        })
        sysData.vfSystem = vfSystem
        return sysData
      })

      staves = staves.map((staveData, index) => {
        let vfStave = systems[index].vfSystem.addStave({
          voices: [score.voice(staveData[0].notes)]
        })
        console.log('vfStave', vfStave)
        if (index === 0) {
          vfStave
            .addClef('treble')
            .addTimeSignature('4/4')
            .setTempo(
              {
                  bpm: 96,
                  dots: false,
                  //duration: metronomeExpression.beatUnit
                  duration: "q"
              },
              -0.5 * 10
            )
        }
        vfStave.setMeasure(index + 1)
        staveData[0].vfStave = vfStave
        return staveData
      })
      setSystems(systems)
      setStaves(staves)
      vf.draw()
    }

    function clear () {
      vf.getContext().clear()
    }

    function write({keyCode}) {
      console.log('keyCode', keyCode)
      let pitch = ''
      let rhythm = '/h'

      switch (keyCode) {
        case 49:
          pitch = 'C4'
          rhythm = '/h'
          writeNote(pitch, rhythm)
          break
        case 50:
          pitch = 'D4'
          rhythm = '/q'
          writeNote(pitch, rhythm)
          break
        case 51:
          pitch = 'E4'
          rhythm = '/8'
          writeNote(pitch, rhythm)
          break
        case 53:
          addSystem()
          break
        case 54:
          addStave()
          break
        case 55:
          clear()
          break
        case 13:
          render()
          break
      }
    }
    window.addEventListener('keydown', write)
    return () => {
      window.removeEventListener('keydown', write)
    }

  },[])
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