import React, { Fragment, useState } from 'react'
import Osmd from '../components/osmd/osmd'
import { Row, Col, Card, Button } from 'antd'

function Sheet() {
    let [xmlPath, setXmlPath] = useState('')
    return (
        <Fragment>
            <Row>
                <Col span={24}>
                    <Card>
                        <Button type="primary" onClick={() => {
                            if (xmlPath.search('music.xml') > 0) {
                                setXmlPath(process.env.PUBLIC_URL + '/HelloWorld.xml')
                            } else {
                                setXmlPath(process.env.PUBLIC_URL + '/music.xml')
                            }
                        }}>读取musicxml</Button>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Card>
                        <Osmd 
                            xmlPath={xmlPath}
                        />
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Sheet