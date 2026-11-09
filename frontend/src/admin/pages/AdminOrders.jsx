
import { useEffect, useMemo, useState } from 'react'
import Popup from '../components/Popup'

const API_URL = 'http://localhost:3000'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  })

  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken') ||
    ''

  const openPopup = (type, title, message) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message,
    })
  }

  const closePopup = () => {
    setPopup((previousPopup) => ({
      ...previousPopup,
      isOpen: false,
    }))
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load orders.')
      }

      const data = await response.json()
      setOrders(Array.isArray(data) ? data : data.orders || [])
    } catch (error) {
      openPopup(
        'error',
        'Error',
        error.message || 'Something went wrong.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(id, status) {
    try {
      setUpdatingId(id)

      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update order.')
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      )

      openPopup(
        'success',
        'Success',
        'Order status updated successfully.'
      )
    } catch (error) {
      openPopup(
        'error',
        'Error',
        error.message || 'Something went wrong.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase().trim()

    if (!value) return orders

    return orders.filter((order) =>
      [
        order.id,
        order.user_name,
        order.address,
        order.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(value)
    )
  }, [orders, search])

  function getStatusStyle(status) {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    }

    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-8">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manage Orders
        </h1>

        <p className="text-gray-500 mt-2">
          View and manage customer orders.
        </p>
      </div>

      {/* Orders Summary and Search */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div className="flex items-center gap-4">
            <div className="bg-orange-100 text-orange-600 rounded-xl p-4">
              <span className="text-2xl">📦</span>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Orders
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-1">
                {orders.length}
              </p>
            </div>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search orders..."
            className="w-full sm:w-72 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </section>

      
      {/* Orders Table */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">

        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            Orders List
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View customer orders and update their status.
          </p>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading orders...
          </p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No orders found.
          </p>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-gray-800">
                      Order #{order.id}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Customer</p>
                      <p className="font-medium text-gray-800 break-words">
                        {order.user_name || 'Unknown'}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-semibold text-gray-800">
                        {Number(order.total_price || 0).toFixed(2)} DH
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Address</p>
                      <p className="text-gray-700 break-words">
                        {order.address || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="text-gray-700">
                        {order.order_date
                          ? new Date(order.order_date).toLocaleDateString()
                          : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Update Status
                    </label>

                    <select
                      value={order.status || 'Pending'}
                      disabled={updatingId === order.id}
                      onChange={(event) =>
                        updateOrderStatus(order.id, event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {updatingId === order.id && (
                      <span className="block text-xs text-gray-500 mt-2">
                        Updating...
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Address</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-semibold text-gray-800">
                        #{order.id}
                      </td>

                      <td className="p-4 text-gray-700">
                        {order.user_name || 'Unknown'}
                      </td>

                      <td className="p-4 font-medium text-gray-800">
                        {Number(order.total_price || 0).toFixed(2)} DH
                      </td>

                      <td className="p-4 text-gray-600 max-w-xs break-words">
                        {order.address || '—'}
                      </td>

                      <td className="p-4 text-gray-600">
                        {order.order_date
                          ? new Date(order.order_date).toLocaleDateString()
                          : '—'}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col items-start gap-2">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                          <select
                            value={order.status || 'Pending'}
                            disabled={updatingId === order.id}
                            onChange={(event) =>
                              updateOrderStatus(order.id, event.target.value)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          {updatingId === order.id && (
                            <span className="text-xs text-gray-500">
                              Updating...
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>


      {/* Shared Popup */}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onConfirm={closePopup}
        onCancel={closePopup}
      />

    </div>
  )
}

export default AdminOrders
