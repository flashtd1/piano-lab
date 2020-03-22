import React, { useRef, Fragment } from 'react'
import '../../assets/piano.css'
import { Row, Col, Affix } from 'antd'
import { usePianoInit } from './usePianoInit'


function PianoComponent () {
  const startNote = {
    note: "a",
    octave: 0
  }
  const endNote = {
    note: "c",
    octave: 8
  }
  let piano = usePianoInit(startNote, endNote)
  let pianoDom = useRef()
  if (piano && pianoDom.current) {
    pianoDom.current.appendChild(piano.HTML)
  }

  return (
    <Fragment>
      <Affix style={{position: 'fixed', left: '0px', width: '100%', bottom: '69px'}}>
        <Row>
          <Col span={24}>
            <div
              ref={pianoDom}
              style={{
                height: '150px',
              }}>
            </div>
          </Col>
        </Row>
      </Affix>
    </Fragment>
  )
}

export default PianoComponent