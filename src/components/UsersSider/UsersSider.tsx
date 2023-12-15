import { Typography, Form, Input, Button, message } from 'antd'
import { useEffect, useState } from 'react'
import { formItemProps } from '../NewEquipmentSider/NewEquipmentSider'

import styles from './UsersSider.module.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api'

interface UsersSiderProps {
  chosenUser: EmployeeResponseExtended
}

export function UsersSider({ chosenUser }: UsersSiderProps) {
  const [sideForm] = Form.useForm()
  const [currentUser, setCurrentUser] = useState<EmployeeResponseExtended>(chosenUser)
  const queryClient = useQueryClient()

  useEffect(() => {
    sideForm.setFieldsValue(currentUser)
  }, [currentUser, sideForm])

  useEffect(() => {
    setCurrentUser(chosenUser)
  }, [chosenUser])

  const { mutate: mutateUser } = useMutation({
    mutationFn: (formData: EmployeeResponseExtended) => {
      return api.users.upadateUser(currentUser, {
        userName: currentUser.userName,
        fio: `${formData.surname} ${formData.name} ${formData.patronymic ? formData.patronymic : ''}`,
        phone: formData.phone,
        email: formData.email,
        link: currentUser.link,
      })
    },
    onSuccess: () => {
      message.open({
        type: 'success',
        content: 'Успешно сохранено',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      message.open({
        type: 'error',
        content: 'Ошибка при сохранении',
      })
    },
  })

  return (
    <>
      <Typography.Title level={3}>
        {chosenUser.name
          ? `${chosenUser.surname} ${chosenUser.name[0]}. ${
              chosenUser.patronymic ? chosenUser.patronymic[0] + '.' : ''
            }`
          : 'Имя пользователя'}
      </Typography.Title>
      <Form form={sideForm} className={styles.sideForm} onFinish={mutateUser}>
        <div>
          <Typography.Text>Фамилия</Typography.Text>
          <Form.Item name='surname'>
            <Input className={styles.sideFormInput} {...formItemProps} disabled={!currentUser.id} />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>Имя</Typography.Text>
          <Form.Item name='name'>
            <Input className={styles.sideFormInput} {...formItemProps} disabled={!currentUser.id} />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>Отчество</Typography.Text>
          <Form.Item name='patronymic'>
            <Input className={styles.sideFormInput} {...formItemProps} disabled={!currentUser.id} />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>Логин</Typography.Text>
          <Form.Item name='email'>
            <Input className={styles.sideFormInput} {...formItemProps} disabled={!currentUser.id} />
          </Form.Item>
        </div>
        <div>
          <Typography.Text>Телефон</Typography.Text>
          <Form.Item name='phone'>
            <Input className={styles.sideFormInput} {...formItemProps} disabled={!currentUser.id} />
          </Form.Item>
        </div>

        <Button
          type='primary'
          htmlType='submit'
          disabled={!currentUser.id}
          className={styles.sideFormSubmitButton}>
          Сохранить
        </Button>
      </Form>
    </>
  )
}
