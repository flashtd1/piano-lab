import React, { Fragment } from 'react'
import Osmd from '../components/osmd'
import { Row, Col, Card, Button } from 'antd'

function Sheet() {
    return (
        <Fragment>
            <Row>
                <Col span={24}>
                    <Card>
                        <Button type="primary">读取musicxml</Button>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Card>
                        <Osmd />
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Sheet