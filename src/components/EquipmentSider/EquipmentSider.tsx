import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Col, Divider, Form, Input, Row, Select, Typography, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useState } from 'react'
import { api } from '../../api'
import { formItemProps } from '../NewEquipmentSider/NewEquipmentSider'
import SiderFamily from '../SiderFamily'
import SiderTransactionsHistory from '../SiderTransactionsHistory'
import { useTableData } from '../../hooks/useEquipmentTableData'

interface EquipmentSiderProps {
  receivedEquipment: EquipmentWithDescription
}

const EquipmentSider = ({ receivedEquipment }: EquipmentSiderProps) => {
  const [currentEquipment, setCurrentEquipment] = useState<EquipmentWithDescription>(receivedEquipment)
  const [sideForm] = Form.useForm()
  const queryClient = useQueryClient()
  const { departments, equipmentModels, areas, statuses, employees, globalTypes } = useTableData()

  const { mutate: toggleEquipmentReserved } = useMutation({
    mutationFn: () => {
      if (currentEquipment.isReserved) {
        return api.equipment.unreserve(currentEquipment.invNumber)
      } else {
        return api.equipment.reserve(currentEquipment.invNumber)
      }
    },
    onSuccess: () => {
      message.open({
        type: 'success',
        content: currentEquipment.isReserved ? 'Успешно разрезервированно' : 'Успешно зарезервировано',
      })
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'Equipment' || query.queryKey[1] === 'transactionHistory',
      })
      setCurrentEquipment((oldState) => {
        return { ...oldState, isReserved: !oldState.isReserved }
      })
    },
    onError: () => {
      message.open({
        type: 'error',
        content: 'Не удалось зарезервировать.',
      })
    },
  })

  useEffect(() => {
    sideForm.setFieldsValue(currentEquipment) // IVLaptev genius idea
  }, [currentEquipment, sideForm])

  useEffect(() => {
    setCurrentEquipment(receivedEquipment)
  }, [receivedEquipment, employees])

  const { mutate: mutateEquipment } = useMutation({
    mutationFn: (formData: EquipmentWithDescription) => {
      return api.equipment.update(formData)
    },
    onSuccess: () => {
      message.open({
        type: 'success',
        content: 'Успешно сохранено',
      })
      queryClient.invalidateQueries({ queryKey: ['Equipment'] })
      queryClient.invalidateQueries({
        queryKey: ['transactionsHistory'],
      })
    },
    onError: () => {
      message.open({
        type: 'error',
        content: 'Ошибка при сохранении',
      })
    },
  })

  const { mutate: archiveEquipment } = useMutation({
    mutationFn: () => {
      return api.equipment.archive(currentEquipment.invNumber)
    },
    onSuccess: () => {
      message.open({
        type: 'success',
        content: 'Успешно архивировано',
      })
      queryClient.invalidateQueries({ queryKey: ['Equipment'] })
      queryClient.invalidateQueries({
        queryKey: ['transactionsHistory'],
      })
    },
    onError: () => {
      message.open({
        type: 'error',
        content: 'Ошибка при архивировании',
      })
    },
  })

  return (
    <>
      <Typography.Title level={3}>
        {currentEquipment.equipmentModelName || 'Информация об оборудовании'}
      </Typography.Title>
      <Form form={sideForm} onFinish={mutateEquipment} className='equipmentSider'>
        <Row gutter={72}>
          <Col span={12}>
            <Form.Item label='ID' name='id' normalize={(id) => +id} {...formItemProps}>
              <Input disabled />
            </Form.Item>
            <Form.Item label='Инв. Номер' name='invNumber' {...formItemProps}>
              <Input disabled />
            </Form.Item>
            <Form.Item label='Модель' name='equipmentModelId' {...formItemProps}>
              <Select
                disabled={!currentEquipment.invNumber}
                options={equipmentModels?.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  }
                })}
              />
            </Form.Item>
            <Form.Item label='Сер. номер' name='snNumber' {...formItemProps}>
              <Input disabled={!currentEquipment.invNumber} />
            </Form.Item>
            <Form.Item label='Гл. Тип' name='globalTypeId' required {...formItemProps}>
              <Select
                disabled={!currentEquipment.invNumber}
                options={globalTypes?.map((item) => {
                  return { value: item.id, label: item.name }
                })}
              />
            </Form.Item>
            <Form.Item label='Департамент' name='departmentId' {...formItemProps}>
              <Select
                disabled={!currentEquipment.invNumber}
                options={departments?.map((item) => {
                  return { value: item.id, label: item.name }
                })}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='Статус' name='statusId' required {...formItemProps}>
              <Select
                disabled={!currentEquipment.invNumber}
                options={statuses
                  ?.filter((item) => {
                    return (
                      item.name === 'В ремонте' ||
                      item.name === 'Требует ремонта' ||
                      item.name === 'В наличии' ||
                      item.name === currentEquipment.status
                    )
                  })
                  .map((item) => {
                    return { value: item.id, label: item.name }
                  })}
              />
            </Form.Item>
            <Form.Item label='МОО' name='areaId' {...formItemProps}>
              <Select
                disabled={!currentEquipment.invNumber}
                options={areas?.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  }
                })}
              />
            </Form.Item>
            <Form.Item label='Сотрудник' name='employeeName' normalize={(e) => +e} {...formItemProps}>
              <Input disabled />
            </Form.Item>
            <Form.Item label='Бух. Номер' name='binvNumber' {...formItemProps}>
              <Input disabled={!currentEquipment.invNumber} />
            </Form.Item>
            <Form.Item label='МОЛ' name='matResponsiblePersonId' required {...formItemProps}>
              <Select
                disabled={!currentEquipment.invNumber}
                options={employees?.map((item) => {
                  return { value: item.id, label: item.fio }
                })}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='Описание' name='comment' {...formItemProps}>
          <TextArea disabled={!currentEquipment.invNumber} />
        </Form.Item>

        {!currentEquipment.archived && (
          <Row justify='space-around'>
            <Button onClick={() => toggleEquipmentReserved()} disabled={!currentEquipment.invNumber}>
              {currentEquipment.isReserved ? 'Разрезервировать' : 'Зарезервировать'}
            </Button>
            <Button onClick={() => archiveEquipment()} disabled={!currentEquipment.invNumber}>
              Архивировать
            </Button>
            <Button type='primary' htmlType='submit' disabled={!currentEquipment.invNumber}>
              Сохранить
            </Button>
          </Row>
        )}

        {currentEquipment.invNumber && <SiderFamily invNumber={currentEquipment.invNumber} />}

        {currentEquipment.id && (
          <>
            <Divider style={{ marginTop: '40px' }} />
            {/* <SiderTransactionsHistory id={currentEquipment.id} invNumber={currentEquipment.invNumber} /> */}
          </>
        )}
      </Form>
    </>
  )
}

export default EquipmentSider
