import './globals.css'
import Footer from "@/components/footer/Footer"
import Header from "@/components/header/Header"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: 'Gulit gebeya',
  description: 'AI powered e-commerce web app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
