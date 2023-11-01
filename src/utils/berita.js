const request = require('postman-request');

const getNews = (callback) => {
  const accessKey = '129ef4aa5c43af2e06172b184bdf2078'; // Gantilah dengan API key Anda sendiri
  const url = `http://api.mediastack.com/v1/news?access_key=${accessKey}&languages=en&limit=5`;

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback('Tidak dapat terkoneksi ke layanan berita', undefined);
    } else if (response.body.error) {
      callback('Tidak dapat mendapatkan berita', undefined);
    } else {
      const articles = response.body.data || [];
      const newsList = articles.map((article, index) => {
        return `${index + 1}. ${article.title} - ${article.source_name}`;
      });
      callback(undefined, newsList.join('\n'));
    }
  });
};

module.exports = getNews;
