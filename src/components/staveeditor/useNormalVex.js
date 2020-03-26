import { useEffect } from "react"
import Vex from 'vexflow'

const VF = Vex.Flow

function useVexflowInit(vexRef) {
  useEffect(() => {
    let renderer = new VF.Renderer(vexRef.current, VF.Renderer.Backends.SVG)
    renderer.resize(12 + 300*5, 40+ 90*2)
    let context = renderer.getContext()
    let staves = []
    for(let i = 0; i < 10; i++) {
      staves.push(
        new VF.Stave(10 + i%5 * 300, 40 + 90 * Math.floor(i/5), 300).setMeasure((i + 1))
      )
    }

    // Add a clef and time signature.
    staves[0].addClef("treble").addTimeSignature("4/4")
    staves.map((stave) => {
      stave.setContext(context).draw()
    })

    let notes = [
      new VF.StaveNote({clef: 'treble', keys: ['c/4', 'd/4'], duration: '4'}),
      new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: '2' }),
      new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: '4' })
    ]
      
    let voice = new VF.Voice({num_beats: 4, beat_value: 4})
    voice.addTickables(notes)

    let formatter = new VF.Formatter().joinVoices([voice]).format([voice], staves[0].getWidth() - staves[0].getX() - 10 )

    voice.draw(context, staves[0])

    // console.log(stave)
    // console.log(notes[0])
    // let [el1, el2] = notes[0].attrs.el.querySelectorAll(`.vf-notehead`)
    // console.log(el1, el2)
    // console.log(notes[0].note_heads[0].attrs.el = el1)
    // console.log(notes[0].note_heads[1].attrs.el = el2)
    // notes[0].note_heads[0].attrs.el.addEventListener('click', (e) => {
    //     console.log(e, 'click')
    // })
  }, [])
}

export {
  useVexflowInit
}