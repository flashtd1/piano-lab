import React, { useRef, useEffect, useState } from 'react'
import {OpenSheetMusicDisplay} from 'opensheetmusicdisplay'
import MIDI from 'midi.js'
import { Button } from 'antd'

let lastTime = 0
let osmd

function Osmd() {
    let [toggle, setToggle] = useState(false)

    function onNote(iterator) {
      if (!iterator.endReached) {
        let allNotes = []
        const voices = iterator.currentVoiceEntries;
        for(var i = 0; i < voices.length; i++){
          const v = voices[i];
          const notes = v.notes;
          for(var j = 0; j < notes.length; j++){
            const note = notes[j];
            // make sure our note is not silent
            if((note !== null) && (note.halfTone !== 0)){
              allNotes.push({
                  "note": note.halfTone+12, // see issue #224
                  "time": iterator.currentTimeStamp.realValue * 4
              })
              play(allNotes)
              console.log(iterator.currentTimeStamp.realValue * 4)
              return iterator.currentTimeStamp.realValue
            }
          }
        }
      } else {
        return null
      }
    }

    function play(notes) {
      for(let i = 0; i < notes.length; i++) {
        MIDI.noteOn(0, notes[i].note, 127, 0)
        MIDI.noteOff(0, notes[i].note, notes[i].time)
      }
    }

    function playAll(cursor, time) {
      setTimeout(()=> {
        cursor.next()
        let timeStamp = onNote(cursor.iterator)
        console.log('总时间戳', timeStamp)
        if (timeStamp) {
          let nextTime = timeStamp - lastTime
          lastTime = timeStamp
          console.log('上次的总时长', lastTime)
          console.log('下次持续的时长', nextTime)
          playAll(cursor, nextTime)
        } else {
          clearTimeout()
        }
      }, time * 1500)
    }

    let osmdRef = useRef()
    useEffect(() => {
        console.log('init')
        osmd = new OpenSheetMusicDisplay(osmdRef.current, {
            autoResize: true,
            // backend: backendType,
            //backend: "canvas",
            disableCursor: false,
            drawingParameters: "compact",// : "default", // try compact (instead of default)
            drawPartNames: true, // try false
            // drawTitle: false,
            // drawSubtitle: false,
            drawFingerings: true,
            fingeringPosition: "left", // left is default. try right. experimental: auto, above, below.
            // fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
            setWantedStemDirectionByXml: true, // try false, which was previously the default behavior
            // drawUpToMeasureNumber: 3, // draws only up to measure 3, meaning it draws measure 1 to 3 of the piece.
            drawFromMeasureNumber : 0,
            drawUpToMeasureNumber : Number.MAX_SAFE_INTEGER,

            //drawMeasureNumbers: false, // disable drawing measure numbers
            //measureNumberInterval: 4, // draw measure numbers only every 4 bars (and at the beginning of a new system)

            // coloring options
            coloringEnabled: true,
            // defaultColorNotehead: "#CC0055", // try setting a default color. default is black (undefined)
            // defaultColorStem: "#BB0099",

            autoBeam: false, // try true, OSMD Function Test AutoBeam sample
            autoBeamOptions: {
                beam_rests: false,
                beam_middle_rests_only: false,
                //groups: [[3,4], [1,1]],
                maintain_stem_directions: false
            },

            pageFormat: 'Endless',
            pageBackgroundColor: '#000'
        })

        osmd.load(process.env.PUBLIC_URL + '/music.xml').then(() => {
            console.log('loaded')
            osmd.render()
        })

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
            MIDI.noteOn(0, note, velocity, delay);
            MIDI.noteOff(0, note, delay + 0.75);
          }
        });
    },[])

    return (
        <div>
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
              icon="step-forward"
              onClick={() => {
                osmd.cursor.next()
                onNote(osmd.cursor.iterator)
              }}
            />
            <Button
              shape="circle"
              icon="caret-right"
              onClick={() => {
                osmd.cursor.reset()
                playAll(osmd.cursor)
              }}
            />
            <Button
              shape="circle"
              icon="fast-backward"
              onClick={() => {
                osmd.cursor.reset()
              }}
            />
            <div 
                ref={osmdRef}
                style={{
                    width: '100%'
                    // height: '1200px'
                }}
            >
            </div>
        </div>
        
    )
}

export default Osmd