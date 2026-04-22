const companies = [
  { id: "KAI", name: "한국항공우주산업", country: "대한민국", sales: "3.8조원", item: "KF-21, FA-50, 기체 구조물", summary: "국내 대표 완제기 업체로 생산 일정과 수출 이슈를 함께 봐야 합니다.", risk: "Low", type: "domestic", query: "KAI aerospace", category: "항공기", watch: "생산 일정, 수출 계약, 부품 공급 안정성", note: "완제기 생산 이슈가 공급망 리스크로 이어질 수 있습니다." },
  { id: "Hanwha Aero", name: "한화에어로스페이스", country: "대한민국", sales: "9.3조원", item: "엔진, 발사체", summary: "엔진과 우주발사체 관련 일정 변동을 중요하게 봐야 하는 업체입니다.", risk: "Low", type: "domestic", query: "Hanwha Aerospace", category: "엔진/발사체", watch: "엔진 수주, 시험 일정, CAPA", note: "방산과 우주 관련 뉴스가 동시에 영향을 줍니다." },
  { id: "LIG Nex1", name: "LIG D&A", country: "대한민국", sales: "2.3조원", item: "유도무기, 항공전자", summary: "항공전자와 방산 체계를 함께 보는 주요 업체입니다.", risk: "Low", type: "domestic", query: "\"LIG D&A\" OR \"LIG Defense&Aerospace\"", category: "유도무기/항공전자", watch: "방산 수주, 전자부품 리드타임", note: "부품 지연이 곧 리스크 신호가 될 수 있습니다." },
  { id: "Hong Tech", name: "홍테크", country: "대한민국", sales: "비공개", item: "정밀 가공 부품", summary: "정밀 가공 중심 공급업체입니다.", risk: "Medium", type: "domestic", query: "홍테크 항공", category: "정밀가공", watch: "가공 CAPA, 납기, 고객사 수주", note: "납기 지연 risk를 빠르게 확인해야 합니다." },
  { id: "Hyundai Core Tech", name: "현대코어테크", country: "대한민국", sales: "비공개", item: "엔진/기체 부품", summary: "엔진과 기체 부품 관련 공급업체입니다.", risk: "Medium", type: "domestic", query: "현대코어테크 항공", category: "부품제조", watch: "생산 차질, 고객사 일정", note: "생산 차질은 공급망 리스크로 연결됩니다." },
  { id: "Deck Carbon", name: "덕카본", country: "대한민국", sales: "600억", item: "복합재", summary: "복합재 계열 공급업체입니다.", risk: "Low", type: "domestic", query: "덕카본 항공", category: "복합재", watch: "원자재 가격, 고객사 확대", note: "소재 가격 상승 risk를 함께 봐야 합니다." },
  { id: "Hanyang ENG", name: "한양ENG", country: "대한민국", sales: "1조원", item: "장비/서비스", summary: "설비와 서비스 중심 업체입니다.", risk: "Low", type: "domestic", query: "한양ENG 항공", category: "장비/서비스", watch: "설비 투자, 프로젝트 일정", note: "설비 납기 리스크를 확인해야 합니다." },
  { id: "Vision Collet", name: "비전콜렛", country: "대한민국", sales: "비공개", item: "공구/체결", summary: "정밀 공구와 체결 분야 업체입니다.", risk: "Medium", type: "domestic", query: "비전콜렛 항공", category: "공구/체결", watch: "체결류 수요, 거래처 변화", note: "체결류 부족은 작은 듯 보여도 risk가 됩니다." },
  { id: "Shinwoo System", name: "신우시스템", country: "대한민국", sales: "비공개", item: "기체 구조물 부품", summary: "기체 구조물 부품 공급업체입니다.", risk: "Medium", type: "domestic", query: "신우시스템 항공", category: "부품제조", watch: "구조물 수주, 납기, 설비", note: "구조물 지연 risk를 체크해야 합니다." },
  { id: "Segi Tech", name: "세기테크", country: "대한민국", sales: "비공개", item: "표면처리/가공", summary: "표면처리와 정밀 가공 업체입니다.", risk: "Medium", type: "domestic", query: "세기테크 항공", category: "표면처리", watch: "표면처리 CAPA, 품질 이슈", note: "품질 risk가 기사로 연결되는지 보세요." },
  { id: "Yeonjung", name: "연정", country: "대한민국", sales: "비공개", item: "기계부품", summary: "기계부품 중심 공급업체입니다.", risk: "Medium", type: "domestic", query: "연정 항공 부품", category: "기계부품", watch: "주요 고객사 납기", note: "고객사 일정 변화가 risk 신호입니다." },
  { id: "Sejong Rubber Tech", name: "세종러버테크", country: "대한민국", sales: "비공개", item: "특수 고무/실링", summary: "특수 고무와 실링 부품 업체입니다.", risk: "Medium", type: "domestic", query: "세종러버테크 항공", category: "고무/실링", watch: "소재 수급, 인증, 납기", note: "실링 부품 부족도 공급망 risk입니다." },
  { id: "Shingeumha", name: "신금하", country: "대한민국", sales: "비공개", item: "가공 구조부품", summary: "구조부품 가공 업체입니다.", risk: "Medium", type: "domestic", query: "신금하 항공", category: "정밀가공", watch: "가공 물량, 납기", note: "가공 지연 risk를 확인하세요." },
  { id: "ANV", name: "ANV", country: "대한민국", sales: "비공개", item: "전자/서비스", summary: "전자 및 서비스 계열 업체입니다.", risk: "Medium", type: "domestic", query: "ANV aerospace", category: "전자/서비스", watch: "전자부품 조달, 서비스 일정", note: "전자 부품 risk에 민감합니다." },
  { id: "Seowoo", name: "서우", country: "대한민국", sales: "비공개", item: "이차 가공 부품", summary: "이차 가공 중심 업체입니다.", risk: "Medium", type: "domestic", query: "서우 항공 부품", category: "부품제조", watch: "가공 수요, 거래처 변동", note: "고객 변동이 risk 요인입니다." },
  { id: "Camp", name: "캠프", country: "대한민국", sales: "비공개", item: "IT/솔루션", summary: "산업 솔루션 계열 업체입니다.", risk: "Medium", type: "domestic", query: "캠프 항공 IT", category: "IT/솔루션", watch: "프로젝트 일정, 운영 이슈", note: "운영 risk를 함께 봐야 합니다." },
  { id: "Yeonam Tech", name: "연암테크", country: "대한민국", sales: "500억", item: "엔진/기체 절삭 부품", summary: "엔진 및 기체 절삭 부품 공급업체입니다.", risk: "Low", type: "domestic", query: "연암테크 항공", category: "정밀가공", watch: "엔진 부품 수요, 납기", note: "엔진 수요 변동이 risk가 됩니다." },
  { id: "NDT Engineering", name: "NDT Engineering", country: "대한민국", sales: "800억", item: "기체 구조물", summary: "기체 구조물 조립 계열 업체입니다.", risk: "Low", type: "domestic", query: "NDT Engineering aerospace", category: "기체구조", watch: "조립 일정, 생산 이슈", note: "조립 일정 지연 risk를 봐야 합니다." },
  { id: "Kolon Spaceworks", name: "코오롱스페이스웍스", country: "대한민국", sales: "대기업 계열", item: "복합재 구조물", summary: "복합재 구조물 공급 측면에서 중요한 업체입니다.", risk: "Low", type: "domestic", query: "코오롱스페이스웍스", category: "복합재", watch: "복합재 적용 확대, 설비 투자", note: "원자재 risk와 함께 보면 좋습니다." },
  { id: "GST Industry", name: "GST Industry", country: "대한민국", sales: "비공개", item: "유압 시스템 부품", summary: "유압 계통 부품 공급업체입니다.", risk: "Medium", type: "domestic", query: "GST Industry aerospace", category: "부품제조", watch: "유압 부품 수요, 납기", note: "공급 차질 risk를 체크하세요." },
  { id: "Space Bay", name: "스페이스베이", country: "대한민국", sales: "스타트업", item: "위성/발사체 모듈", summary: "우주 관련 스타트업 공급업체입니다.", risk: "Medium", type: "domestic", query: "스페이스베이 우주", category: "우주항공", watch: "투자, 시험, 일정", note: "자금과 일정 risk가 중요합니다." },
  { id: "Walter ENG", name: "월터ENG", country: "대한민국", sales: "비공개", item: "시험장비/자동화", summary: "시험장비 및 자동화 관련 업체입니다.", risk: "Medium", type: "domestic", query: "Walter ENG aerospace", category: "장비/서비스", watch: "자동화 장비 수주", note: "프로젝트 지연 risk를 확인하세요." },
  { id: "DANAM Systems", name: "다남시스템즈", country: "대한민국", sales: "1000억", item: "통신/제어 장치", summary: "통신 및 제어 장치 계열 업체입니다.", risk: "Low", type: "domestic", query: "DANAM Systems aerospace", category: "전자/통신", watch: "통신 장치 수주, 개발 일정", note: "개발 지연 risk를 봐야 합니다." },
  { id: "LN", name: "엘엔", country: "대한민국", sales: "비공개", item: "체결류/가공부품", summary: "체결류 중심 부품업체입니다.", risk: "Medium", type: "domestic", query: "엘엔 항공 부품", category: "부품제조", watch: "체결류 수요, 공급 안정성", note: "작은 부품 shortage도 risk입니다." },
  { id: "Techron", name: "테크론", country: "대한민국", sales: "비공개", item: "CNC 가공품", summary: "CNC 가공 계열 업체입니다.", risk: "Medium", type: "domestic", query: "테크론 항공", category: "정밀가공", watch: "CNC 생산성, 납기", note: "납기 risk를 계속 봐야 합니다." },
  { id: "Boeing", name: "Boeing", country: "미국", sales: "778억", item: "상용기, 군용기", summary: "글로벌 OEM 생산 이슈가 공급망 전반에 직접 영향을 줍니다.", risk: "Medium", type: "global", query: "Boeing aerospace", category: "항공기", watch: "납품 지연, 규제, 파업", note: "OEM news와 risk를 같이 봐야 합니다." },
  { id: "Airbus", name: "Airbus", country: "유럽", sales: "654억 EUR", item: "상용기, 위성", summary: "유럽 쪽 생산 증설과 공급 병목을 확인할 때 중요합니다.", risk: "Low", type: "global", query: "Airbus aerospace", category: "항공기", watch: "생산 증설, 공급망 병목, 인도 계획", note: "유럽 공급망 흐름 파악에 유효합니다." },
  { id: "SpaceX", name: "SpaceX", country: "미국", sales: "비공개", item: "발사체, 위성, 우주인터넷", summary: "발사 일정과 위성 생산 확장이 글로벌 우주 공급망 일정에 직접 영향을 줍니다.", risk: "Medium", type: "global", query: "SpaceX launch satellite", category: "우주/발사체", watch: "발사 일정, 위성 생산, 스타링크, 규제", note: "발사 지연과 위성 생산 병목 risk를 같이 봐야 합니다." },
  { id: "Barnes Aerospace", name: "Barnes Aerospace", country: "미국", sales: "비공개", item: "엔진부품/MRO", summary: "엔진부품과 MRO 계열 공급업체입니다.", risk: "Medium", type: "global", query: "Barnes Aerospace", category: "부품/MRO", watch: "엔진 수요, MRO 계약", note: "MRO delay도 risk입니다." },
  { id: "Kaman Corporation", name: "Kaman Corporation", country: "미국", sales: "비공개", item: "베어링/구조물", summary: "베어링과 구조물 관련 공급업체입니다.", risk: "Medium", type: "global", query: "Kaman Corporation aerospace", category: "복합재/기체", watch: "구조물 수주, 베어링 공급", note: "구조물 shortage risk를 확인하세요." },
  { id: "Magellan Aerospace", name: "Magellan Aerospace", country: "캐나다", sales: "비공개", item: "엔진 모듈/기체", summary: "캐나다 항공우주 제조 및 부품 공급업체입니다.", risk: "Medium", type: "global", query: "Magellan Aerospace", category: "엔진/기체", watch: "엔진 모듈 생산, 구조물 수주", note: "북미 공급망 risk 확인에 유효합니다." },
  { id: "Constellium", name: "Constellium", country: "프랑스", sales: "81억 EUR", item: "알루미늄 소재", summary: "항공우주용 알루미늄 소재 공급업체입니다.", risk: "Medium", type: "global", query: "Constellium aerospace", category: "소재", watch: "알루미늄 가격, 고객 수요", note: "소재 가격 risk와 직접 연결됩니다." },
  { id: "Alcoa", name: "Alcoa", country: "미국", sales: "105억", item: "알루미늄 제련/소재", summary: "알루미늄 공급 측면에서 중요한 원자재 업체입니다.", risk: "High", type: "global", query: "Alcoa aerospace", category: "소재", watch: "알루미늄 급등, 생산 차질", note: "원자재 risk가 매우 큽니다." },
  { id: "ATI", name: "ATI", country: "미국", sales: "38억", item: "티타늄/특수합금", summary: "특수합금 계열 항공 소재 업체입니다.", risk: "Medium", type: "global", query: "ATI aerospace titanium", category: "소재", watch: "티타늄 가격, 공급 이슈", note: "소재 risk와 엔진 수요를 함께 보세요." },
  { id: "Norsk Hydro", name: "Norsk Hydro", country: "노르웨이", sales: "2091억 NOK", item: "알루미늄 압출재", summary: "알루미늄 계열 글로벌 소재 공급업체입니다.", risk: "Low", type: "global", query: "Norsk Hydro aerospace", category: "소재", watch: "압출재 수요, ESG, 공급 안정성", note: "ESG와 supply risk를 같이 확인하세요." },
  { id: "Kobe Steel", name: "Kobe Steel", country: "일본", sales: "2.4조 JPY", item: "티타늄/특수강", summary: "일본 특수금속 및 소재 공급업체입니다.", risk: "Medium", type: "global", query: "Kobe Steel aerospace", category: "소재", watch: "특수강 공급, 일본 생산 이슈", note: "일본 생산 risk에 민감합니다." },
  { id: "Carpenter Technology", name: "Carpenter Technology", country: "미국", sales: "25억", item: "고성능 특수합금", summary: "고성능 합금 계열 업체입니다.", risk: "Low", type: "global", query: "Carpenter Technology aerospace", category: "소재", watch: "특수합금 수요", note: "합금 shortage risk를 확인하세요." },
  { id: "Hexcel", name: "Hexcel", country: "미국", sales: "19억", item: "복합재 소재", summary: "복합재 수요와 소재 가격 흐름을 확인할 수 있습니다.", risk: "Low", type: "global", query: "Hexcel aerospace", category: "소재", watch: "복합재 수요, OEM 생산 계획", note: "원자재와 수요를 같이 보는 것이 좋습니다." },
  { id: "Solvay", name: "Solvay", country: "벨기에", sales: "134억 EUR", item: "특수 화학소재", summary: "항공우주용 특수 화학소재 업체입니다.", risk: "Low", type: "global", query: "Solvay aerospace", category: "소재", watch: "화학소재 수요, 생산 이슈", note: "화학 소재 risk도 체크해야 합니다." },
  { id: "Precision Castparts Corp.", name: "Precision Castparts Corp.", country: "미국", sales: "비공개", item: "주조/단조 부품", summary: "대형 주조 및 단조 항공부품 업체입니다.", risk: "Low", type: "global", query: "Precision Castparts Corp aerospace", category: "엔진/구조", watch: "단조품 수요, 엔진 공급망", note: "엔진 부품 risk 점검에 중요합니다." },
  { id: "Doncasters Group", name: "Doncasters Group", country: "영국", sales: "비공개", item: "정밀주조 엔진부품", summary: "정밀주조 기반 엔진 부품 업체입니다.", risk: "Medium", type: "global", query: "Doncasters Group aerospace", category: "엔진부품", watch: "정밀주조 수요, 생산 차질", note: "엔진부품 delay risk 확인이 중요합니다." },
  { id: "Arconic", name: "Arconic", country: "미국", sales: "82억", item: "알루미늄 시트/소재", summary: "구조용 알루미늄 소재 업체입니다.", risk: "Medium", type: "global", query: "Arconic aerospace", category: "소재", watch: "알루미늄 수요, 공급 차질", note: "소재 리스크와 직접 연결됩니다." },
  { id: "LISI Aerospace", name: "LISI Aerospace", country: "프랑스", sales: "14억 EUR", item: "패스너/구조 하드웨어", summary: "항공 패스너 전문 업체입니다.", risk: "Low", type: "global", query: "LISI Aerospace", category: "패스너", watch: "체결류 수요, OEM 일정", note: "패스너 shortage도 risk입니다." },
  { id: "Stanley Engineered Fastening", name: "Stanley Engineered Fastening", country: "미국", sales: "그룹기반", item: "리벳/체결 시스템", summary: "항공 체결 시스템 공급업체입니다.", risk: "Low", type: "global", query: "Stanley Engineered Fastening aerospace", category: "패스너", watch: "리벳 수요, 공급 안정성", note: "체결류 공급 risk를 체크하세요." },
  { id: "Howmet Aerospace", name: "Howmet Aerospace", country: "미국", sales: "66억", item: "패스너/단조 부품", summary: "패스너와 단조 부품 공급업체입니다.", risk: "Low", type: "global", query: "Howmet Aerospace", category: "엔진부품", watch: "엔진 파트, 패스너 공급", note: "엔진 supply risk와 연결됩니다." }
];

