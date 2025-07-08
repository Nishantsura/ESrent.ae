'use client'

interface CarDescriptionProps {
  description: string
  tags: string[]
}

export function CarDescription({ description, tags }: CarDescriptionProps) {
  return (
    <>
      <section className="mb-6">
        <p className="text-muted-foreground">{description ?? 'No description available'}</p>
      </section>

      <section className="mb-0">
        <h2 className="text-lg font-semibold mb-3">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {(tags ?? []).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-indigo-600 rounded-full text-sm font-medium text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
    </>
  )
}
