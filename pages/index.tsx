import Sidebar from '../components/Sidebar'
import Center from '../components/Center'

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <div>{/*Player */}</div>
    </div>
  )
}
