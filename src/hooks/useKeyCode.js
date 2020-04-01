import { useEffect, useState } from "react"

export default function() {
    const [code, setCode] = useState('')
    function getKey({keyCode}) {
        setCode(keyCode)
    }
    useEffect(() => {
        window.addEventListener('keydown', getKey)
        return () => {
            window.removeEventListener('kendown', getKey)
        }
    }, [])
    return code
}