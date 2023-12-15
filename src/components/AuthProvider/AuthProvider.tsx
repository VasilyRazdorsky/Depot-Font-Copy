import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Form, Image, Input, Row } from 'antd'
import { Dispatch, useEffect, useState } from 'react'
import { api, checkIsAuth, readJWT } from '../../api'
import type { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuth, setIsAuth] = useState(readJWT().hasToken)

  useEffect(() => {
    checkIsAuth(setIsAuth)
  }, [])

  useEffect(() => {
    if (!isAuth) localStorage.removeItem('token')
  }, [isAuth])

  return <>{isAuth ? children : <Login setIsAuth={setIsAuth} />}</>
}

interface FormValues {
  username: string
  password: string
}

interface LoginProps {
  setIsAuth: Dispatch<boolean>
}

const Login = ({ setIsAuth }: LoginProps) => {
  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: (values: FormValues) => api.users.login(values.username, values.password),
    onSuccess: (response) => {
      localStorage.setItem('token', response.data.token)
      setIsAuth(readJWT().hasToken)
    },
  })

  return (
    <Row justify='center' align='middle' style={{ height: '100vh', flexDirection: 'column' }}>
      <Image
        width={400}
        preview={false}
        src={
          'https://sun9-24.userapi.com/impg/QRDYa1esd0Yw1bNX_znAVG_zBykOaXW3IP4ktQ/lbxla8kgWIE.jpg?size=1080x716&quality=96&sign=63bbbaff75dfd82a0607c5a6dc458d80&c_uniq_tag=1P9OEjPzzF3FBjIsOqXU4dyGCZsOkMbKF__VMV2ypHI&type=album'
        }
      />
      <Form
        layout='vertical'
        name='loginForm'
        onFinish={(values: FormValues) => mutate(values)}
        style={{ marginTop: 30 }}>
        <Form.Item name='username' rules={[{ required: true, message: 'Введите логин' }]} required>
          <Input placeholder='Логин' />
        </Form.Item>

        <Form.Item name='password' rules={[{ required: true, message: 'Введите пароль' }]} required>
          <Input.Password placeholder='Пароль' />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' block loading={isLoading}>
            Войти
          </Button>
        </Form.Item>

        {error instanceof Error && (
          <Alert
            message={`Ошибка: ${
              error.message.includes('400') ? 'Неверный логин или пароль' : 'Сервер не отвечает'
            }`}
            type='error'
            style={{ visibility: isError ? 'visible' : 'hidden' }}
          />
        )}
      </Form>
    </Row>
  )
}

export default AuthProvider
