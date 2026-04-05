import './globals.css'

export const metadata = {
  title: 'Foundry — Where startup journeys come alive',
  description: 'Explore real stories of how Indian startups grew from zero to millions. Find founders, track growth, and discover your next opportunity.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