const fallbackMetricData = {
  fxDate: "저장값 기준",
  usd: { value: 1384.0, display: "1,384.00", unit: "KRW/USD", change: "+4.30" },
  gbp: { value: 1726.0, display: "1,726.00", unit: "KRW/GBP", change: "+6.10" },
  eur: { value: 1502.0, display: "1,502.00", unit: "KRW/EUR", change: "+5.40" },
  cny: { value: 191.0, display: "191.00", unit: "KRW/CNY", change: "-0.40" },
  jpy: { value: 958.0, display: "958.00", unit: "KRW/100JPY", change: "+3.20" },
  oil: {
    value: 82.4,
    display: "82.40",
    unit: "USD/bbl",
    change: "+1.50",
    label: "WTI 유가",
    source: "WTI 기준",
    ranges: {
      week: [78.8, 79.4, 79.1, 80.2, 81.0, 81.7, 82.4],
      month: [71.5, 72.2, 73.1, 74.5, 75.8, 76.2, 77.1, 78.0, 79.3, 80.4, 81.2, 82.4],
      year: [68.17, 94.53, 75.32, 75.84, 64.89, 76.78]
    }
  },
  aluminum: {
    value: 2418,
    display: "2,418.00",
    unit: "USD/t",
    change: "+18.00",
    label: "LME 알루미늄",
    source: "LME 기준",
    ranges: {
      week: [2362, 2370, 2378, 2388, 2401, 2410, 2418],
      month: [2159.73, 2135.58, 2184.67, 2194.39, 2202.26, 2192.01, 2210.44, 2236.18, 2262.45, 2310.72, 2364.11, 2418.0],
      year: [2472.85, 2705.02, 2255.74, 2419.02, 2630.62, 3372.95]
    }
  }
};

