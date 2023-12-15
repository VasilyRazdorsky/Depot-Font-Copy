import { Button, Form, Input, Row, Typography, message } from 'antd'
import styles from './NewUserSider.module.scss'
import { useForm } from 'antd/es/form/Form'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api'

interface NewUserSiderProps {
  handleAsideModeChange: Dispatch<SetStateAction<AsideModeUsersType>>
}

export function NewUserSider({ handleAsideModeChange }: NewUserSiderProps) {
  const [submittable, setSubmittable] = useState(false)
  const [sideForm] = useForm()
  const values = Form.useWatch([], sideForm)
  const queryClient = useQueryClient()

  useEffect(() => {
    sideForm.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true)
      },
      () => {
        setSubmittable(false)
      }
    )
  }, [values])

  const { mutate: createUser } = useMutation({
    mutationFn: async (formData: EmployeeWithPassword) => {
      const newUser = await api.users.createUser({
        userName: formData.userName,
        fio: `${formData.surname} ${formData.name} ${formData.patronymic ? formData.patronymic : ''}`,
        password: formData.password,
        phone: formData.phone,
        email: formData.email,
        link: formData.link,
      })

      return newUser
    },
    onSuccess: () => {
      message.open({
        type: 'success',
        content: 'Успешно создано',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      handleAsideModeChange('default')
      sideForm.resetFields()
    },
    onError: () => {
      message.open({
        type: 'error',
        content: 'Ошибка при создании',
      })
    },
  })

  return (
    <>
      <Typography.Title level={3}>Новый пользователь</Typography.Title>
      <Form form={sideForm} onFinish={createUser} name='validateOnly' className={styles.sideForm}>
        <div>
          <Typography.Text>
            <span style={{ color: '#ff4d4f' }}>*</span> User Name
          </Typography.Text>
          <Form.Item name='userName' rules={[{ required: true }]}>
            <Input className={styles.sideFormInput} />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>
            <span style={{ color: '#ff4d4f' }}>*</span> Фамилия
          </Typography.Text>
          <Form.Item name='surname' rules={[{ required: true }]}>
            <Input className={styles.sideFormInput} />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>
            <span style={{ color: '#ff4d4f' }}>*</span> Имя
          </Typography.Text>
          <Form.Item name='name' rules={[{ required: true }]}>
            <Input className={styles.sideFormInput} />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>Отчество</Typography.Text>
          <Form.Item name='patronymic'>
            <Input className={styles.sideFormInput} />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>
            <span style={{ color: '#ff4d4f' }}>*</span> Логин
          </Typography.Text>
          <Form.Item name='email' rules={[{ required: true }]}>
            <Input className={styles.sideFormInput} />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>
            <span style={{ color: '#ff4d4f' }}>*</span> Пароль
          </Typography.Text>
          <Form.Item name='password' rules={[{ required: true }]}>
            <Input className={styles.sideFormInput} type='password' />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>
            <span style={{ color: '#ff4d4f' }}>*</span> Телефон
          </Typography.Text>
          <Form.Item name='phone' rules={[{ required: true }]}>
            <Input className={styles.sideFormInput} />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>
            <span style={{ color: '#ff4d4f' }}>*</span> Ссылка
          </Typography.Text>
          <Form.Item name='link' rules={[{ required: true }]}>
            <Input className={styles.sideFormInput} />
          </Form.Item>
        </div>

        <Row justify={'space-around'}>
          <Button type='primary' htmlType='submit' disabled={!submittable}>
            Создать
          </Button>
          <Button type='dashed' onClick={() => handleAsideModeChange('default')}>
            Отмена
          </Button>
        </Row>
      </Form>
    </>
  )
}
