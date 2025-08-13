# react 日记 APP 
- 移动App 

## 技术栈
- React全家桶
    React 组件开发
    组件的封装 
    第三方组件库 
    受控和非受控
    hooks编程 自定义的hooks  
    React-Router-DOM
        SPA
        路由守卫
        懒加载
    Zustand
- mock 接口模拟
- axios 请求拦截和代理
- module css
- vite 配置
- 性能优化
    防抖节流
    useCallback useMemo .....
- css 预处理器  stylus 
    flex transition transform。。。
- LLM
    - chat
    - 生图
    - 语言
    - coze 工作流 调用
- 移动端适配
    rem 
- git 提交等编程风格 
## 项目的架构
- components
- pages
- store
- hooks
- api
- assets
- mock
- llm
- utils

## 开发前的准备 
- 安装的包
    react-router-dom zustand axios 
     react-vant(UI组件库) lib-flexible(移动端适配)
    开发期间的依赖
    vite-plugin-mock 
    emoji-picker-react
- vite 配置
    - alias 
    - mock 
    - .env.local
    llm apiKey 
    - user-scalable = no
    - css 预处理
        index.css reset  
        box-sizing  font-family:-apply-system
        App.css  全局通用样式 
        module.css 模块化样式 
    - 移动端适配 rem 
- lib-flexible

## 功能模块
- UI 组件库 
    - react-vant  
- 配置路由及懒加载 
    - 懒加载
    - 路由守卫
    - Layout组件 
        - 嵌套路由Outlet 分组路由配置
        - 网页有几个模版 Layout 
            - Route 不加path 对应的路由自动选择
            - tabbar 模版
            - blank 模版
    - tabbar
        - react-vant + @react-vant/icons
- chatbot 模块
    - llm 模块 chat 封装
    - 迭代chat , 支持任意模型 
- Search
    - 防抖
    - api 
        GoogleSuggest
    - localStorage
- 瀑布流 
    - 小红书等主流App的内容浏览用户体验产品
        两列、图片高度不一致、落差感
        滚动加载更多，图片懒加载
    - 接口
        /api/images?page=${n} 支持翻页
        唯一id  page + index 
        随机图片， 高度随机
    - images 怎么放到两列中？ MVVM
    数据驱动界面（2列） 奇偶
    - 加载更多 位于盒子底部的元素 通过使用 IntersectionObserver
    观察它是否出现在视窗， 性能更好，使用了观察者模式
    - key  id 下拉刷新
    - 使用IntersectionObserver 再次图片懒加载 