function getRangeLabels(rangeKey) {
  if (rangeKey === "week") {
    return ["1주차", "2주차", "3주차", "4주차", "5주차", "6주차", "7주차"];
  }

  if (rangeKey === "month") {
    const today = new Date();
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - 11 + index, 1);
      const year = String(date.getFullYear()).slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}.${month}`;
    });
  }

  return ["2021", "2022", "2023", "2024", "2025", "2026"];
}

const importantKeywords = ["파업", "지연", "리스크", "risk", "제재", "급등", "차질", "shortage", "delay", "shutdown"];
const mediumKeywords = ["계약", "증설", "투자", "수주", "expansion", "contract", "investment", "partnership"];

let selectedCompany = null;
let selectedMetric = "fx";
let selectedRange = "week";
let liveMetrics = JSON.parse(JSON.stringify(fallbackMetricData));

async function fetchServerJson(url) {
  const response = await fetch(url, {
    headers: {
      "Cache-Control": "no-cache"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function translateRisk(risk) {
  return { Low: "낮음", Medium: "보통", High: "높음" }[risk] || risk;
}

function riskTagClass(risk) {
  return { Low: "good", Medium: "warn", High: "danger" }[risk] || "warn";
}

function metricRiskLabel(key) {
  return { good: "안정", warn: "주의", danger: "높음" }[metricStatus(key)] || "주의";
}

function emphasizeRiskWords(text) {
  return String(text || "").replace(/리스크|\brisk\b/gi, (match) => `<span class="risk-word">${match}</span>`);
}

function formatNumber(value, digits = 2) {
  return Number(value).toLocaleString("ko-KR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function metricStatus(key) {
  if (key === "fx") return Number(liveMetrics.usd.value || 0) >= 1380 ? "warn" : "good";
  if (key === "oil") return Number(liveMetrics.oil.value || 0) >= 82 ? "warn" : "good";
  if (key === "aluminum") return Number(liveMetrics.aluminum.value || 0) >= 2400 ? "danger" : "warn";
  return "good";
}

function extractSmbsRate(html, patterns) {
  const normalized = html.replace(/\s+/g, " ");
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match && match[1]) {
      const value = Number(match[1].replace(/,/g, ""));
      if (!Number.isNaN(value)) return value;
    }
  }
  return null;
}

async function loadSmbsFxRates() {
  const sourceUrl = "https://www.smbs.co.kr/Eng/ExRate/TodayExRate.jsp";
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(sourceUrl)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) throw new Error("SMBS fetch failed");

  const html = await response.text();
  const dateMatch = html.match(/DATE\s*:\s*(\d{4}\.\s*\d{2}\.\s*\d{2})/i);
  const usd = extractSmbsRate(html, [
    /<td[^>]*>\s*USD\s*<\/td>[\s\S]{0,240}?<td[^>]*>\s*([0-9,]+(?:\.[0-9]+)?)\s*<\/td>/i,
    /USD[\s\S]{0,240}?([0-9,]+(?:\.[0-9]+)?)/i
  ]);
  const gbpUsd = extractSmbsRate(html, [
    /<td[^>]*>\s*GBP\s*\(US\$\)\s*<\/td>[\s\S]{0,240}?<td[^>]*>\s*([0-9,]+(?:\.[0-9]+)?)\s*<\/td>/i,
    /GBP\s*\(US\$\)[\s\S]{0,240}?([0-9,]+(?:\.[0-9]+)?)/i
  ]);
  const eurUsd = extractSmbsRate(html, [
    /<td[^>]*>\s*EUR\s*\(US\$\)\s*<\/td>[\s\S]{0,240}?<td[^>]*>\s*([0-9,]+(?:\.[0-9]+)?)\s*<\/td>/i,
    /EUR\s*\(US\$\)[\s\S]{0,240}?([0-9,]+(?:\.[0-9]+)?)/i
  ]);
  const cnh = extractSmbsRate(html, [
    /<td[^>]*>\s*CNH\s*<\/td>[\s\S]{0,240}?<td[^>]*>\s*([0-9,]+(?:\.[0-9]+)?)\s*<\/td>/i,
    /CNH[\s\S]{0,240}?([0-9,]+(?:\.[0-9]+)?)/i
  ]);
  const jpy = extractSmbsRate(html, [
    /<td[^>]*>\s*JPY\s*\(100\)\s*<\/td>[\s\S]{0,240}?<td[^>]*>\s*([0-9,]+(?:\.[0-9]+)?)\s*<\/td>/i,
    /JPY\s*\(100\)[\s\S]{0,240}?([0-9,]+(?:\.[0-9]+)?)/i
  ]);

  if (!usd || !gbpUsd || !eurUsd || !cnh || !jpy) throw new Error("SMBS parsing failed");

  return {
    date: dateMatch ? dateMatch[1].replace(/\s+/g, "") : "SMBS 기준",
    usd,
    gbp: usd * gbpUsd,
    eur: usd * eurUsd,
    cny: usd / cnh,
    jpy
  };
}

async function loadLiveFxRates() {
  try {
    const smbs = await loadSmbsFxRates();
    liveMetrics.fxDate = `${smbs.date} / SMBS`;
    liveMetrics.usd.value = smbs.usd;
    liveMetrics.usd.display = formatNumber(smbs.usd);
    liveMetrics.gbp.value = smbs.gbp;
    liveMetrics.gbp.display = formatNumber(smbs.gbp);
    liveMetrics.eur.value = smbs.eur;
    liveMetrics.eur.display = formatNumber(smbs.eur);
    liveMetrics.cny.value = smbs.cny;
    liveMetrics.cny.display = formatNumber(smbs.cny);
    liveMetrics.jpy.value = smbs.jpy;
    liveMetrics.jpy.display = formatNumber(smbs.jpy);
  } catch {
    liveMetrics.fxDate = "저장값 기준";
  }
}

function applyServerMarketBundle(bundle) {
  if (!bundle) return;

  if (bundle.fx?.items?.length) {
    const rateMap = Object.fromEntries(bundle.fx.items.map((item) => [item.key, item]));
    liveMetrics.fxDate = `${bundle.fx.updatedAt} / ${bundle.fx.source}`;

    ["usd", "gbp", "eur", "cny", "jpy"].forEach((key) => {
      const item = rateMap[key];
      if (!item) return;
      liveMetrics[key].value = item.value;
      liveMetrics[key].display = formatNumber(item.value);
    });
  }

  if (bundle.oil) {
    liveMetrics.oil.value = bundle.oil.latestValue;
    liveMetrics.oil.display = formatNumber(bundle.oil.latestValue);
    liveMetrics.oil.change = bundle.oil.changeLabel;
    liveMetrics.oil.source = `${bundle.oil.source} / ${bundle.oil.updatedAt}`;
    if (bundle.oil.ranges?.week?.length === 7) liveMetrics.oil.ranges.week = bundle.oil.ranges.week;
    if (bundle.oil.ranges?.month?.length === 12) liveMetrics.oil.ranges.month = bundle.oil.ranges.month;
    if (bundle.oil.ranges?.year?.length) liveMetrics.oil.ranges.year = bundle.oil.ranges.year;
  }

  if (bundle.aluminum) {
    liveMetrics.aluminum.value = bundle.aluminum.latestValue;
    liveMetrics.aluminum.display = formatNumber(bundle.aluminum.latestValue);
    liveMetrics.aluminum.change = bundle.aluminum.changeLabel;
    liveMetrics.aluminum.source = `${bundle.aluminum.source} / ${bundle.aluminum.updatedAt}`;
    if (bundle.aluminum.ranges?.week?.length === 7) liveMetrics.aluminum.ranges.week = bundle.aluminum.ranges.week;
    if (bundle.aluminum.ranges?.month?.length === 12) liveMetrics.aluminum.ranges.month = bundle.aluminum.ranges.month;
    if (bundle.aluminum.ranges?.year?.length) liveMetrics.aluminum.ranges.year = bundle.aluminum.ranges.year;
  }
}

async function loadLiveDataFromServer() {
  const bundle = await fetchServerJson(`/api/market?t=${Date.now()}`);
  applyServerMarketBundle(bundle);
}

function parseFredCsv(csv) {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const cells = line.split(",");
      const date = (cells[0] || "").replace(/^"|"$/g, "");
      const numericCells = cells
        .slice(1)
        .map((cell) => Number(String(cell).replace(/^"|"$/g, "").replace(/,/g, "")))
        .filter((value) => !Number.isNaN(value));
      return { date, value: numericCells[numericCells.length - 1] };
    })
    .filter((row) => row.date && !Number.isNaN(row.value));
}

function groupMonthlyAverage(points, months = 12) {
  const grouped = new Map();
  points.forEach((point) => {
    const date = new Date(point.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(point.value);
  });
  return Array.from(grouped.entries()).slice(-months).map(([key, values]) => ({
    label: `M${Array.from(grouped.keys()).indexOf(key) - Math.max(0, grouped.size - months) + 1}`,
    value: values.reduce((sum, value) => sum + value, 0) / values.length
  }));
}

async function loadLiveOilData() {
  try {
    const url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILWTICO";
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`${url}&t=${Date.now()}`)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) return;
    const csv = await response.text();
    const points = parseFredCsv(csv);
    if (!points.length) return;

    const latest = points[points.length - 1];
    const previous = points[points.length - 2] || latest;
    const weekly = points.slice(-7).map((point) => point.value);
    const monthly = groupMonthlyAverage(points.slice(-370), 12).map((item) => Number(item.value.toFixed(2)));

    liveMetrics.oil.value = latest.value;
    liveMetrics.oil.display = formatNumber(latest.value);
    liveMetrics.oil.change = `${latest.value - previous.value >= 0 ? "+" : ""}${formatNumber(latest.value - previous.value)}`;
    liveMetrics.oil.source = `WTI 기준 / ${latest.date}`;
    liveMetrics.oil.ranges.week = weekly;
    if (monthly.length === 12) liveMetrics.oil.ranges.month = monthly;
  } catch {
    // keep fallback
  }
}

async function loadLiveAluminumData() {
  try {
    const baseUrl = "https://www.marketwatch.com/investing/future/ali00/download-data?countrycode=uk";
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`${baseUrl}&mod=mw_quote_tab&t=${Date.now()}`)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) return;
    const csv = await response.text();
    const points = parseFredCsv(csv.replace(/^Date,Close/i, "DATE,VALUE"));
    if (!points.length) return;

    const latest = points[points.length - 1];
    const previous = points[points.length - 2] || latest;
    const weekly = points.slice(-7).map((point) => point.value);
    const monthly = groupMonthlyAverage(points.slice(-370), 12).map((item) => Number(item.value.toFixed(2)));

    liveMetrics.aluminum.value = latest.value;
    liveMetrics.aluminum.display = formatNumber(latest.value);
    liveMetrics.aluminum.change = `${latest.value - previous.value >= 0 ? "+" : ""}${formatNumber(latest.value - previous.value)}`;
    liveMetrics.aluminum.source = `LME 기준 / ${latest.date}`;
    liveMetrics.aluminum.ranges.week = weekly;
    if (monthly.length === 12) liveMetrics.aluminum.ranges.month = monthly;
  } catch {
    // keep fallback
  }
}

async function refreshAllLiveData(options = {}) {
  const { rerenderNews = true } = options;
  try {
    await loadLiveDataFromServer();
  } catch {
    await loadLiveFxRates();
    await loadLiveOilData();
    await loadLiveAluminumData();
  }
  renderMetrics();
  renderSummary();
  if (!document.getElementById("chartModal").classList.contains("hidden")) {
    renderModalContent();
  }
  if (rerenderNews) {
    await renderNews();
  }
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("supplierFavorites") || "[]");
  } catch {
    return [];
  }
}

function setFavorites(ids) {
  localStorage.setItem("supplierFavorites", JSON.stringify(ids));
}

function isFavorite(companyId) {
  return getFavorites().includes(companyId);
}

function toggleFavorite(companyId) {
  const favorites = getFavorites();
  if (favorites.includes(companyId)) {
    setFavorites(favorites.filter((id) => id !== companyId));
  } else {
    setFavorites([...favorites, companyId]);
  }
}

function getBoardItems() {
  try {
    return JSON.parse(localStorage.getItem("requestBoardItems") || "[]");
  } catch {
    return [];
  }
}

function setBoardItems(items) {
  localStorage.setItem("requestBoardItems", JSON.stringify(items));
}

function renderMetrics() {
  const metricGrid = document.getElementById("metricGrid");
  const metricOrder = [
    { key: "fx", label: "환율 정보" },
    { key: "oil", label: "WTI 유가" },
    { key: "aluminum", label: "LME 알루미늄" }
  ];

  metricGrid.innerHTML = metricOrder.map((item) => {
    const status = metricStatus(item.key);
    const metric = item.key === "fx"
      ? { display: `USD ${liveMetrics.usd.display}`, unit: liveMetrics.fxDate, change: "미국, 영국, 유로, 중국, 일본" }
      : liveMetrics[item.key];
    return `
      <div class="metric-card alert-${status}" data-key="${item.key}">
        <div class="metric-heading">
          <h3>${item.label}</h3>
          <span class="metric-status-line"><i class="risk-dot ${status}"></i><span class="metric-risk-label">리스크 : ${metricRiskLabel(item.key)}</span></span>
        </div>
        <strong>${metric.display}</strong>
        <span>${metric.unit} / ${metric.change}</span>
      </div>
    `;
  }).join("");

  metricGrid.querySelectorAll(".metric-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedMetric = card.dataset.key;
      selectedRange = "week";
      openModal();
      renderModalContent();
    });
  });
}

function renderSummary() {
  const summaryGrid = document.getElementById("summaryGrid");
  if (!summaryGrid) return;
  const cards = [
    {
      level: metricStatus("fx"),
      title: `환율 <span class="risk-word">리스크</span>`,
      body: `${liveMetrics.usd.display} KRW/USD · ${liveMetrics.fxDate}`
    },
    {
      level: metricStatus("oil"),
      title: `에너지 <span class="risk-word">리스크</span>`,
      body: `WTI ${liveMetrics.oil.display} USD/bbl · ${liveMetrics.oil.change}`
    },
    {
      level: metricStatus("aluminum"),
      title: `원자재 <span class="risk-word">리스크</span>`,
      body: `LME Al ${liveMetrics.aluminum.display} USD/t · ${liveMetrics.aluminum.change}`
    }
  ];

  summaryGrid.innerHTML = cards.map((card) => `
    <div class="summary-card ${card.level}">
      <h3>${card.title}</h3>
      <p>${emphasizeRiskWords(card.body)}</p>
    </div>
  `).join("");
}

function renderFavorites() {
  const favoriteList = document.getElementById("favoriteList");
  const favorites = getFavorites().map((id) => companies.find((company) => company.id === id)).filter(Boolean);
  if (!favorites.length) {
    favoriteList.innerHTML = `<div class="detail-card"><p>관심업체를 추가하면 여기에 고정됩니다.</p></div>`;
    return;
  }

  favoriteList.innerHTML = favorites.map((company) => `
    <div class="favorite-chip ${selectedCompany && selectedCompany.id === company.id ? "active" : ""}" data-id="${company.id}">
      ${company.name}
    </div>
  `).join("");

  favoriteList.querySelectorAll(".favorite-chip").forEach((node) => {
    node.addEventListener("click", async () => {
      selectedCompany = companies.find((company) => company.id === node.dataset.id) || null;
      await renderAllCompanySections({ deferNews: true });
    });
  });
}

function buildSourceLinks() {
  const container = document.getElementById("sourceLinks");
  const queryBase = selectedCompany ? (selectedCompany.query || selectedCompany.name) : "항공우주 방산 공급망";
  const query = encodeURIComponent(queryBase);
  const links = [
    { label: "Google", url: `https://news.google.com/search?q=${query}` },
    { label: "Naver", url: `https://search.naver.com/search.naver?where=news&query=${query}` }
  ];
  container.innerHTML = links.map((link) => `<a class="source-link" href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join("");
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchGoogleNewsItems() {
  try {
    const query = selectedCompany
      ? (selectedCompany.query || selectedCompany.name)
      : "항공우주 방산 공급망";
    const payload = await fetchServerJson(`/api/news?query=${encodeURIComponent(query)}&t=${Date.now()}`);
    if (Array.isArray(payload.items) && payload.items.length) {
      return payload.items;
    }
  } catch {
    // fallback to direct fetch below
  }

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString().slice(0, 10);
  const baseQuery = selectedCompany
    ? `"${selectedCompany.query || selectedCompany.name}" (aerospace OR space OR satellite OR launch OR defense) after:${since}`
    : "(aerospace OR aviation OR satellite OR launch OR spaceflight OR defense) after:" + since;
  const rssTarget = `https://news.google.com/rss/search?q=${encodeURIComponent(baseQuery)}&hl=ko&gl=KR&ceid=KR:ko&oc=11&t=${Date.now()}`;
  const rssUrl = encodeURIComponent(rssTarget);
  const endpoints = [
    `https://api.allorigins.win/raw?url=${rssUrl}`,
    `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&_=${Date.now()}`
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) continue;
      if (endpoint.includes("rss2json")) {
        const payload = await response.json();
        const items = (payload.items || []).map((item) => ({
          source: "Google News",
          title: item.title || "제목 없음",
          url: item.link,
          summary: item.description ? stripHtml(item.description) : "Google News result",
          date: item.pubDate || new Date().toISOString()
        }));
        const filtered = items.filter((item) => !Number.isNaN(new Date(item.date).getTime()))
          .filter((item) => new Date(item.date).getTime() >= Date.now() - 1000 * 60 * 60 * 24 * 45);
        if (filtered.length) return filtered;
      } else {
        const xml = await response.text();
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const items = [];
        let match;
        while ((match = itemRegex.exec(xml)) !== null) {
          const chunk = match[1];
          const title = stripHtml((chunk.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "");
          const link = stripHtml((chunk.match(/<link>([\s\S]*?)<\/link>/i) || [])[1] || "");
          const pubDate = (chunk.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1] || "";
          const description = stripHtml((chunk.match(/<description>([\s\S]*?)<\/description>/i) || [])[1] || "");
          if (title && link) {
            items.push({ source: "Google News", title, url: link, summary: description || "Google News result", date: pubDate || new Date().toISOString() });
          }
        }
        const filtered = items.filter((item) => !Number.isNaN(new Date(item.date).getTime()))
          .filter((item) => new Date(item.date).getTime() >= Date.now() - 1000 * 60 * 60 * 24 * 45);
        if (filtered.length) return filtered;
      }
    } catch {
      continue;
    }
  }
  return [];
}

