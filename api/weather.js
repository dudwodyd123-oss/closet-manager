// api/weather.js
// 기상청 단기예보 API용 프록시 (서버리스 함수)
// 브라우저(script.js)가 /api/weather?endpoint=...&serviceKey=...&... 형태로 요청을 보내면,
// 이 함수가 대신 기상청 진짜 주소(apis.data.go.kr)로 요청하고, 그 결과를 그대로 돌려준다.
// 서버 대 서버 통신이라 CORS 정책에 걸리지 않는다.

export default async function handler(req, res) {
  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    res.status(400).json({ error: 'endpoint 파라미터가 필요합니다.' });
    return;
  }

  // 허용된 엔드포인트만 통과시킨다 (오용 방지)
  const allowedEndpoints = ['getUltraSrtNcst', 'getUltraSrtFcst', 'getVilageFcst'];
  if (!allowedEndpoints.includes(endpoint)) {
    res.status(400).json({ error: '허용되지 않은 endpoint 입니다.' });
    return;
  }

  const query = new URLSearchParams(params).toString();
  const targetUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${endpoint}?${query}`;

  try {
    const apiRes = await fetch(targetUrl);
    const text = await apiRes.text();

    // 기상청 API가 키 오류 등으로 JSON이 아닌 XML/텍스트를 줄 때도 있으므로 안전하게 처리
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const json = JSON.parse(text);
      res.status(apiRes.status).json(json);
    } catch {
      // JSON 파싱 실패 시 (보통 잘못된 서비스키 등의 이유로 XML 에러가 내려오는 경우)
      res.status(502).json({ error: '기상청 API 응답을 해석할 수 없습니다.', raw: text.slice(0, 300) });
    }
  } catch (err) {
    res.status(500).json({ error: '기상청 API 호출 중 오류가 발생했습니다.', detail: String(err) });
  }
}
