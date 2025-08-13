import './App.css'
import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import KittyLoading from '@/components/KittyLoading'
import MainLayout from '@/components/MainLayout'
import BlankLayout from './components/BlankLayout/index.jsx';


// 懒加载页面组件
const Home = lazy(() => import('@/pages/Home'))
const Diary = lazy(() => import('@/pages/Diary'))
const Chat = lazy(() => import('@/pages/Chat'))
const Profile = lazy(() => import('@/pages/Profile'))
const Story = lazy(() => import('@/pages/Story'))
const Search = lazy(() => import('@/pages/Search'))

function App() {
  return (
    <>
      <Suspense fallback={<KittyLoading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="story" element={<Story />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route element={<BlankLayout />}>
            <Route path="/search" element={<Search />} />
            <Route path="/diary" element={<Diary />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
