import React, { Fragment } from 'react'
import {useLocation} from 'react-router-dom'
import VexFlow1 from '../components/staveeditor/vexflow'
import VexFlow from '../components/vexeditor/vexflow'
import querystring from 'querystring'

export default function StaveEditor() {
    const location = useLocation()
    console.log(location)
    let qs = querystring.parse(location.search.substring(1))

    return (
        <Fragment>
            {qs.type ? 
                <VexFlow1></VexFlow1>
                :
                <VexFlow></VexFlow>
            }
        </Fragment>
    )
}