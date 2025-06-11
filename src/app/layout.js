import "./globals.css"
import ErrorBoundary from "@/components/ErrorBoundary"

export const metadata = {
  title: "EdTech Platform",
  description: "JEE preparation platform with CBT tests and doubt sessions",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
