import "./root.scss"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    template: '%s | 桃色archive',
    default: '桃色archive', // a default is required when creating a template
  },
  description: '技術的なこととか雑多に書き留めておくブログ。桃色豆腐とかいう人が書いてるらしい。',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
