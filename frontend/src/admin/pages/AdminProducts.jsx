
import { useEffect, useState } from 'react'
import Popup from '../components/Popup'

const API_URL = 'http://localhost:3000'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    users: 0,
    orders: 0,
  })

  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: null,
  })

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
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

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products/admin/all`, {
        headers: getHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to load products.')
      }

      const data = await response.json()
      const list = Array.isArray(data) ? data : data.products || []

      setProducts(list)
      setCounts((prev) => ({
        ...prev,
        products: list.length,
      }))
    } catch (error) {
      openPopup('error', 'Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        headers: getHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to load categories.')
      }

      const data = await response.json()
      const list = Array.isArray(data) ? data : data.categories || []

      setCategories(list)
      setCounts((prev) => ({
        ...prev,
        categories: list.length,
      }))
    } catch (error) {
      openPopup('error', 'Error', error.message)
    }
  }

  const loadDashboard = async () => {
    try {
      const [usersResponse, ordersResponse] = await Promise.all([
        fetch(`${API_URL}/users`, { headers: getHeaders() }),
        fetch(`${API_URL}/orders`, { headers: getHeaders() }),
      ])

      if (!usersResponse.ok || !ordersResponse.ok) {
        throw new Error('Could not load dashboard statistics.')
      }

      const usersData = await usersResponse.json()
      const ordersData = await ordersResponse.json()

      const users = Array.isArray(usersData)
        ? usersData
        : usersData.users || []

      const orders = Array.isArray(ordersData)
        ? ordersData
        : ordersData.orders || []

      setCounts((prev) => ({
        ...prev,
        users: users.length,
        orders: orders.length,
      }))
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    loadProducts()
    loadCategories()
    loadDashboard()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: name === 'image' ? files[0] || null : value,
    }))
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: null,
    })

    setEditingId(null)

    const fileInput = document.getElementById('productImage')
    if (fileInput) fileInput.value = ''
  }

  const uploadImage = async () => {
    if (!form.image) return null

    const formData = new FormData()
    formData.append('image', form.image)

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Image upload failed.')
    }

    return data.filename || data.image || data.fileName
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)

      let imageName = null

      if (form.image) {
        imageName = await uploadImage()

        if (!imageName) {
          throw new Error('Image upload did not return a filename.')
        }
      }

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
      }

      if (imageName) {
        productData.image = imageName
      }

      const isEditing = editingId !== null

      const response = await fetch(
        isEditing
          ? `${API_URL}/products/${editingId}`
          : `${API_URL}/products`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: getHeaders(),
          body: JSON.stringify(productData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not save product.')
      }

      openPopup(
        'success',
        'Success',
        isEditing
          ? 'Product updated successfully!'
          : 'Product added successfully!'
      )

      resetForm()
      await loadProducts()
      await loadDashboard()
    } catch (error) {
      openPopup('error', 'Error', error.message)
    } finally {
      setSaving(false)
    }
  }

  const editProduct = (product) => {
    setEditingId(product.id)

    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      category:
        typeof product.category === 'object'
          ? product.category.id
          : product.category || '',
      image: null,
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteProduct = async (product) => {
    try {
      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not delete product.')
      }

      await loadProducts()
      await loadDashboard()

      openPopup(
        'success',
        'Success',
        data.action === 'deactivated'
          ? 'Product hidden because it has order history.'
          : 'Product deleted successfully!'
      )
    } catch (error) {
      openPopup('error', 'Error', error.message)
    }
  }

  const deleteProduct = (product) => {
    openPopup(
      'confirm',
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      () => handleDeleteProduct(product)
    )
  }

  const filteredProducts = products.filter((product) => {
    const category =
      typeof product.category === 'object'
        ? product.category?.name
        : product.category

    const text = `${product.name} ${product.description} ${category || ''}`

    return text.toLowerCase().includes(search.toLowerCase())
  })

  const getStatus = (product) => {
    if (Number(product.is_active) === 0) return 'Deactivated'
    if (Number(product.stock) > 0) return 'Active'
    return 'Out of stock'
  }

  const statusClass = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-700'
    if (status === 'Out of stock') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const dashboardCards = [
    {
      label: 'Products',
      value: counts.products,
      icon: '📦',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Categories',
      value: counts.categories,
      icon: '🗂️',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Users',
      value: counts.users,
      icon: '👥',
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Orders',
      value: counts.orders,
      icon: '🛒',
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="min-h-screen space-y-8 bg-gray-50 text-gray-800">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your products, categories, users and orders.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl ${item.color}`}
            >
              {item.icon}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                {item.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Management Form */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {editingId ? 'Edit Product' : 'Product Management'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {editingId
              ? 'Update the selected product information.'
              : 'Add a new product to your store.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label htmlFor="productName" className="mb-2 block text-sm font-semibold text-gray-700">
                Product Name
              </label>
              <input
                id="productName"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="productPrice" className="mb-2 block text-sm font-semibold text-gray-700">
                Price (DH)
              </label>
              <input
                id="productPrice"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="Enter price"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="productStock" className="mb-2 block text-sm font-semibold text-gray-700">
                Stock
              </label>
              <input
                id="productStock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                required
                placeholder="Enter stock quantity"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="productCategory" className="mb-2 block text-sm font-semibold text-gray-700">
                Category
              </label>
              <select
                id="productCategory"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="productDescription" className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              id="productDescription"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Enter product description"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="productImage" className="mb-2 block text-sm font-semibold text-gray-700">
              Product Image
            </label>
            <input
              id="productImage"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Product'
                  : 'Add Product'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Search */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Products List
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Search and manage your store products.
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className={`${inputClass} sm:max-w-xs`}
          />
        </div>
      </section>

        
      {/* Products Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <p className="py-12 text-center text-gray-500">
            Loading products...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No products found.
          </p>
        ) : (
          <>
            {/* Mobile Product Cards */}
            <div className="space-y-4 p-4 md:hidden">
              {filteredProducts.map((product) => {
                const category =
                  typeof product.category === 'object'
                    ? product.category?.name
                    : product.category

                const imageUrl = product.image?.startsWith('http')
                  ? product.image
                  : `${API_URL}/uploads/${product.image}`

                const status = getStatus(product)

                return (
                  <div
                    key={product.id}
                    className="min-w-0 rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      {product.image ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                          No image
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-bold text-gray-800">
                          {product.name}
                        </h3>
                        <p className="mt-1 font-semibold text-blue-600">
                          {product.price} DH
                        </p>
                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusClass(status)}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm">
                      <p className="break-words text-gray-600">
                        <span className="font-semibold text-gray-800">Category:</span>{' '}
                        {category || '-'}
                      </p>

                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">Stock:</span>{' '}
                        {product.stock}
                      </p>

                      <p className="break-words text-gray-600">
                        <span className="font-semibold text-gray-800">Description:</span>{' '}
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => editProduct(product)}
                        className="flex-1 rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteProduct(product)}
                        className="flex-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Image</th>
                    <th className="px-5 py-4">Product Name</th>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const category =
                      typeof product.category === 'object'
                        ? product.category?.name
                        : product.category

                    const imageUrl = product.image?.startsWith('http')
                      ? product.image
                      : `${API_URL}/uploads/${product.image}`

                    const status = getStatus(product)

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          {product.image ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="h-14 w-14 rounded-lg border border-gray-100 object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">
                              No image
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {product.name}
                        </td>

                        <td className="max-w-xs truncate px-5 py-4 text-gray-500">
                          {product.description}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {category || '-'}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {product.stock}
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {product.price} DH
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass(status)}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => editProduct(product)}
                              className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-200"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteProduct(product)}
                              className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
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

export default AdminProducts
