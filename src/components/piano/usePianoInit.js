
import { useEffect, useState } from "react";
import Piano from 'html-piano'
import { useMidi } from "../../hooks/useMidi";

const newPiano = Piano(window).newPiano

function usePianoInit(startNote, endNote) {
  let [piano, setPiano] = useState(null)
  let midi = useMidi()
  useEffect(()=> {
    let p = null
    function onPianoKeydown (key) {
      // console.log("key number", piano.keyNumber(key))
      // console.log("note", piano.keyNote(key))
      // console.log("octave", piano.keyOctave(key))
      midi.setVolume(0, 127);
      midi.noteOn(0, p.keyNumber(key) + 20, 127, 0)
    }
        
    function onPianoKeyup (key) {
      midi.noteOff(0, p.keyNumber(key) + 20, 0.75)
    }

    try {
      p = newPiano(startNote, endNote)
      p.keyDown = onPianoKeydown
      p.keyUp = onPianoKeyup
      setPiano(p)
    } catch (e) {
      console.log(e)
    }
  }, [])
  return piano
}

export { usePianoInit }