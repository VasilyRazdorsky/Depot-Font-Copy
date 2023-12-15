import { EditOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Row, Select, Typography, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api'
import { guideTypes, itemTypes } from '../../pages/GuidesPage/GuidesPage'
import { pickColumns } from '../GuidesTypeRows/GuidesTypeRows'

interface GuidesItemEditProps {
  type: guideTypes
  item: itemTypes
}

const GuidesItemEdit = ({ type, item }: GuidesItemEditProps): JSX.Element => {
  const [guidesItemForm] = Form.useForm()
  const queryClient = useQueryClient()
  const [name, changeName] = useState<string>(item?.name || '')
  const columnsFromTable = useMemo<ColumnsType | []>(
    () =>
      pickColumns(type).filter((e) => {
        return (
          e.dataIndex !== 'id' &&
          e.dataIndex !== 'departmentName' &&
          e.dataIndex !== 'equipmentManufactureName' &&
          e.dataIndex !== 'equipmentTypeName'
        )
      }) || [],
    [type]
  )
  const { mutate: mutateGuidesItem } = useMutation({
    mutationFn: (newValue) =>
      item === 'new' ? api[type].create(newValue) : api[type].update(item.id, newValue),
    mutationKey: ['mutateGuides'],
    onSuccess: () => {
      message.open({
        type: 'success',
        content: item === 'new' ? 'Успешно создано' : 'Успешно сохранено',
      })
      queryClient.invalidateQueries([type.toString()])
    },
    onError: () => {
      message.open({
        type: 'error',
        content: item === 'new' ? 'Ошибка при создании' : 'Ошибка при сохранении',
      })
    },
  })

  const { data: departments } = useQuery({
    queryKey: ['department', { origin: 'EquipmentSider' }],
    queryFn: async () => {
      const resp = await api.department.getAll()
      return resp.data.map((department) => {
        return { value: department.id, label: department.name }
      })
    },
  })
  const { data: manufactures } = useQuery({
    queryKey: ['equipmentManufactures', { origin: 'EquipmentSider' }],
    queryFn: async () => {
      const resp = await api.equipmentManufactures.getAll()
      return resp.data.map((manufacture) => {
        return { value: manufacture.id, label: manufacture.name }
      })
    },
    enabled: type === 'equipmentModel',
  })

  const { data: equipmentTypes } = useQuery({
    queryKey: ['equipmentTypes', { origin: 'EquipmentSider' }],
    queryFn: async () => {
      const resp = await api.equipmentTypes.getAll()
      return resp.data.map((type) => {
        return { value: type.id, label: type.name }
      })
    },
    enabled: type === 'equipmentModel',
  })

  const { data: equipmentModels } = useQuery({
    queryKey: ['equipmentModel', { origin: 'EquipmentSider' }],
    queryFn: async () => {
      const resp = await api.equipmentModel.getAll()
      return resp.data.map((equipmentModel) => {
        return { value: equipmentModel.id, label: equipmentModel.name }
      })
    },
  })

  useEffect(() => {
    guidesItemForm.resetFields()
  }, [type])

  useEffect(() => {
    changeName(item?.name || '')
    guidesItemForm.setFieldsValue(item)
  }, [item])

  const onFinish = (formData: any) => {
    console.log('finish guidesItem editing and got', formData)
    if (name) {
      formData.name = name
    }

    mutateGuidesItem({ ...formData })
  }
  return (
    // Object.keys(item).length !== 0 &&
    <aside
      style={{
        backgroundColor: 'white',
        height: '100vh',
        position: 'sticky',
        top: 0,
        padding: '34px 96px 0 72px',
      }}>
      <Form
        form={guidesItemForm}
        onFinish={(formData) => onFinish(formData)}
        style={{ padding: '1em', paddingTop: 0 }}>
        {columnsFromTable.map(({ dataIndex, title }, i) => {
          // console.log(dataIndex, title)
          return (
            <Form.Item
              key={i}
              name={dataIndex}
              label={dataIndex !== 'name' && title?.toString()}
              labelAlign='left'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              hidden={dataIndex === 'id'}>
              {dataIndex === 'name' ? (
                <Typography.Title
                  level={4}
                  disabled={!name && item !== 'new'}
                  editable={{
                    text: name,
                    icon: name || item === 'new' ? <EditOutlined /> : <></>,
                    onChange: changeName,
                  }}>
                  {name || 'Название'}
                </Typography.Title>
              ) : dataIndex === 'departmentId' ? (
                <Select options={departments} />
              ) : dataIndex === 'equipmentManufactureId' ? (
                <Select options={manufactures} />
              ) : dataIndex === 'equipmentTypeId' ? (
                <Select options={equipmentTypes} />
              ) : (
                <Input disabled={dataIndex === 'id'} />
              )}
            </Form.Item>
          )
        })}
        <Row justify={`${item === 'new' ? 'center' : 'space-between'}`}>
          {item !== 'new' && (
            <Button type='dashed' disabled={Object.keys(item).length === 0}>
              Архивировать
            </Button>
          )}
          <Button type='primary' htmlType='submit' disabled={Object.keys(item).length === 0}>
            {item === 'new' ? 'Создать' : 'Сохранить'}
          </Button>
        </Row>
      </Form>
    </aside>
  )
}

export default GuidesItemEdit
