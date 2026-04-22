import { useEffect, useState } from 'react'
import { Button, Input, Select } from 'antd'
import { SearchOutlined, ClearOutlined } from '@ant-design/icons'
import type { SortByField, SortOrderField } from '../types/broker'

interface SearchBarProps {
  nameSearch: string
  innSearch: string
  sortBy: SortByField
  sortOrder: SortOrderField
  onNameChange: (value: string) => void
  onInnChange: (value: string) => void
  onSortChange: (sortBy: SortByField, sortOrder: SortOrderField) => void
  onReset: () => void
}

const SORT_OPTIONS = [
  { value: 'createdAt|desc', label: 'По дате (новые)' },
  { value: 'createdAt|asc', label: 'По дате (старые)' },
  { value: 'inn|asc', label: 'По ИНН (возрастание)' },
  { value: 'inn|desc', label: 'По ИНН (убывание)' },
]

export default function SearchBar({
  nameSearch,
  innSearch,
  sortBy,
  sortOrder,
  onNameChange,
  onInnChange,
  onSortChange,
  onReset,
}: SearchBarProps) {
  const [localName, setLocalName] = useState(nameSearch)

  useEffect(() => {
    setLocalName(nameSearch)
  }, [nameSearch])

  useEffect(() => {
    const timer = setTimeout(() => onNameChange(localName), 400)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localName])

  const handleSortChange = (value: string) => {
    const [by, order] = value.split('|') as [SortByField, SortOrderField]
    onSortChange(by, order)
  }

  const hasFilters =
    nameSearch.trim() !== '' ||
    innSearch.trim() !== '' ||
    sortBy !== 'createdAt' ||
    sortOrder !== 'desc'

  return (
    <div className="search-bar">
      <div className="search-field search-field-name">
        <label>Наименование организации</label>
        <Input
          placeholder="Поиск по названию..."
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          value={localName}
          onChange={e => setLocalName(e.target.value)}
          allowClear
        />
      </div>

      <div className="search-field search-field-inn">
        <label>ИНН</label>
        <Input
          placeholder="Точное значение ИНН"
          value={innSearch}
          onChange={e => onInnChange(e.target.value)}
          allowClear
          maxLength={14}
        />
      </div>

      <div className="search-field search-field-sort">
        <label>Сортировка</label>
        <Select
          value={`${sortBy}|${sortOrder}`}
          options={SORT_OPTIONS}
          onChange={handleSortChange}
          style={{ width: '100%' }}
        />
      </div>

      {hasFilters && (
        <div className="search-actions">
          <Button icon={<ClearOutlined />} onClick={onReset}>
            Сбросить
          </Button>
        </div>
      )}
    </div>
  )
}
