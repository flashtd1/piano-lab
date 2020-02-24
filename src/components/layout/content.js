import React from 'react'
import { Layout } from 'antd'
import { useLocation, Route, Switch } from 'react-router-dom'


export default function Content (props) {
  let location = useLocation()
  console.log(location)
  let {router} = props
  return (
    <Layout.Content style={{padding: '0 50px', minHeight: '900px'}} >
      <Switch>
        {
          router.map((item, index) => {
            return <Route exact path={item.path} component={item.component} />
          })
        }
      </Switch>
    </Layout.Content>
  )
}