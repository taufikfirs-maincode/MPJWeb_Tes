// Menggunakan node-fetch untuk memanggil API di sisi server
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  // Ambil API Key dari Environment Variable yang aman di Netlify
  const API_KEY = process.env.NEWS_API_KEY;
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
