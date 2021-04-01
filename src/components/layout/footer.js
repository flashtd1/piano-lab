import React, { Fragment } from 'react'
import { Layout, Affix } from 'antd'
import config from '../../../local_env.json'

export default function Footer () {
  let {ICP} = config
  return (
    <Fragment>
      <Affix style={{position: 'fixed', width:'100%', bottom: '0px'}}>
        <Layout.Footer>
          Copyright ©{new Date().getFullYear()} Created by flashtd1 备案号：<a href="http://www.beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">{ICP}</a>
        </Layout.Footer>
      </Affix>
    </Fragment>
  )
}