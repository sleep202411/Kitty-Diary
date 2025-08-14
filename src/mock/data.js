import Mock from 'mockjs';

export const generateDiaryData = () => {
  const moods = ['😊', '😢', '🤔', '😍'];
  return Array.from({ length: 100 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return Mock.mock({
      id: Mock.Random.id(),
      caption: Mock.Random.ctitle(1, 12) + ' ' + Mock.Random.csentence(3, 20),
      url: Mock.Random.image('300x400', Mock.Random.color(), '#fff', 'diary'),
      date: Mock.Random.date('2025-MM-dd'),
      tags: Mock.Random.shuffle(['日常', '心情', '旅行', '美食', '学习']).slice(0, 2),
      height: Mock.Random.integer(200, 500),
      mood: moods[i % moods.length],
    });
  });
};

export const allDiaries = generateDiaryData();

export default [
  {
    url: '/api/suggest',
    method: 'get',
    timeout: 100,
    response: ({ query }) => {
      const keyword = query.keyword;
      const num = Math.floor(Math.random() * 10) + 1;
      const list = [];
      for (let i = 0; i < num; i++) {
        const randomData = Mock.mock({ title: '@ctitle' });
        list.push(`${randomData.title}${keyword}`);
      }
      return { code: 0, data: list };
    }
  },
  {
    url: '/api/hotList',
    method: 'get',
    timeout: 500,
    response: () => ({
      code: 0,
      data: Array.from({ length: 8 }, () => ({
        id: Mock.Random.id(),
        keyword: Mock.Random.ctitle(2, 4)
      }))
    })
  },
  {
    url: '/api/images',
    method: 'get',
    timeout: 500,
    response: ({ query }) => {
      const page = Number(query.page) || 1;
      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return {
        code: 0,
        data: {
          images: allDiaries.slice(start, end),
          hasMore: end < allDiaries.length
        }
      };
    }
  }
];