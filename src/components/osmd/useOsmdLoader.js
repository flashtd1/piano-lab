import { useEffect, useState } from "react"
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay"

let osmd

function useOsmdInit (osmdRef) {
  let [os, setOs] = useState(null)
  console.log('进入 init hook')
  useEffect(() => {
    osmd = new OpenSheetMusicDisplay(osmdRef.current, {
      autoResize: true,
      // backend: backendType,
      //backend: "canvas",
      disableCursor: false,
      drawingParameters: "compact",// : "default", // try compact (instead of default)
      drawPartNames: true, // try false
      drawTitle: true,
      drawSubtitle: true,
      drawFingerings: true,
      fingeringPosition: "left", // left is default. try right. experimental: auto, above, below.
      fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
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
    setOs(osmd)
  }, [osmdRef])
  return os
}


function useResize (isLoaded) {
  let width = document.body.clientWidth
  console.log(width)
  useEffect(() => {
    if (isLoaded) {
      if (width < 480) {
        osmd.zoom = 0.3
        console.log('render')
        osmd.render()
      }
    }
  }, [isLoaded])
}

function useLoadXml (musicxmlpath) {
  let [loaded, setLoaded] = useState(false)
  console.log('进入 load hook')

  useEffect(() => {
    console.log('进入 load effect')
    const fetchXml = async () => {
      if (osmd) {
        console.log('进入 load fetch')
        await osmd.load(musicxmlpath)
        osmd.render()
        setLoaded(true)
      } else {
        await console.log('进入 load else')
        setLoaded(false)
      }
    }
    fetchXml()
  }, [musicxmlpath])
  console.log('退出 load hook')
  return loaded
}

function usePlay(midi, state, callback) {
  let [currentTimeoutNumber, setTimeoutNumber] = useState(0)

  function onNote(iterator) {
    if (!iterator.endReached) {
      let allNotes = []
      const voices = iterator.currentVoiceEntries;
      let minTimeStamp = 0
      for(var i = 0; i < voices.length; i++){
        const v = voices[i];
        const notes = v.notes;
        // console.log(`声音fraction${i}`, v.Timestamp)
        // console.log(`声音长度${i}`, v.Timestamp.realValue)
        // console.log(`指针时间长度${i}`, iterator.currentTimeStamp.realValue)
        for(var j = 0; j < notes.length; j++){
          const note = notes[j];
          // console.log(`note长度`, note.Length)
          // make sure our note is not silent
          if((note !== null)){
            allNotes.push({
                "note": note.halfTone+12, // see issue #224
                "time": note.Length.realValue * 4
            })
            if (minTimeStamp) {
              minTimeStamp = Math.min(minTimeStamp, note.Length.realValue)
            } else {
              minTimeStamp = note.Length.realValue
            }
            // console.log(iterator.currentTimeStamp.realValue * 4)
          }
        }
        play(allNotes)
      }
      console.log('-----')
      return minTimeStamp
    } else {
      return null
    }
  }

  function play(notes) {
    for(let i = 0; i < notes.length; i++) {
      midi.noteOn(0, notes[i].note, 127, 0)
      midi.noteOff(0, notes[i].note, notes[i].time)
    }
  }

  function playAll(cursor) {
    let nextTime = onNote(cursor.iterator)
    if (nextTime != null) {
      let currentBpm = cursor.iterator.CurrentMeasure.TempoInBPM

      // console.log('总时间戳', cursor.iterator.currentTimeStamp.realValue)
      // console.log('本次持续的时长', nextTime)
      // console.log('计算的毫秒数', nextTime * 4 * 60 / currentBpm * 1000)
      
      if (!cursor.iterator.endReached) {
        cursor.next()
        let timeoutNumber = setTimeout(()=> {
          playAll(cursor)
        }, nextTime * 4 * 60 / currentBpm * 1000)
        setTimeoutNumber(timeoutNumber)
      } else {
        callback('playing', false)
        clearTimeout(currentTimeoutNumber)
      }
    } else {
      callback('playing', false)
      clearTimeout(currentTimeoutNumber)
      return 
    }
  }

  useEffect(() => {
    console.log('进入 playing effect')
    switch (state) {
      case 'stop':
        clearTimeout(currentTimeoutNumber)
        break
      case 'step-forward':
        onNote(osmd.cursor.iterator)
        console.log(osmd.cursor.iterator.CurrentEnrolledTimestamp)
        osmd.cursor.next()
        callback('step')
        break
      case 'play':
        clearTimeout(currentTimeoutNumber)
        playAll(osmd.cursor)
        break
      case 'pause':
        clearTimeout(currentTimeoutNumber)
        break
      default:
        console.log(state)
        break
    }
  }, [state])

}

export {
  useOsmdInit,
  useLoadXml,
  useResize,
  usePlay
}