import React, { Fragment } from 'react'
import { Layout, Affix } from 'antd'

export default function Footer () {
  return (
    <Fragment>
      <Affix style={{position: 'fixed', width:'100%', bottom: '0px'}}>
        <Layout.Footer>
          Copyright ©2019 Created by flashtd1 备案号：<a href="http://www.beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">京ICP备15035828号</a>
        </Layout.Footer>
      </Affix>
    </Fragment>
  )
}