// netlify/functions/getNews.js

const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  // 1. Ambil variabel yang sudah memiliki awalan 'k' dari Netlify
  const prefixedApiKey = process.env.NEWS_API_KEY;

  // 2. Pastikan variabel ada
  if (!prefixedApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Variabel API Key tidak ditemukan di server.",
      }),
    };
  }

  // 3. Hapus 1 karakter pertama ('k') untuk mendapatkan API Key asli
  const API_KEY = prefixedApiKey.substring(1);

  const query =
    '("tenaga kerja indonesia" OR "pekerja migran indonesia" OR "lowongan kerja luar negeri" OR "indonesian migrant worker")';
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&language=id&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal mengambil berita dari server." }),
    };
  }
};
