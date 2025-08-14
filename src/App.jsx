import './App.css';
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import KittyLoading from '@/components/KittyLoading';
import MainLayout from '@/components/MainLayout';
import BlankLayout from './components/BlankLayout';

const Home = lazy(() => import('@/pages/Home'));
const Diary = lazy(() => import('@/pages/Diary'));
const Chat = lazy(() => import('@/pages/Chat'));
const Profile = lazy(() => import('@/pages/Profile'));
const Story = lazy(() => import('@/pages/Story'));
const Search = lazy(() => import('@/pages/Search'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  return (
    <Suspense fallback={<KittyLoading />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="story" element={<Story />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        <Route element={<BlankLayout />}>
          <Route path="search" element={<Search />} />
          <Route path="diary" element={<Diary />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;