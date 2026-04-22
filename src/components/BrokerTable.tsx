import { useEffect, useState } from 'react'
import { Button, Empty, Pagination, Skeleton, Table, Tag, Tooltip } from 'antd'
import { MailOutlined, PhoneOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { Broker } from '../types/broker'

interface BrokerTableProps {
  data: Broker[]
  loading: boolean
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number, pageSize: number) => void
}

function parseCompanyName(name: string): { short: string; abbr: string } {
  const match = name.match(/"([^"]+)"/)
  if (match) {
    const short = match[1]
    const prefix = name.replace(/"[^"]+"/, '').replace(/,$/, '').trim()
    const abbr = prefix
      .split(/\s+/)
      .filter(w => w.length > 2)
      .map(w => w[0].toUpperCase())
      .join('')
    return { short, abbr }
  }
  return { short: name, abbr: '' }
}

function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length === 12) {
    return `+${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`
  }
  return `+${phone}`
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function CertExpiryTag({ date }: { date: string }) {
  const expiry = new Date(date)
  const today = new Date()
  const daysLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const label = formatDate(date)

  if (daysLeft < 0) return <Tag color="error">Истёк · {label}</Tag>
  if (daysLeft < 90) return <Tag color="warning">{label}</Tag>
  return <Tag color="success">{label}</Tag>
}

function BrokerCard({ broker, index }: { broker: Broker; index: number }) {
  const { short, abbr } = parseCompanyName(broker.legalEntityName)
  return (
    <div className="broker-card">
      <div className="broker-card-header">
        <div>
          <div className="broker-card-name">{short}</div>
          {abbr && <div className="broker-card-abbr">{abbr}</div>}
        </div>
        <span className="broker-card-index">{index}</span>
      </div>

      <div className="broker-card-meta">
        <span className="broker-card-inn">ИНН: {broker.inn}</span>
        <CertExpiryTag date={broker.certificateExpiryDate} />
      </div>

      <div className="broker-card-actions">
        <Button
          type="primary"
          icon={<PhoneOutlined />}
          href={`tel:+${broker.phone}`}
          block
        >
          {formatPhone(broker.phone)}
        </Button>
        <Button
          icon={<MailOutlined />}
          href={`mailto:${broker.email}`}
          block
        >
          Написать
        </Button>
      </div>
    </div>
  )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function BrokerTable({
  data,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
}: BrokerTableProps) {
  const isMobile = useIsMobile()

  const columns: ColumnsType<Broker> = [
    {
      title: '№',
      key: 'index',
      width: 56,
      align: 'center',
      render: (_: unknown, __: Broker, index: number) => (
        <span style={{ color: '#9ca3af', fontSize: 13 }}>{(page - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      title: 'Организация',
      dataIndex: 'legalEntityName',
      key: 'legalEntityName',
      minWidth: 240,
      render: (name: string) => {
        const { short, abbr } = parseCompanyName(name)
        return (
          <Tooltip title={name} placement="topLeft">
            <div style={{ lineHeight: 1.35 }}>
              <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{short}</div>
              {abbr && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{abbr}</div>}
            </div>
          </Tooltip>
        )
      },
    },
    {
      title: 'ИНН',
      dataIndex: 'inn',
      key: 'inn',
      width: 155,
      render: (inn: string) => <span className="inn-cell">{inn}</span>,
    },
    {
      title: 'Юридический адрес',
      dataIndex: 'legalAddress',
      key: 'legalAddress',
      minWidth: 190,
      ellipsis: { showTitle: false },
      render: (addr: string) => (
        <Tooltip title={addr} placement="topLeft">
          <span style={{ color: '#4b5563' }}>{addr}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
      render: (phone: string) => (
        <a href={`tel:+${phone}`} style={{ whiteSpace: 'nowrap' }}>
          {formatPhone(phone)}
        </a>
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
      width: 155,
      render: (date: string) => <CertExpiryTag date={date} />,
    },
  ]

  if (isMobile) {
    return (
      <div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} active paragraph={{ rows: 3 }} />
            ))}
          </div>
        ) : data.length === 0 ? (
          <Empty description="Брокеры не найдены" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="broker-cards">
            {data.map((broker, index) => (
              <BrokerCard
                key={broker.id}
                broker={broker}
                index={(page - 1) * pageSize + index + 1}
              />
            ))}
          </div>
        )}
        <div className="broker-cards-pagination">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            pageSizeOptions={[10, 20, 50]}
            onChange={onPageChange}
            showTotal={(t) => `${t} брокеров`}
            size="small"
          />
        </div>
      </div>
    )
  }

  return (
    <Table
      className="broker-table"
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1100 }}
      sticky
      bordered={false}
      size="middle"
      locale={{
        emptyText: (
          <Empty
            description="Брокеры не найдены"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
      }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        position: ['bottomRight'],
        showTotal: (t) => `Итого: ${t} брокеров`,
      }}
      onChange={(pag) => {
        onPageChange(pag.current ?? 1, pag.pageSize ?? pageSize)
      }}
    />
  )
}
