import { Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import { api } from '../../api'
import GuidesItemEdit from '../../components/GuidesItemEdit'
import GuidesLeftMenu from '../../components/GuidesLeftMenu'
import GuidesTypeRows from '../../components/GuidesTypeRows'

export type guideTypes = Exclude<keyof typeof api, 'baseUrl' | 'users' | 'equipment' | 'transactions'> // | null
export type itemTypes =
  | DepartmentResponse
  | EquipmentModelResponse
  | EquipmentManufacturesResponse
  | EquipmentType
  | string

const GuidesPage = (): JSX.Element => {
  const [type, setType] = useState<guideTypes>({} as guideTypes)
  const [item, setItem] = useState<itemTypes>({} as itemTypes)

  useEffect(() => {
    setItem({} as itemTypes)
  }, [type])

  return (
    <Row>
      <Col
        span={2}
        style={{
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          backgroundColor: 'white',
        }}>
        <GuidesLeftMenu setType={setType} />
      </Col>
      <Col span={15} style={{ padding: '34px 72px' }}>
        <GuidesTypeRows type={type} item={item} setItem={setItem} />
      </Col>
      <Col span={7} style={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)', backgroundColor: 'white' }}>
        <GuidesItemEdit type={type} item={item} />
      </Col>
    </Row>
  )
}

export default GuidesPage