function formatNewsDate(dateText) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function newsPriority(item) {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  if (importantKeywords.some((keyword) => text.includes(keyword.toLowerCase()))) return { label: "중요", level: "high" };
  if (mediumKeywords.some((keyword) => text.includes(keyword.toLowerCase()))) return { label: "관심", level: "medium" };
  return { label: "일반", level: "low" };
}

function highlightKeywords(text) {
  let result = String(text || "");
  [...importantKeywords, ...mediumKeywords].forEach((keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(`(${escaped})`, "gi"), '<span class="highlight-risk">$1</span>');
  });
  return result;
}

function getFilteredCompanies(type, searchText) {
  return companies.filter((company) => {
    const searchBase = `${company.id} ${company.name} ${company.country} ${company.item} ${company.category}`.toLowerCase();
    return company.type === type && searchBase.includes(searchText.toLowerCase());
  });
}

function renderCompanyList(type, searchText = "") {
  const targetId = type === "domestic" ? "domesticList" : "globalList";
  const list = document.getElementById(targetId);
  const filtered = getFilteredCompanies(type, searchText);

  list.innerHTML = filtered.map((company) => `
    <div class="company-item ${selectedCompany && selectedCompany.id === company.id ? "active" : ""}" data-id="${company.id}">
      <div class="company-title-row">
        <h3>${company.name}</h3>
        <span class="category-chip">${company.category}</span>
      </div>
      <div class="company-meta">
        <span class="source-badge">${translateRisk(company.risk)}</span>
        ${isFavorite(company.id) ? '<span class="source-badge">관심</span>' : ""}
      </div>
      <p>${company.country} / ${company.item}</p>
    </div>
  `).join("");

  list.querySelectorAll(".company-item").forEach((item) => {
    item.addEventListener("click", async () => {
      selectedCompany = companies.find((entry) => entry.id === item.dataset.id) || null;
      await renderAllCompanySections({ deferNews: true });
    });
  });
}

