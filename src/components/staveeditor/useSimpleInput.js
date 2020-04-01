import Vex from 'vexflow'
import { useState, useEffect, useRef } from 'react'
import _ from 'lodash'

const VF = Vex.Flow

function useSimpleInput () {
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

  let vf = useRef()
  let score = useRef()

  // 在当前stave编写note
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
    let notes = score.current.notes(`${currentNotesStr}${restStr}`)
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
    render()
  }

  // 给当前system添加stave
  function addStave() {
    staves.push([
      {
        notes: score.current.notes('B4/1/r')
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

  // 渲染
  function render() {
    clear()
    console.log(systems, staves)
    systems = systems.map((sysData) => {
      let vfSystem = vf.current.System({
        x: sysData.index * sysData.width,
        width: sysData.width
      })
      sysData.vfSystem = vfSystem
      return sysData
    })

    staves = staves.map((staveData, index) => {
      let vfStave = systems[index].vfSystem.addStave({
        voices: [score.current.voice(staveData[0].notes)]
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
    vf.current.draw()
  }

  // 清除画布
  function clear () {
    if (!vf.current) return 
    vf.current.getContext().clear()
  }

  // 按键事件处理
  function keyDown({keyCode}) {
    console.log('keyCode', keyCode)
    console.log('keyDown: canInput', canInput)
    let pitch = ''
    let rhythm = new VF.Fraction(0,1)

    switch (keyCode) {
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
  
  useEffect(() => {
    vf.current = new VF.Factory({
      renderer: {elementId: 'new-song', width: 2000, height: 2000}
    })
    score.current = vf.current.EasyScore()
    window.addEventListener('keydown', keyDown)
    
    return () => {
      window.removeEventListener('keydown', keyDown)
    }

  },[])
  return {
    title: '说明',
    content: '5 新建system， 6 新建stave， 7 清空画布， 回车 重新渲染， 1~3 输入音符'
  }
}

export {
    useSimpleInput
}