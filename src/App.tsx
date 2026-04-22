import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import BrokerTable from './components/BrokerTable'
import { fetchBrokers } from './api/brokers'
import type { Broker, SortByField, SortOrderField } from './types/broker'

export default function App() {
  const [data, setData] = useState<Broker[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [nameSearch, setNameSearch] = useState('')
  const [innSearch, setInnSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortByField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrderField>('desc')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchBrokers({ page, nameSearch, innSearch, sortBy, sortOrder })
      setData(result.data)
      setTotal(result.total)
    } catch (err) {
      void message.error('Не удалось загрузить данные. Попробуйте позже.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, nameSearch, innSearch, sortBy, sortOrder])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleNameChange = (value: string) => {
    setNameSearch(value)
    setPage(1)
  }

  const handleInnChange = (value: string) => {
    setInnSearch(value)
    setPage(1)
  }

  const handleSortChange = (by: SortByField, order: SortOrderField) => {
    setSortBy(by)
    setSortOrder(order)
    setPage(1)
  }

  const handleReset = () => {
    setNameSearch('')
    setInnSearch('')
    setSortBy('createdAt')
    setSortOrder('desc')
    setPage(1)
  }

  return (
    <div className="app-layout">
      <Header />

      <main className="app-main">
        <div className="content-wrapper">
          <SearchBar
            nameSearch={nameSearch}
            innSearch={innSearch}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onNameChange={handleNameChange}
            onInnChange={handleInnChange}
            onSortChange={handleSortChange}
            onReset={handleReset}
          />

          <div className="table-card">
            <BrokerTable
              data={data}
              loading={loading}
              total={total}
              page={page}
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <span>© 2025 ГП «Кыргызское Единое Окно»</span>
        <span>·</span>
        <a href="https://trade.kg" target="_blank" rel="noopener noreferrer">
          trade.kg
        </a>
      </footer>
    </div>
  )
}
