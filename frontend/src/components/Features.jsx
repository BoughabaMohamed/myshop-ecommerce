
const features = [
  {
    icon: '🚚',
    title: 'Fast Delivery',
    description: 'Quick shipping',
  },
  {
    icon: '🔒',
    title: 'Secure Payment',
    description: 'Safe checkout',
  },
  {
    icon: '⭐',
    title: 'Quality Products',
    description: 'Best quality',
  },
  {
    icon: '💬',
    title: 'Support',
    description: "We're here for you",
  },
]

function Features() {
  return (
    <section className="border-y border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                {feature.icon}
              </div>

              <div>
                <h3 className="text-sm font-semibold sm:text-base">
                  {feature.title}
                </h3>

                <p className="text-xs text-gray-500 sm:text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default Features
