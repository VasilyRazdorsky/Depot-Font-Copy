import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Input, Row, Select, Typography, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Dispatch, SetStateAction } from 'react'
import { api } from '../../api'
import { useTableData } from '../../hooks/useEquipmentTableData'

export const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    sorter: (a: EquipmentWithDescription, b: EquipmentWithDescription) => a.id - b.id,
  },
  {
    title: 'Инв. Номер',
    dataIndex: 'invNumber',
    key: 'invNumber',
    // sorter: (a: any, b: any) => a.invNumber - b.invNumber,
  },
  {
    title: 'Место',
    dataIndex: 'area',
  },
  {
    title: 'Сотрудник',
    dataIndex: 'employeeName',
  },
  {
    title: 'Департамент',
    dataIndex: 'departmentName',
  },
  { title: 'Гл. Тип', dataIndex: 'glType' },
  { title: 'Модель', dataIndex: 'equipmentModelName' },
  { title: 'Тип модели', dataIndex: 'equipmentModelType' },
  { title: 'Статус', dataIndex: 'status' },
  { title: 'Мат. Ответственный', dataIndex: 'mot' },
  { title: 'Комментарий', dataIndex: 'comment' },
  // {
  //   title: 'Архивировано',
  //   dataIndex: 'archived',
  //   render: (archived: boolean) => (archived ? 'Да' : 'Нет'),
  // },
  // {
  //   title: 'Часть?',
  //   dataIndex: 'partOf',
  // },
  {
    title: 'Часть сущности',
    dataIndex: 'partOfField',
    render: (value: string | null) => value ?? '-',
  },
  // {
  //   title: 'Родитель кого',
  //   dataIndex: 'fatherOf',
  // },
  {
    title: 'Серийник',
    dataIndex: 'snNumber',
  },
  {
    title: 'binv',
    dataIndex: 'binvNumber',
  },
]

export const formItemProps = { labelCol: { span: 24 }, wrapperCol: { span: 24 } }

interface NewEquipmentSiderProps {
  onAsideModeChange: Dispatch<SetStateAction<AsideMode>>
}
const NewEquipmentSider = ({ onAsideModeChange }: NewEquipmentSiderProps) => {
  const queryClient = useQueryClient()

  const { departments, equipmentModels, areas, statuses, employees, globalTypes } = useTableData()

  const { mutate: createEquipment } = useMutation({
    mutationFn: async (formData: EquipmentRequest) => {
      if (formData.statusId && statuses) {
        formData.isReserved =
          statuses.find((item) => {
            return item.id === formData.statusId
          })?.name === 'Зарезервировано'
      }

      const newEquipment = await api.equipment.create(formData)
      return newEquipment
    },
    onSuccess: () => {
      message.open({
        type: 'success',
        content: 'Успешно создано',
      })
      queryClient.invalidateQueries({ queryKey: ['Equipment'] }) // TODO add equipment id
      queryClient.invalidateQueries({
        queryKey: ['transactionsHistory'], // ? why not working: , { origin: 'TransactionsHistory', id: receivedEquipment.id }
      })
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
      <Typography.Title level={3}>Новая сущность</Typography.Title>
      <Form onFinish={createEquipment} className='equipmentSider'>
        <Row gutter={72}>
          <Col span={12}>
            <Form.Item label='Гл. Тип' name='globalTypeId' required {...formItemProps}>
              <Select
                options={globalTypes?.map((item) => {
                  return { value: item.id, label: item.name }
                })}
              />
            </Form.Item>
            <Form.Item label='Модель' name='equipmentModelId' required {...formItemProps}>
              <Select
                options={equipmentModels?.map((item) => {
                  return { value: item.id, label: item.name }
                })}
              />
            </Form.Item>
            <Form.Item label='Сер. Номер' name='snNumber' required {...formItemProps}>
              <Input />
            </Form.Item>

            <Form.Item label='Департамент' name='departmentId' required {...formItemProps}>
              <Select
                options={departments?.map((item) => {
                  return { value: item.id, label: item.name }
                })}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Часть от' name='parentInvNumber' {...formItemProps}>
              <Input />
            </Form.Item>
            <Form.Item label='Статус' name='statusId' {...formItemProps}>
              <Select
                options={statuses
                  ?.filter((item) => {
                    return item.name === 'В ремонте' || item.name === 'Требует ремонта'
                  })
                  .map((item) => {
                    return { value: item.id, label: item.name }
                  })}
              />
            </Form.Item>
            <Form.Item label='МОО' name='areaId' required {...formItemProps}>
              <Select
                options={areas?.map((item) => {
                  return { value: item.id, label: item.name }
                })}
              />
            </Form.Item>
            <Form.Item label='МОЛ' name='matResponsiblePersonId' required {...formItemProps}>
              <Select
                options={employees?.map((item) => {
                  return { value: item.id, label: item.fio }
                })}
              />
            </Form.Item>
            <Form.Item label='Бух. Номер' name='binvNumber' required {...formItemProps}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='Описание' name='comment' required {...formItemProps}>
          <TextArea />
        </Form.Item>

        <Row justify={'space-around'}>
          <Button type='primary' htmlType='submit'>
            Создать
          </Button>
          <Button type='dashed' onClick={() => onAsideModeChange('default')}>
            Отмена
          </Button>
        </Row>
      </Form>
    </>
    // {
    //     "invNumber": 0,
    //     "snNumber": "string",
    //     "binvNumber": "string",
    //     "mot": "string",
    //     "departmentId": 0,
    //     "area": "string",
    //     "status": "string",
    //     "glType": "string",
    //     "equipmentModelId": 0,
    //     "comment": "string",
    //     "partOf": true,
    //     "partOfField": 0,
    //     "fatherOf": true
    //   }
  )
}

export default NewEquipmentSider

/*
Fill db
*/
// useEffect(() => {
//   const mots = ['Laptev', 'Kuz', 'Levandrovsky', 'Gleb', 'Denis', 'Vlad', 'Dima', 'Ismail', 'Ilya']
//   const departments = [-1, -2, -3, 5, 2]
//   const areas = ['IT_area', 'coworking', 'itlab', 'mocap', '415', '421']
//   const statuses = ['nice', 'broken', 'lost', 'in repair']
//   const glTypes = ['VR', 'AR', 'PC']
//   const comments = ['nice suit', 'hit by car', 'lost in the forest', 'in repair', 'fine', 'sold']
//   for (let i = 0; i < 25; i++) {
//     setTimeout(() => {
//       api.equipment.create({
//         invNumber: i,
//         snNumber: i.toString(),
//         binvNumber: i.toString(),
//         mot: mots[Math.floor(Math.random() * mots.length)],
//         departmentId: departments[Math.floor(Math.random() * departments.length)],
//         area: areas[Math.floor(Math.random() * areas.length)],
//         status: statuses[Math.floor(Math.random() * statuses.length)],
//         glType: glTypes[Math.floor(Math.random() * glTypes.length)],
//         equipmentModelId: -1, // VIVE PRO
//         comment: comments[Math.floor(Math.random() * comments.length)],
//         partOf: false,
//         fatherOf: false,
//       })
//     }, i * 200)
//   }
// }, [])
