import React, { Fragment, useState } from 'react'
import { Row, Typography, Button, Form, Comment, Divider  } from 'antd'
import TextArea from 'antd/lib/input/TextArea'

const {Title, Paragraph} = Typography

export default function Index() {
  let [comment, setComment] = useState('')
  let comments = [
    {
      author: '小红',
      comment: 'hahaha'
    }
  ]
  return (
    <Fragment>
      <Typography>
        <Title level={2}>脑洞大开实验室</Title>
        <Paragraph>
          写代码和弹钢琴都充满了指尖上的乐趣，开开脑洞，让我们一起做一些有趣的事吧！
        </Paragraph>
      </Typography>
      <Row>
        <Form>
          <Form.Item>
            <TextArea rows={4} placeholder="写下您的想法，但是现在还不能写哦" value={comment} onChange={({target}) => {
              setComment(target.value)
            }}></TextArea>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => {
              console.log(comment)
            }}>提交</Button>
          </Form.Item>
        </Form>
      </Row>
      <Row>
        <Divider />
        <Title level={3}>评论区</Title>
        {
          comments.map((item, index) => {
            return (
              <Comment key={index}
                // actions={actions}
                author={item.author}
                // avatar={
                //   <Avatar
                //     src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                //     alt="Han Solo"
                //   />
                // }
                content={
                  <p>
                    {item.comment}
                  </p>
                }
                // datetime={
                //   <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                //     <span>{moment().fromNow()}</span>
                //   </Tooltip>
                // }
              />
            )
          })
        }
        
      </Row>
    </Fragment>
      )
}