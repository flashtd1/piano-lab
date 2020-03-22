import { useDispatch, useSelector } from 'react-redux'
import { useMidi } from '../../hooks/useMidi'

function useGlMidi () {
  let {loaded, midi} = useSelector(state => state.midi)
  let dispatch = useDispatch()
  let glMIDI = useMidi()
  return () => {
    if (!loaded) {
      dispatch({
        type: 'loaded_MIDI',
        data: glMIDI
      })
    }
    return midi
  }
}

export { useGlMidi }
