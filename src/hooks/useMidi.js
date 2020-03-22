import { useState, useEffect } from "react";
import MIDI from 'midi.js'

function useMidi() {
    let [midi, setMidi] = useState(MIDI)
    console.log('进入 midi hook')

    useEffect(() => {
      console.log('进入 midi effect')
      function loadPlugin () {
          return new Promise(resolve => {
            MIDI.loadPlugin({
              soundfontUrl: process.env.PUBLIC_URL + "/soundfont/",
              instrument: "acoustic_grand_piano",
              onprogress: function(state, progress) {
                console.log(state, progress);
              },
              onsuccess: function() {
                var delay = 0; // play one note every quarter second
                var note = 72; // the MIDI note
                var velocity = 127; // how hard the note hits
                // play the note
                MIDI.setVolume(0, 127);
                MIDI.noteOn(0, note, velocity, delay)
                MIDI.noteOff(0, note, delay + 0.75)
                resolve(MIDI)
              }
            })
          })
      }
      (async () => {
          let result = await loadPlugin()
          setMidi(result)
      })()
    },[midi])
    console.log('退出 midi hook')
    return midi
}

export { useMidi }