function renderFavoriteButton() {
  const button = document.getElementById("favoriteToggleButton");
  if (!selectedCompany) {
    button.textContent = "관심업체 추가";
    button.disabled = true;
    return;
  }
  button.disabled = false;
  button.textContent = isFavorite(selectedCompany.id) ? "관심업체 해제" : "관심업체 추가";
}

function getMemoKey(companyId) {
  return `supplierMemo:${companyId}`;
}

function loadMemo() {
  const textarea = document.getElementById("supplierMemo");
  const status = document.getElementById("memoStatus");
  if (!selectedCompany) {
    textarea.value = "";
    textarea.disabled = true;
    status.textContent = "업체를 선택하면 메모를 작성할 수 있습니다.";
    return;
  }
  textarea.disabled = false;
  textarea.value = localStorage.getItem(getMemoKey(selectedCompany.id)) || "";
  status.textContent = "";
}

function renderCompanyDetail() {
  const title = document.getElementById("companyTitle");
  const detail = document.getElementById("companyDetail");
  if (!selectedCompany) {
    title.textContent = "공급업체 정보";
    detail.innerHTML = `<div class="detail-card"><p>왼쪽 공급업체를 클릭하면 국가, 매출, 공급 품목, 모니터링 포인트를 볼 수 있습니다.</p></div>`;
    renderFavoriteButton();
    loadMemo();
    return;
  }

  title.textContent = `${selectedCompany.name} 정보`;
  detail.innerHTML = `
    <div class="detail-card">
      <p>${emphasizeRiskWords(selectedCompany.summary)}</p>
    </div>
    <div class="info-grid">
      <div class="info-box"><span>국가</span><strong>${selectedCompany.country}</strong></div>
      <div class="info-box"><span>매출</span><strong>${selectedCompany.sales}</strong></div>
      <div class="info-box"><span>공급품목</span><strong>${selectedCompany.item}</strong></div>
      <div class="info-box"><span>카테고리</span><strong>${selectedCompany.category}</strong></div>
      <div class="info-box"><span><span class="risk-word">리스크</span> 수준</span><strong>${translateRisk(selectedCompany.risk)}</strong></div>
      <div class="info-box"><span>뉴스 검색어</span><strong>${selectedCompany.query}</strong></div>
    </div>
    <div class="detail-card">
      <h3 class="detail-section-title">추가로 보면 좋은 정보</h3>
      <div class="detail-list">
        <div class="info-box"><span>모니터링 포인트</span><strong>${emphasizeRiskWords(selectedCompany.watch)}</strong></div>
        <div class="info-box"><span>메모</span><strong>${emphasizeRiskWords(selectedCompany.note)}</strong></div>
      </div>
    </div>
    <div class="detail-card">
      <span class="tag ${riskTagClass(selectedCompany.risk)}"><span class="risk-word">리스크</span> ${translateRisk(selectedCompany.risk)}</span>
    </div>
  `;
  renderFavoriteButton();
  loadMemo();
}

