import { useEffect, useState } from "react"

export default function(setCode) {
    function getKey({keyCode}) {
        setCode(keyCode)
    }
    useEffect(() => {
        window.addEventListener('keydown', getKey)
        return () => {
            window.removeEventListener('kendown', getKey)
        }
    }, [])
}