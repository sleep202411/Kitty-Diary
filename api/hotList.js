import Mock from 'mockjs';

export default function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ code: -1, msg: 'Method not allowed' });
  }

  // 生成与本地Mock一致的热门搜索数据
  const data = Array.from({ length: 8 }, () => ({
    id: Mock.Random.id(),
    keyword: Mock.Random.ctitle(2, 4)
  }));

  res.status(200).json({ code: 0, data });
}