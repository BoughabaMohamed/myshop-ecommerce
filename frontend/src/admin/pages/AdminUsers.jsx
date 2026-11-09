
import { useEffect, useState } from 'react'
import Popup from '../components/Popup'

const API_URL = 'http://localhost:3000'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: null,
  })

  const openPopup = (type, title, message, onConfirm = null) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
    })
  }

  const closePopup = () => {
    setPopup((prev) => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
    }))
  }

  const handlePopupConfirm = () => {
    const action = popup.onConfirm
    closePopup()

    if (action) action()
  }

  const getToken = () =>
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken') ||
    ''

  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
  })

  const loadUsers = async () => {
    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/users`, {
        headers: getHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to load users.')
      }

      const data = await response.json()
      const list = Array.isArray(data) ? data : data.users || []

      setUsers(list)
    } catch (error) {
      openPopup('error', 'Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDeleteUser = async (user) => {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not delete user.')
      }

      setUsers((prev) =>
        prev.filter((item) => item.id !== user.id)
      )

      openPopup(
        'success',
        'Success',
        'User deleted successfully!'
      )
    } catch (error) {
      openPopup('error', 'Error', error.message)
    }
  }

  const deleteUser = (user) => {
    openPopup(
      'confirm',
      'Delete User',
      `Are you sure you want to delete "${user.name || user.email}"?`,
      () => handleDeleteUser(user)
    )
  }

  const filteredUsers = users.filter((user) => {
    const text = `${user.name || ''} ${user.email || ''} ${user.role || ''}`

    return text.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="space-y-8">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manage Users
        </h1>

        <p className="text-gray-500 mt-2">
          View and manage registered users.
        </p>
      </div>

      {/* Users Count */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-600 rounded-xl p-4">
            <span className="text-2xl">👥</span>
          </div>

          <div>
            <p className="text-gray-500 text-sm font-medium">
              Total Users
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-1">
              {users.length}
            </p>
          </div>
        </div>
      </section>

      
      {/* Users List */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Users List
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View and manage all registered users.
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full sm:w-72 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading users...
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No users found.
          </p>
        ) : (
          <>
            {/* Mobile User Cards */}
            <div className="space-y-3 md:hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="min-w-0 rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-semibold text-gray-800">
                        {user.name || '-'}
                      </h3>

                      <p className="mt-1 break-all text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-sm text-gray-500">
                      ID: #{user.id}
                    </span>

                    <button
                      type="button"
                      onClick={() => deleteUser(user)}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Users Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b last:border-b-0 transition hover:bg-gray-50"
                    >
                      <td className="p-4 text-gray-500">
                        #{user.id}
                      </td>

                      <td className="p-4 font-medium text-gray-800">
                        {user.name || '-'}
                      </td>

                      <td className="p-4 text-gray-600">
                        {user.email}
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteUser(user)}
                          className="rounded-lg bg-red-50 px-4 py-2 font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
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
        onConfirm={handlePopupConfirm}
        onCancel={closePopup}
      />

    </div>
  )
}

export default AdminUsers