function renderNewsMode() {
  document.getElementById("newsModeBadge").textContent = selectedCompany ? `${selectedCompany.name} 뉴스 모드` : "전체 뉴스 모드";
}

async function renderNews() {
  const newsTitle = document.getElementById("newsTitle");
  const list = document.getElementById("newsList");
  newsTitle.textContent = selectedCompany ? `${selectedCompany.name} 관련 뉴스` : "전체 최신 뉴스";
  renderNewsMode();
  buildSourceLinks();
  list.innerHTML = `<div class="detail-card"><p>${selectedCompany ? `${selectedCompany.name} 관련 뉴스를 불러오는 중입니다...` : "전체 공급망 최신 뉴스를 불러오는 중입니다..."}</p></div>`;

  try {
    const items = (await fetchGoogleNewsItems()).slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    if (!items.length) {
      list.innerHTML = `<div class="detail-card"><p>뉴스를 불러오지 못했습니다. 상단 Google, Naver 버튼으로 직접 확인해 주세요.</p></div>`;
      return;
    }
    list.innerHTML = items.map((item) => {
      const priority = newsPriority(item);
      return `
        <a class="news-item" href="${item.url}" target="_blank" rel="noopener noreferrer">
          <div class="news-meta">
            <span class="source-badge">${item.source}</span>
            <span class="source-badge">${formatNewsDate(item.date)}</span>
            <span class="priority-badge ${priority.level}">${priority.label}</span>
          </div>
          <h3>${highlightKeywords(item.title)}</h3>
          <p>${highlightKeywords(item.summary)}</p>
        </a>
      `;
    }).join("");
  } catch {
    list.innerHTML = `<div class="detail-card"><p>뉴스를 불러오지 못했습니다. 상단 검색 링크를 이용해 주세요.</p></div>`;
  }
}

