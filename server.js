const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const MARKET_CACHE_TTL_MS = 5 * 60 * 1000;
const NEWS_CACHE_TTL_MS = 3 * 60 * 1000;

const cacheStore = {
  market: {
    expiresAt: 0,
    data: null,
    pending: null
  },
  news: new Map()
};

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function getNewsCacheEntry(query) {
  if (!cacheStore.news.has(query)) {
    cacheStore.news.set(query, {
      expiresAt: 0,
      data: null,
      pending: null
    });
  }

  return cacheStore.news.get(query);
}

async function getCachedPayload(entry, ttlMs, loader) {
  const now = Date.now();

  if (entry.data && entry.expiresAt > now) {
    return entry.data;
  }

  if (entry.pending) {
    return entry.pending;
  }

  entry.pending = (async () => {
    try {
      const data = await loader();
      entry.data = data;
      entry.expiresAt = Date.now() + ttlMs;
      return data;
    } finally {
      entry.pending = null;
    }
  })();

  return entry.pending;
}

function serveStatic(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(res, 404, { error: "File not found" });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream"
    });
    res.end(data);
  });
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }

  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }

  return response.json();
}

function formatNumber(value, digits = 2) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
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

async function fetchSmbsFxSnapshot() {
  const html = await fetchText("https://www.smbs.biz/Eng/ExRate/TodayExRate.jsp");
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

  if (!usd || !gbpUsd || !eurUsd || !cnh || !jpy) {
    throw new Error("SMBS parsing failed");
  }

  return {
    source: "SMBS",
    updatedAt: dateMatch ? dateMatch[1].replace(/\s+/g, "").replace(/\./g, "-") : new Date().toISOString().slice(0, 10),
    dateLabel: dateMatch ? dateMatch[1].replace(/\s+/g, "") : "",
    items: [
      { key: "usd", label: "미국 환율", value: usd, displayValue: `${formatNumber(usd, 2)} KRW/USD` },
      { key: "gbp", label: "영국 환율", value: usd * gbpUsd, displayValue: `${formatNumber(usd * gbpUsd, 2)} KRW/GBP` },
      { key: "eur", label: "유로 환율", value: usd * eurUsd, displayValue: `${formatNumber(usd * eurUsd, 2)} KRW/EUR` },
      { key: "cny", label: "중국 환율", value: usd / cnh, displayValue: `${formatNumber(usd / cnh, 2)} KRW/CNY` },
      { key: "jpy", label: "일본 환율", value: jpy, displayValue: `${formatNumber(jpy, 2)} KRW/100JPY` }
    ]
  };
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRss(xml, sourceLabel) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const chunk = match[1];
    const title = decodeHtml((chunk.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "");
    const link = decodeHtml((chunk.match(/<link>([\s\S]*?)<\/link>/i) || [])[1] || "");
    const pubDate = (chunk.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1] || "";
    const description = decodeHtml((chunk.match(/<description>([\s\S]*?)<\/description>/i) || [])[1] || "");

    if (title && link) {
      items.push({
        source: sourceLabel,
        title,
        url: link,
        summary: description || `${sourceLabel} result`,
        date: pubDate || new Date().toISOString()
      });
    }
  }

  return items;
}

function uniqueByUrl(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item.url || seen.has(item.url)) {
      return false;
    }
    seen.add(item.url);
    return true;
  });
}

function normalizeCsvPoints(csv) {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const cells = line.split(",");
      const date = String(cells[0] || "").replace(/^"|"$/g, "");
      const numericCells = cells
        .slice(1)
        .map((cell) => Number(String(cell).replace(/^"|"$/g, "").replace(/,/g, "")))
        .filter((value) => !Number.isNaN(value));

      return {
        date,
        value: numericCells[numericCells.length - 1]
      };
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
    key,
    value: values.reduce((sum, value) => sum + value, 0) / values.length
  }));
}

function buildYearlyAverage(points, years = [2021, 2022, 2023, 2024, 2025, 2026]) {
  return years.map((year) => {
    const filtered = points.filter((point) => new Date(point.date).getFullYear() === year);
    if (!filtered.length) {
      return null;
    }

    const average = filtered.reduce((sum, point) => sum + point.value, 0) / filtered.length;
    return {
      label: String(year),
      value: Number(average.toFixed(2))
    };
  }).filter(Boolean);
}

async function fetchGoogleNews(query) {
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  const xml = await fetchText(rssUrl);
  return parseRss(xml, "Google News");
}

