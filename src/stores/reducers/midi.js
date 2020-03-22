
export default function midi(midi={
    loaded: false,
    midi: null
}, action) {
    switch(action.type) {
        case 'loaded_MIDI':
            return {
                loaded: true,
                midi: action.data
            }
    }
    return midi
}