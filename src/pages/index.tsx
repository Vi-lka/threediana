import Image from 'next/image'
import { Inter } from 'next/font/google'
import CanvasMain from '@/components/CanvasMain'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <CanvasMain />
  )
}
