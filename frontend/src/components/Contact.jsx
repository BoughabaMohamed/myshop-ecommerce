
import { useState } from 'react'
import { useCart } from '../CartContext'

function Contact() {
  const { showToast } = useCart()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
  event.preventDefault()

  showToast('Message sent successfully!', 'success')

  setFormData({
    name: '',
    email: '',
    message: '',
  })
}

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
          <p className="mb-3 text-sm font-semibold tracking-wider text-blue-100">
            MYSHOP STORE
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-blue-50">
            Have a question or need help? We'd love to hear from you.
            Get in touch with our team.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* CONTACT INFORMATION */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

            <h2 className="mb-3 text-2xl font-bold text-slate-900">
              Get in Touch
            </h2>

            <p className="mb-8 leading-relaxed text-gray-500">
              We're here to help you. Feel free to contact us
              whenever you need assistance.
            </p>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  📧
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Email
                  </h3>
                  <p className="mt-1 text-gray-500">
                    support@myshop.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  📞
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Phone
                  </h3>
                  <p className="mt-1 text-gray-500">
                    +212 600 000 000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  📍
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Address
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Casablanca, Morocco
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows="5"
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </main>
    </>
  )
}

export default Contact
