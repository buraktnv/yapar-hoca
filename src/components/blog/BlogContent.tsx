'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import QuizEmbed to avoid SSR issues
const QuizEmbed = dynamic(() => import('@/components/quiz/QuizEmbed'), {
  ssr: false,
  loading: () => (
    <div className="my-8 p-8 bg-gray-100 rounded-lg text-center">
      <p className="text-gray-500">Quiz yükleniyor...</p>
    </div>
  )
})

interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Parse and replace quiz shortcodes
    const container = contentRef.current
    const html = container.innerHTML

    // Find all quiz shortcodes: [quiz id="xyz"]
    const quizRegex = /\[quiz\s+id=["']([^"']+)["']\]/gi
    const matches = [...html.matchAll(quizRegex)]

    if (matches.length === 0) return

    // Replace shortcodes with placeholder divs
    let modifiedHtml = html
    matches.forEach((match, index) => {
      const [fullMatch, quizId] = match
      modifiedHtml = modifiedHtml.replace(
        fullMatch,
        `<div id="quiz-placeholder-${index}" data-quiz-id="${quizId}"></div>`
      )
    })

    container.innerHTML = modifiedHtml

    // Render QuizEmbed components
    matches.forEach((match, index) => {
      const [, quizId] = match
      const placeholder = document.getElementById(`quiz-placeholder-${index}`)

      if (placeholder) {
        // Create a React root and render QuizEmbed
        import('react-dom/client').then(({ createRoot }) => {
          const root = createRoot(placeholder)
          root.render(<QuizEmbed quizId={quizId} />)
        })
      }
    })
  }, [content])

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none tinymce-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
