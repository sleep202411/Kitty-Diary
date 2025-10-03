import Mock from 'mockjs';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ code: -1, msg: 'Method not allowed' });
  }

  const { keyword = '' } = req.query;
  const num = Mock.Random.integer(3, 8);
  const data = Array.from({ length: num }, () => Mock.Random.ctitle(2, 4) + keyword);

  res.status(200).json({ code: 0, data });
}