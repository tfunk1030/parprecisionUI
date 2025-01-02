import { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import ErrorBoundary from './errorboundary'
import HomeContent from './homecontent'
import WeatherDisplay from '../weather-display'

export const metadata: Metadata = {
  title: 'ParPrecision - Home',
  description: 'Welcome to ParPrecision, your precision golf analytics platform',
  keywords: ['golf', 'analytics', 'precision', 'performance'],
  openGraph: {
    title: 'ParPrecision - Home',
    description: 'Your precision golf analytics platform',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ParPrecision',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParPrecision - Home',
    description: 'Your precision golf analytics platform',
    images: ['/images/og-image.jpg'],
  },
}

export default function HomePage() {
  return (
    <ErrorBoundary fallback={<p>Something went wrong!</p>}>
      <Suspense fallback={<Loading />}>
        <div className="container relative pb-10">
          <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-lg text-center justify-center">
              <WeatherDisplay />
              <HomeContent />
            </div>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}