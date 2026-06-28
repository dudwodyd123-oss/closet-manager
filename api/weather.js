// api/weather.js
// 기상청 단기예보 API용 프록시 (서버리스 함수)
// 브라우저(script.js)가 /api/weather?endpoint=...&serviceKey=...&... 형태로 요청을 보내면,
// 이 함수가 대신 기상청 진짜 주소(apis.data.go.kr)로 요청하고, 그 결과를 그대로 돌려준다.
// 서버 대 서버 통신이라 CORS 정책에 걸리지 않는다.

export default async function handler(req, res) {
  // 날씨 데이터는 시간마다 바뀌므로 캐시를 사용하지 않도록 명시한다.
  // (캐시된 304 응답을 계속 재사용하면 예전 응답이 그대로 반복될 수 있다)
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  // req.url에서 원본 쿼리스트링을 그대로 추출한다.
  // URLSearchParams로 한 번 더 파싱+조립하면 서비스키의 특수문자(+, /, = 등)가
  // 디코딩 후 재인코딩되며 원래 값과 달라지는 "이중 인코딩" 문제가 생길 수 있다.
  // 그래서 문자열 그대로 잘라서 기상청 주소에 붙여 보낸다 (파싱하지 않음).
  const queryIndex = req.url.indexOf('?');
  const rawQuery = queryIndex >= 0 ? req.url.slice(queryIndex + 1) : '';

  const endpointMatch = rawQuery.match(/(?:^|&)endpoint=([^&]*)/);
  const endpoint = endpointMatch ? decodeURIComponent(endpointMatch[1]) : null;

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

  // endpoint=... 부분만 제거하고, 나머지 쿼리스트링은 원본 그대로(재인코딩 없이) 사용
  const query = rawQuery.replace(/(?:^|&)endpoint=[^&]*/, '').replace(/^&/, '');
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