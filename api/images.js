import Mock from 'mockjs';

// 生成日记数据（与本地Mock逻辑一致）
const generateDiaryData = () => {
  const moods = ['😊', '😢', '🤔', '😍'];
  return Array.from({ length: 100 }, (_, i) => {
    return Mock.mock({
      id: Mock.Random.id(),
      caption: Mock.Random.ctitle(1, 12) + ' ' + Mock.Random.csentence(3, 20),
      url: Mock.Random.image('250x350', Mock.Random.color(), '#fff', 'diary'),
      date: Mock.Random.date('2025-MM-dd'),
      tags: Mock.Random.shuffle(['日常', '心情', '旅行', '美食', '学习']).slice(0, 2),
      height: Mock.Random.integer(300, 500),
      mood: moods[i % moods.length],
    });
  });
};

const allDiaries = generateDiaryData();

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ code: -1, msg: 'Method not allowed' });
  }

  const page = Number(req.query.page) || 1;
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  res.status(200).json({
    code: 0,
    data: {
      images: allDiaries.slice(start, end),
      hasMore: end < allDiaries.length
    }
  });
}