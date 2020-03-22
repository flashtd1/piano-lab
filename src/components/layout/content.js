import React from 'react'
import { Layout } from 'antd'
import { Route, Switch } from 'react-router-dom'
import NonePage from '../../views/404'

export default function Content (props) {
  let {router} = props
  return (
    <Layout.Content style={{padding: '0 5%', minHeight: '900px'}} >
      <Switch>
        {
          router.map((item, index) => {
            return <Route key={index} exact path={item.path} component={item.component} />
          })
        }
        <Route component={NonePage}/>
      </Switch>
    </Layout.Content>
  )
}