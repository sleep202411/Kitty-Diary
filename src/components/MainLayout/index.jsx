import {
    useState,
    useEffect
} from 'react';
import { Tabbar } from 'react-vant'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { HomeO, ChatO, SmileO, UserO } from '@react-vant/icons';
// 菜单栏配置
const tabs = [
  { title: '首页', path: '/home', icon: <HomeO /> },
  { title: '聊天', path: '/chat', icon: <ChatO /> },
  { title: '故事', path: '/story', icon: <SmileO /> },
  { title: '我的', path: '/profile', icon: <UserO /> }
]

const MainLayout = () => {
    const [active, setActive] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(()=>{
        const index=tabs.findIndex(
            tab=>location.pathname.startsWith(tab.path));
            setActive(index > -1 ? index : 0);
    },[location.pathname])

    return (
        <div 
            className='flex flex-col h-screen'
            style={{paddingBottom:'50px'}}
        >
            <div className="flex-1">
                <Outlet />
            </div>
            {/* tabbar */}
            <Tabbar value={active} onChange={
                (key) => { setActive(key);
                    navigate(tabs[key].path);
                 }}
                  className="cute-tabbar"
                >
                {tabs.map((tab, index) => (
                    <Tabbar.Item
                        key={index}
                        icon={tab.icon}
                    >
                        {tab.title}
                    </Tabbar.Item>
                ))}
            </Tabbar>
        </div>
    )
}

export default MainLayout;