async function fetchNaverNews(query) {
  const html = await fetchText(`https://search.naver.com/search.naver?where=news&sort=1&query=${encodeURIComponent(query)}`);
  const items = [];
  const articleRegex = /<a[^>]+class="[^"]*news_tit[^"]*"[^>]+href="([^"]+)"[^>]+title="([^"]+)"[^>]*>/g;
  let match;

  while ((match = articleRegex.exec(html)) !== null) {
    const around = html.slice(Math.max(0, match.index - 1200), Math.min(html.length, match.index + 2000));
    const summary =
      decodeHtml((around.match(/<div[^>]+class="[^"]*news_dsc[^"]*"[^>]*>([\s\S]*?)<\/div>/i) || [])[1] || "") ||
      decodeHtml((around.match(/<span[^>]+class="[^"]*api_txt_lines[^"]*"[^>]*>([\s\S]*?)<\/span>/i) || [])[1] || "") ||
      "Naver News result";

    items.push({
      source: "Naver News",
      title: decodeHtml(match[2]),
      url: match[1],
      summary,
      date: new Date().toISOString()
    });
  }

  return items;
}

async function fetchFxSnapshot() {
  try {
    return await fetchSmbsFxSnapshot();
  } catch (smbsError) {
    const data = await fetchJson("https://api.frankfurter.app/latest?base=EUR&symbols=USD,GBP,KRW,CNY,JPY");
    const rates = data?.rates || {};
    const krwPerEur = rates.KRW;

    if (!krwPerEur || !rates.USD || !rates.GBP || !rates.CNY || !rates.JPY) {
      throw new Error(`SMBS failed: ${smbsError.message} / Frankfurter failed`);
    }

    const usd = krwPerEur / rates.USD;
    const gbp = krwPerEur / rates.GBP;
    const eur = krwPerEur;
    const cny = krwPerEur / rates.CNY;
    const jpy = (krwPerEur / rates.JPY) * 100;

    return {
      source: "Frankfurter / ECB",
      updatedAt: data.date || new Date().toISOString().slice(0, 10),
      dateLabel: data.date || "",
      items: [
        { key: "usd", label: "미국 환율", value: usd, displayValue: `${formatNumber(usd, 2)} KRW/USD` },
        { key: "gbp", label: "영국 환율", value: gbp, displayValue: `${formatNumber(gbp, 2)} KRW/GBP` },
        { key: "eur", label: "유로 환율", value: eur, displayValue: `${formatNumber(eur, 2)} KRW/EUR` },
        { key: "cny", label: "중국 환율", value: cny, displayValue: `${formatNumber(cny, 2)} KRW/CNY` },
        { key: "jpy", label: "일본 환율", value: jpy, displayValue: `${formatNumber(jpy, 2)} KRW/100JPY` }
      ]
    };
  }
}


async function fetchWtiSeries() {
  const csv = await fetchText("https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILWTICO");
  const points = normalizeCsvPoints(csv);
  const latest = points[points.length - 1];
  const previous = points[points.length - 2] || latest;

  return {
    label: "WTI 유가",
    latestValue: latest.value,
    latestDisplay: formatNumber(latest.value, 2),
    change: latest.value - previous.value,
    changeLabel: `${latest.value - previous.value >= 0 ? "+" : ""}${formatNumber(latest.value - previous.value, 2)}`,
    updatedAt: latest.date,
    updatedLabel: latest.date,
    source: "FRED / EIA",
    ranges: {
      week: points.slice(-7).map((point) => point.value),
      month: groupMonthlyAverage(points.slice(-370), 12).map((item) => Number(item.value.toFixed(2))),
      year: buildYearlyAverage(points).map((item) => item.value)
    }
  };


}

async function fetchAluminumSeries() {
  const csv = await fetchText("https://fred.stlouisfed.org/graph/fredgraph.csv?id=PALUMUSDM");
  const points = normalizeCsvPoints(csv);
  const latest = points[points.length - 1];
  const previous = points[points.length - 2] || latest;

  return {
    label: "알루미늄",
    latestValue: latest.value,
    latestDisplay: formatNumber(latest.value, 2),
    change: latest.value - previous.value,
    changeLabel: `${latest.value - previous.value >= 0 ? "+" : ""}${formatNumber(latest.value - previous.value, 2)}`,
    updatedAt: latest.date,
    updatedLabel: latest.date,
    source: "FRED / IMF",
    ranges: {
      week: points.slice(-7).map((point) => point.value),
      month: points.slice(-12).map((point) => Number(point.value.toFixed(2))),
      year: buildYearlyAverage(points).map((item) => item.value)
    }
  };
}


async function fetchMarketBundle() {
  const [fxResult, oilResult, aluminumResult] = await Promise.allSettled([
    fetchFxSnapshot(),
    fetchWtiSeries(),
    fetchAluminumSeries()
  ]);

  const bundle = {};
  const errors = [];

  if (fxResult.status === "fulfilled") {
    bundle.fx = fxResult.value;
  } else {
    errors.push(`fx: ${fxResult.reason.message}`);
  }

  if (oilResult.status === "fulfilled") {
    bundle.oil = oilResult.value;
  } else {
    errors.push(`oil: ${oilResult.reason.message}`);
  }

  if (aluminumResult.status === "fulfilled") {
    bundle.aluminum = aluminumResult.value;
  } else {
    errors.push(`aluminum: ${aluminumResult.reason.message}`);
  }

  if (!bundle.fx && !bundle.oil && !bundle.aluminum) {
    throw new Error(`All market sources failed - ${errors.join(" | ")}`);
  }

  bundle.errors = errors;
  return bundle;
}

async function fetchNewsBundle(query) {
  const settled = await Promise.allSettled([
    fetchGoogleNews(query),
    fetchNaverNews(query)
  ]);

  const items = uniqueByUrl(
    settled
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value)
  )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 12);

  return { items };
}


const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname === "/api/market") {
    try {
      const data = await getCachedPayload(
        cacheStore.market,
        MARKET_CACHE_TTL_MS,
        () => fetchMarketBundle()
      );
      sendJson(res, 200, data);
    } catch (error) {
      sendJson(res, 500, {
        error: "Failed to fetch market data",
        details: error.message
      });
    }
    return;
  }

  if (requestUrl.pathname === "/api/news") {
    try {
      const query = requestUrl.searchParams.get("query") || "항공우주 방산 공급망";
      const data = await getCachedPayload(
        getNewsCacheEntry(query),
        NEWS_CACHE_TTL_MS,
        () => fetchNewsBundle(query)
      );
      sendJson(res, 200, data);
    } catch (error) {
      sendJson(res, 500, {
        error: "Failed to fetch news",
        details: error.message
      });
    }
    return;
  }

  const requestedPath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = path.join(ROOT, requestedPath);

  if (!filePath.startsWith(ROOT)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  serveStatic(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