function renderNewsLoading() {
  const newsTitle = document.getElementById("newsTitle");
  const list = document.getElementById("newsList");
  newsTitle.textContent = selectedCompany ? `${selectedCompany.name} 愿???댁뒪` : "?꾩껜 理쒖떊 ?댁뒪";
  renderNewsMode();
  buildSourceLinks();
  list.innerHTML = `<div class="detail-card"><p>${selectedCompany ? `${selectedCompany.name} 愿???댁뒪瑜?잠깐 뒤에 이어서 遺덈윭?ㅻ땲??` : "?꾩껜 怨듦툒留?理쒖떊 ?댁뒪瑜?잠깐 뒤에 이어서 遺덈윭?ㅻ땲??"}</p></div>`;
}

function queueNewsRender() {
  window.setTimeout(() => {
    renderNews().catch(() => {
      const list = document.getElementById("newsList");
      if (list) {
        list.innerHTML = `<div class="detail-card"><p>?댁뒪瑜?遺덈윭?ㅼ? 紐삵뻽?듬땲?? ?곷떒 Google, Naver 踰꾪듉?쇰줈 吏곸젒 ?뺤씤??二쇱꽭??</p></div>`;
      }
    });
  }, 0);
}

function renderBoard() {
  const items = getBoardItems();
  const list = document.getElementById("requestList");
  if (!items.length) {
    list.innerHTML = `<div class="empty-state"><p>등록된 요청이 없습니다.</p></div>`;
    return;
  }
  list.innerHTML = items.map((item) => `
    <div class="request-item">
      <strong>${item.type} / ${item.text}</strong>
      <p>${item.createdAt}</p>
    </div>
  `).join("");
}

async function renderAllCompanySections(options = {}) {
  const { deferNews = false } = options;
  renderFavorites();
  renderCompanyList("domestic", document.getElementById("domesticSearch").value);
  renderCompanyList("global", document.getElementById("globalSearch").value);
  renderCompanyDetail();
  if (deferNews) {
    renderNewsLoading();
    queueNewsRender();
    return;
  }
  await renderNews();
}

