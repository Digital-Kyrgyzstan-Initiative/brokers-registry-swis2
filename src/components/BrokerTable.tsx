import { Table, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Broker } from '../types/broker'

interface BrokerTableProps {
  data: Broker[]
  loading: boolean
  total: number
  page: number
  onPageChange: (page: number) => void
}

function CertExpiryTag({ date }: { date: string }) {
  const expiry = new Date(date)
  const today = new Date()
  const daysLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) return <Tag color="error">Истёк · {date}</Tag>
  if (daysLeft < 90) return <Tag color="warning">{date}</Tag>
  return <Tag color="success">{date}</Tag>
}

export default function BrokerTable({
  data,
  loading,
  total,
  page,
  onPageChange,
}: BrokerTableProps) {
  const columns: ColumnsType<Broker> = [
    {
      title: '№',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_: unknown, __: Broker, index: number) => (page - 1) * 15 + index + 1,
    },
    {
      title: 'Наименование организации',
      dataIndex: 'legalEntityName',
      key: 'legalEntityName',
      minWidth: 280,
      ellipsis: { showTitle: false },
      render: (name: string) => (
        <Tooltip title={name} placement="topLeft">
          {name}
        </Tooltip>
      ),
    },
    {
      title: 'ИНН',
      dataIndex: 'inn',
      key: 'inn',
      width: 160,
      render: (inn: string) => <span className="inn-cell">{inn}</span>,
    },
    {
      title: 'Юридический адрес',
      dataIndex: 'legalAddress',
      key: 'legalAddress',
      minWidth: 200,
      ellipsis: { showTitle: false },
      render: (addr: string) => (
        <Tooltip title={addr} placement="topLeft">
          {addr}
        </Tooltip>
      ),
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
      width: 165,
      render: (phone: string) => (
        <a href={`tel:+${phone}`}>+{phone}</a>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 210,
      ellipsis: { showTitle: false },
      render: (email: string) => (
        <Tooltip title={email} placement="topLeft">
          <a href={`mailto:${email}`}>{email}</a>
        </Tooltip>
      ),
    },
    {
      title: 'Срок сертификата',
      dataIndex: 'certificateExpiryDate',
      key: 'certificateExpiryDate',
      width: 170,
      render: (date: string) => <CertExpiryTag date={date} />,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'center',
      render: (status: string) =>
        status === '1' ? (
          <Tag color="success">Активный</Tag>
        ) : (
          <Tag color="default">Неактивный</Tag>
        ),
    },
  ]

  return (
    <Table
      className="broker-table"
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1200 }}
      sticky
      bordered={false}
      size="middle"
      pagination={{
        current: page,
        pageSize: 15,
        total,
        showSizeChanger: false,
        position: ['bottomRight'],
        showTotal: (t) => `Итого: ${t} брокеров`,
      }}
      onChange={(pag) => {
        if (pag.current) onPageChange(pag.current)
      }}
    />
  )
}
