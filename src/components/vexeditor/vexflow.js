import Vex from 'vexflow'
import React, { useState, Fragment, useEffect, useRef } from 'react'
import useKeyCode from '../../hooks/useKeyCode'

const VF = Vex.Flow

export default function VexFlow () {
  console.log('update')
  let [code, setCode] = useState('')
  const vfRef = useRef()
  const scoreRef = useRef()
  const vf = vfRef.current
  const score = scoreRef.current

  let [systems, setSystems] = useState([])
  let [staves, setStaves] = useState([])
  // 操作层，存当前小节信息
  let [m, setM] = useState(0)
  let [currentNotesStr, setCurrentNotesStr] = useState('') // 当前小节已经输入的音符字符串
  let [costTime, setCostTime] = useState(new VF.Fraction(0,1)) // 当前小节已经花费的时间
  let [canInput, setCanInput] = useState(false) // 当前小节是否能输入
  let [stave, setStave] = useState([]) // 当前小节

  // 添加system
  function addSystem(){
    let systemData = {
      index: m,
      width: 300
    }
    systems.push(systemData)
    setSystems(systems)
    setM(++m)
  }

  // 给当前system添加stave
  function addStave() {
    let newStave = [
      {
        notes: score.notes('B4/1/r')
      }
    ]
    staves.push(newStave)
    setStaves([...staves])
    setStave(newStave)
    setCurrentNotesStr('')
    setCostTime(new VF.Fraction(0, 1))
    setCanInput(true)
    render()
  }

  function writeNote(pitch, rhythmFraction) {
    if (!canInput) {
      console.log('current stave is full')
      return
    }
    costTime.add(rhythmFraction)
    let rhythm = rhythmFraction.toSimplifiedString().substring(1)
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
    if (restNum === 0) {
      setCanInput(false)
    }
    setCostTime(costTime)
    setStave([...stave])
    setCurrentNotesStr(currentNotesStr)
    // 渲染
    render()
  }

  // 清除画布
  function clear () {
    if (!vf) return
    vf.getContext().clear()
  }

  // 渲染
  function render() {
    if (!vf) return
    clear()
    // console.log(systems, staves)
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
      // console.log('vfStave', vfStave)
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

  useKeyCode(setCode)

  useEffect(() => {
    vfRef.current = new VF.Factory({
      renderer: {elementId: 'new-song', width: 2000, height: 2000}
    })
    scoreRef.current = vfRef.current.EasyScore()
  }, [])

  useEffect(() => {
    let pitch = ''
    let rhythm = new VF.Fraction(0,1)
    switch(code) {
      case 53:
        addSystem()
      break
      case 54:
        addStave()
      break
      case 49:
        pitch = 'C4'
        rhythm = new VF.Fraction(1,8)
        writeNote(pitch, rhythm)
        break
      case 50:
        pitch = 'D4'
        rhythm = new VF.Fraction(1,8)
        writeNote(pitch, rhythm)
        break
      case 51:
        pitch = 'E4'
        rhythm = new VF.Fraction(1,8)
        writeNote(pitch, rhythm)
        break
    }
  }, [code])

  return (
    <Fragment>
      <div id="new-song" style={{
        width: '2000px',
        height: '500px'
      }}/>
    </Fragment>
  )
}