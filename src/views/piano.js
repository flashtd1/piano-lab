import React, { useEffect, useRef } from 'react'
import Piano from 'html-piano'
import MIDI from 'midi.js'
import '../assets/piano.css'
const newPiano = Piano(window).newPiano

let piano
function PianoPage () {
  let pianoDom = useRef()

  function onPianoKeydown (key) {
    // console.log("key number", piano.keyNumber(key))
    // console.log("note", piano.keyNote(key))
    // console.log("octave", piano.keyOctave(key))
    MIDI.setVolume(0, 127);
    MIDI.noteOn(0, piano.keyNumber(key) + 20, 127, 0)
  }

  function onPianoKeyup (key) {
    MIDI.noteOff(0, piano.keyNumber(key) + 20, 0.75)
  }

  useEffect(() => {
    const startNote = {
      note: "a",
      octave: 0
    }
    const endNote = {
      note: "c",
      octave: 8
    }
    if (!piano) {
      try {
        piano = newPiano(startNote, endNote)
        piano.keyDown = onPianoKeydown
        piano.keyUp = onPianoKeyup
        // console.log(piano)
      } catch (e) {
        console.log(e)
      }
      pianoDom.current.appendChild(piano.HTML)
    }

    MIDI.loadPlugin({
      soundfontUrl: process.env.PUBLIC_URL + "/soundfont/",
      instrument: "acoustic_grand_piano",
      onprogress: function(state, progress) {
        console.log(state, progress)
      },
      onsuccess: function() {
        var delay = 0 // play one note every quarter second
        var note = 72 // the MIDI note
        var velocity = 127 // how hard the note hits
        // play the note
        MIDI.setVolume(0, 127)
        MIDI.noteOn(0, note, velocity, delay)
        MIDI.noteOff(0, note, delay + 0.75)
      }
    })
  }, [])
  return (
    <div>
      <div 
        ref={pianoDom}
        style={{
          width: '100%',
          height: '150px',
          position: 'fixed',
          bottom: '0px'
        }}
      ></div>
    </div>
  )
}

export default PianoPage