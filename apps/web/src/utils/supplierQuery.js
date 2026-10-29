// 供应商筛选与排序的纯函数，便于复用与测试
export const emptyFilters = {
  keyword: '',
  categories: [],
  integrations: [],
  shipTo: ''
}

export function filterSuppliers(list, filters = emptyFilters) {
  const keyword = (filters.keyword || '').trim().toLowerCase()
  const cats = filters.categories || []
  const ints = filters.integrations || []
  const shipTo = filters.shipTo || ''

  return list.filter((supplier) => {
    if (keyword) {
      const haystack = [
        supplier.name,
        supplier.city,
        supplier.country,
        supplier.location,
        ...supplier.categories
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(keyword)) return false
    }

    if (cats.length && !cats.some((c) => supplier.categories.includes(c))) return false

    if (ints.length && !ints.some((i) => supplier.integrations.includes(i))) return false

    if (shipTo) {
      const ships = supplier.shipsTo.map((s) => s.toLowerCase())
      if (shipTo === 'worldwide' && !ships.includes('全球')) return false
      if (shipTo === 'us' && !ships.includes('美国') && !ships.includes('全球')) return false
      if (shipTo === 'eu' && !ships.includes('欧洲') && !ships.includes('全球')) return false
    }

    return true
  })
}

export function sortSuppliers(list, sortKey = 'featured') {
  const items = list.slice()

  if (sortKey === 'name') {
    return items.sort((a, b) => a.name.localeCompare(b.name))
  }

  if (sortKey === 'products') {
    return items.sort((a, b) => b.products - a.products)
  }

  if (sortKey === 'lead') {
    return items.sort((a, b) => a.productionDays - b.productionDays || b.products - a.products)
  }

  return items.sort((a, b) => Number(b.featured) - Number(a.featured) || b.products - a.products)
}

export function querySuppliers(list, filters, sortKey) {
  return sortSuppliers(filterSuppliers(list, filters), sortKey)
}

export function activeFilterCount(filters) {
  return (
    (filters.keyword ? 1 : 0) +
    (filters.shipTo ? 1 : 0) +
    filters.categories.length +
    filters.integrations.length
  )
}

export function shipsLabel(supplier) {
  if (!supplier.shipsTo.length) return '—'
  if (supplier.shipsTo.includes('全球')) return '全球'
  return supplier.shipsTo.join('、')
}
