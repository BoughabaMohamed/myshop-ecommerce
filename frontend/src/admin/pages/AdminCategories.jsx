
import { useEffect, useState } from 'react'
import Popup from '../components/Popup'

const API_URL = 'http://localhost:3000'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  })

  const loadCategories = async () => {
    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/categories`, {
        headers: getHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to load categories.')
      }

      const data = await response.json()
      const list = Array.isArray(data) ? data : data.categories || []

      setCategories(list)
    } catch (error) {
      openPopup('error', 'Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const name = categoryName.trim()

    if (!name) {
      openPopup(
        'error',
        'Error',
        'Please enter a category name.'
      )
      return
    }

    try {
      setSaving(true)

      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not add category.')
      }

      setCategoryName('')

      await loadCategories()

      openPopup(
        'success',
        'Success',
        'Category added successfully!'
      )
    } catch (error) {
      openPopup('error', 'Error', error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (category) => {
    try {
      const response = await fetch(
        `${API_URL}/categories/${category.id}`,
        {
          method: 'DELETE',
          headers: getHeaders(),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not delete category.')
      }

      await loadCategories()

      openPopup(
        'success',
        'Success',
        'Category deleted successfully!'
      )
    } catch (error) {
      openPopup('error', 'Error', error.message)
    }
  }

  const deleteCategory = (category) => {
    openPopup(
      'confirm',
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?`,
      () => handleDeleteCategory(category)
    )
  }

  return (
    <div className="space-y-8">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manage Categories
        </h1>

        <p className="text-gray-500 mt-2">
          Add and manage your product categories.
        </p>
      </div>

      {/* Add Category */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">

        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            Add Category
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Create a new category for your products.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            {saving ? 'Adding...' : '+ Add Category'}
          </button>
        </form>
      </section>

      
      {/* Categories List */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Categories List
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View and manage all your categories.
            </p>
          </div>

          <span className="self-start sm:self-auto bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-semibold">
            Total: {categories.length}
          </span>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading categories...
          </p>
        ) : categories.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No categories found.
          </p>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">
                      Category #{category.id}
                    </p>

                    <h3 className="font-semibold text-gray-800 break-words">
                      {category.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    className="shrink-0 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Category Name</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="p-4 text-gray-500">
                        #{category.id}
                      </td>

                      <td className="p-4 font-medium text-gray-800">
                        {category.name}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteCategory(category)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition"
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

export default AdminCategories
