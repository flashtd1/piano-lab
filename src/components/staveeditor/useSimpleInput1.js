import Vex from 'vexflow'
import { useState, useEffect } from 'react'
import _ from 'lodash'

const VF = Vex.Flow

function useSimpleInput1 (show) {
  // 数据层，存放所有小节，所有voice
  // system数量和staves数量相等staves是一个数组，存放每个system下所有的stave
  let [systems, setSystems] = useState([])
  let [staves, setStaves] = useState([])

  // 操作层，存当前小节信息
  let [m, setM] = useState(0)
  let [currentNotesStr, setCurrentNotesStr] = useState('') // 当前小节已经输入的音符字符串
  let [costTime, setCostTime] = useState(new VF.Fraction(0,1)) // 当前小节已经花费的时间
  let [canInput, setCanInput] = useState(false) // 当前小节是否能输入
  let [stave, setStave] = useState([]) // 当前小节
  
  // 工具\信号
  let [renderSig, setRenderSig] = useState(0) // 渲染信号
  let [vf, setVF] = useState(null) // Vexflow工厂实例
  let [score, setScore] = useState(null) // Vexflow的Score工厂实例

  // 在当前stave编写note
  function writeNote(pitch, rhythmFraction) {
    console.log(canInput)
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
    let voices = systems[m-1].vfSystem.parts[0].voices
    // voices[0] = score.voice(notes)
    // voices[0].setStave(stave[0].vfStave)
    // console.log('systems', systems[m-1].vfSystem.parts[0].voices[0], m)
    
    // 更新数据
    // if (restNum === 0) {
    //   canInput = false
    //   setCanInput(canInput)
    // }
    if (restNum === 0) {
      setCanInput(false)
    }
    setCostTime(costTime)
    setStave([...stave])
    setCurrentNotesStr(currentNotesStr)
    // 渲染
    setRenderSig(Math.random())
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
    setRenderSig(Math.random())
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
    if (!vf) return
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
    setSystems([...systems])
    setStaves([...staves])
    vf.draw()
  }

  // 清除画布
  function clear () {
    if (!vf) return 
    vf.getContext().clear()
  }

  // 按键事件处理
  function keyDown({keyCode}) {
    console.log('keyCode', keyCode)
    console.log('canInput', canInput)
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
    if (show) {
      vf = new VF.Factory({
        renderer: {elementId: 'new-song', width: 2000, height: 2000}
      })
      score = vf.EasyScore()
      setVF(vf)
      setScore(score)
      window.addEventListener('keydown', keyDown)
    }
    
    return () => {
      if (show) {
        window.removeEventListener('keydown', keyDown)
      }
    }

  },[])

  useEffect(() => {
    console.log('renderSig: canInput', canInput)
    render()
  }, [renderSig])

  return {
    title: '说明',
    content: '5 新建system， 6 新建stave， 7 清空画布， 回车 重新渲染， 1~3 输入音符'
  }
}

export {
    useSimpleInput1
}