function openModal() {
  document.getElementById("chartModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("chartModal").classList.add("hidden");
}

function renderFxModal() {
  const fxKeys = ["usd", "gbp", "eur", "cny", "jpy"];
  document.getElementById("chartContent").innerHTML = `
    <div class="detail-card">
      <p>환율 정보는 그래프 없이 미국, 영국, 유로, 중국, 일본 환율을 함께 보여줍니다. 기준일은 ${liveMetrics.fxDate} 입니다.</p>
    </div>
    <div class="fx-grid">
      ${fxKeys.map((key) => `
        <div class="fx-card">
          <span>${{ usd: "미국 환율", gbp: "영국 환율", eur: "유로 환율", cny: "중국 환율", jpy: "일본 환율" }[key]}</span>
          <strong>${liveMetrics[key].display}</strong>
          <span>${liveMetrics[key].unit}</span>
        </div>
      `).join("")}
    </div>
  `;
  document.getElementById("chartRangeButtons").classList.add("hidden");
  document.getElementById("chartSource").textContent = "환율 기준: SMBS 우선, 실패 시 저장값 표시";
}

function renderChart(metricKey, rangeKey) {
  const metric = liveMetrics[metricKey];
  const values = metric.ranges[rangeKey];
  const labels = getRangeLabels(rangeKey);
  const rangeLabel = rangeKey === "week" ? "주간" : rangeKey === "month" ? "월간" : "년간";
  const width = 860;
  const height = 320;
  const padding = { top: 24, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = Math.max(1, maxValue - minValue);
  const accent = metricKey === "oil" ? "#1f6fff" : "#e48a20";

  const grid = Array.from({ length: 5 }, (_, index) => {
    const y = padding.top + (chartHeight / 4) * index;
    return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e7eef7" />`;
  }).join("");

  const xGap = chartWidth / Math.max(values.length - 1, 1);
  const points = values.map((value, index) => {
    const x = padding.left + xGap * index;
    const y = padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  const dots = values.map((value, index) => {
    const x = padding.left + xGap * index;
    const y = padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
    return `<circle cx="${x}" cy="${y}" r="5" fill="${accent}" /><text x="${x}" y="${y - 12}" text-anchor="middle" fill="#4f647b" font-size="11">${formatNumber(value, metricKey === "oil" ? 1 : 0)}</text>`;
  }).join("");

  const labelNodes = labels.map((label, index) => {
    const x = padding.left + xGap * index;
    return `<text x="${x}" y="${height - 12}" text-anchor="middle" fill="#7a8da3" font-size="12">${label}</text>`;
  }).join("");

  document.getElementById("chartContent").innerHTML = `
    <div class="detail-card"><p>${metric.label} / ${metric.source} / ${rangeLabel}${rangeKey === "year" ? " (2021~2026)" : ""}</p></div>
    <div class="chart-wrap">
      <svg id="trendChart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        ${grid}
        <polyline fill="none" stroke="${accent}" stroke-width="3" points="${points}" />
        ${dots}
        ${labelNodes}
      </svg>
    </div>
  `;
  document.getElementById("chartRangeButtons").classList.remove("hidden");
  document.getElementById("chartSource").textContent = `${metric.label} / ${metric.source} / 현재 표시값 ${metric.display} ${metric.unit}`;
}

function renderModalContent() {
  const chartTitle = document.getElementById("chartTitle");
  const rangeButtons = document.getElementById("chartRangeButtons");
  if (selectedMetric === "fx") {
    chartTitle.textContent = "환율 정보";
    renderFxModal();
    return;
  }

  chartTitle.textContent = selectedMetric === "oil" ? "WTI 유가 추이" : "LME 알루미늄 추이";
  rangeButtons.innerHTML = ["week", "month", "year"].map((key) => `
    <button class="range-btn ${selectedRange === key ? "active" : ""}" data-range="${key}">
      ${key === "week" ? "주간" : key === "month" ? "월간" : "년간"}
    </button>
  `).join("");

  rangeButtons.querySelectorAll(".range-btn").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRange = button.dataset.range;
      renderModalContent();
    });
  });
  renderChart(selectedMetric, selectedRange);
}

function bindEvents() {
  document.getElementById("domesticSearch").addEventListener("input", (event) => renderCompanyList("domestic", event.target.value));
  document.getElementById("globalSearch").addEventListener("input", (event) => renderCompanyList("global", event.target.value));
  document.getElementById("refreshButton").addEventListener("click", async () => {
    await refreshAllLiveData({ rerenderNews: false });
    await renderAllCompanySections({ deferNews: true });
  });
  document.getElementById("showAllNewsButton").addEventListener("click", async () => {
    selectedCompany = null;
    await renderAllCompanySections({ deferNews: true });
  });
  document.getElementById("favoriteToggleButton").addEventListener("click", async () => {
    if (!selectedCompany) return;
    toggleFavorite(selectedCompany.id);
    await renderAllCompanySections({ deferNews: true });
  });
  document.getElementById("saveMemoButton").addEventListener("click", () => {
    const textarea = document.getElementById("supplierMemo");
    const status = document.getElementById("memoStatus");
    if (!selectedCompany) return;
    localStorage.setItem(getMemoKey(selectedCompany.id), textarea.value);
    status.textContent = "메모가 저장되었습니다.";
    setTimeout(() => { status.textContent = ""; }, 1800);
  });
  document.getElementById("boardToggleButton").addEventListener("click", () => {
    document.getElementById("boardPanel").classList.toggle("hidden");
  });
  document.getElementById("boardCloseButton").addEventListener("click", () => {
    document.getElementById("boardPanel").classList.add("hidden");
  });
  document.getElementById("saveRequestButton").addEventListener("click", () => {
    const type = document.getElementById("requestType").value;
    const input = document.getElementById("requestInput");
    const text = input.value.trim().slice(0, 30);
    if (!text) return;
    const items = getBoardItems();
    items.unshift({
      type,
      text,
      createdAt: new Intl.DateTimeFormat("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date())
    });
    setBoardItems(items.slice(0, 20));
    input.value = "";
    renderBoard();
  });
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", closeModal);
}

async function init() {
  try {
    await loadLiveDataFromServer();
  } catch {
    await loadLiveFxRates();
    await loadLiveOilData();
    await loadLiveAluminumData();
  }
  renderMetrics();
  renderSummary();
  renderBoard();
  await renderAllCompanySections({ deferNews: true });
  bindEvents();
  setInterval(() => {
    refreshAllLiveData({ rerenderNews: true });
  }, 5 * 60 * 1000);
}

init();
