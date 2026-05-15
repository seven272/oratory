/* eslint-disable react/prop-types */
import { useDispatch } from 'react-redux'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Flex, Form, Input, message } from 'antd'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

import { fetchLoginUser } from '../../../../redux/slices/authSlice'
import styles from './Login.module.css'


const Login = ({ showRegister }) => {
  const dispatch = useDispatch()
  const routeNavigator = useRouteNavigator() 

  const onFinish = async (values) => {
    try {
       await dispatch(fetchLoginUser(values)).unwrap()
        message.success('Вы успешно авторизовались!')
      setTimeout(() => {
        routeNavigator.push('/')
      }, 1000)
    } catch (error) {
      message.error(error?.message || 'Ошибка при авторизации')
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="page_form">
      <h3 className={styles.heading}>Авторизоваться</h3>
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 370 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Введите email',
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Введите пароль!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Flex justify="space-between" align="center" vertical>
            <Button
              block={true}
              type="primary"
              htmlType="submit"
              size="medium"
              className={styles.btn}
            >
              Войти
            </Button>
            <a onClick={() => showRegister('register')} className={styles.link}>
              регистрация!
            </a>
          </Flex>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
