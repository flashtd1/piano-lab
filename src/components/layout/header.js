import React, { Fragment } from 'react'
import { Layout, Menu, Affix } from 'antd'
import { Link, useLocation } from 'react-router-dom'

export default function Header (props) {
  let location = useLocation()
  let {router} = props
  let index = router.findIndex(item => {
    return item.path === location.pathname
  })
  if (index === -1) {
    index = 0
  }
  return (
    <Fragment>
      <Affix style={{position: 'fixed', width: '100%', top: '0px', zIndex:"1000"}}>
        <Layout.Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[index + ""]}
            style={{lineHeight: '64px'}}
          >
            {
              router.map((item, index) => {
                return (
                  <Menu.Item key={index + ""}>
                    <Link to={item.path}>
                      { item.name }
                    </Link>
                  </Menu.Item>
                )
              })
            }
            
          </Menu>
        </Layout.Header>
      </Affix>
    </Fragment>
  )
}