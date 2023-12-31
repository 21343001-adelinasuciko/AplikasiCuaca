const express= require('express')
const app= express()
const path = require('path')
const hbs=require('hbs')
const geocode = require("./utils/geocode")
const forecast = require("./utils/prediksiCuaca")
const axios = require('axios');

const port = process.env.PORT || 1600

//mendefisinikan jalur/path untuk konfigurasi express
const direktoriPublic = path.join(__dirname, '../public')
const diretoriViews= path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

//setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', diretoriViews)
hbs.registerPartials(direktoriPartials)

//setup direktori statis
app.use(express.static(direktoriPublic))


//ini halaman utama
app.get('', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Adelina Suciko'
    })
})

//ini halaman bantuan/FAQ
app.get('/bantuan', (req, res) =>{
    res.render('bantuan', {
        judul: 'Bantuan',
        nama: 'Adelina Suciko'
    })
})

//ini halaman tentang
app.get('/tentang', (req, res) =>{
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Adelina Suciko'
    })
})

// Halaman infoCuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
      return res.send({
        error: 'Kamu harus memasukan lokasi yang ingin dicari'
      });
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, dataPrediksi) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          prediksiCuaca: dataPrediksi,
          lokasi: location,
          address: req.query.address
        });
      });
    });
  });

// Halaman berita
app.get('/berita', async (req, res) => {
  try {
      const urlApiMediaStack = 'http://api.mediastack.com/v1/news';
      const apiKey = 'da78b710337888febbdd77c314a5f037';

      const params = {
          access_key: apiKey,
          countries: 'id', 
      };

      const response = await axios.get(urlApiMediaStack, { params });
      const dataBerita = response.data;

      res.render('berita', {
          nama: 'Adelina Suciko',
          judul: 'Laman Berita',
          berita: dataBerita.data,
      });
      } catch (error) {
          console.error(error);
          res.render('error', {
              judul: 'Terjadi Kesalahan',
              pesanKesalahan: 'Terjadi kesalahan saat mengambil berita.',
          }); 
  }
});

//ini halaman bantuan/FAQ
app.get('/bantuan/*', (req, res) =>{
    res.render('404', {
        judul: '404',
        nama: 'Adelina Suciko',
        pesanKesalahan: 'Artikel yang dicari tidak ditemukan'
    })
})

app.get('*', (req, res) =>{
    res.render('404', {
        judul: '404',
        nama: 'Adelina Suciko',
        pesanKesalahan: 'Halaman tidak ditemukan'
    })
})

app.listen(port, () =>{
    console.log('Server berjalan pada port ' + port)
})


