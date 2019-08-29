//https://douban.uieee.com  /v2/movie/subject/:id 查询电影的详情 简介

const rp = require('request-promise-native')
const mongoose = require('mongoose')

const Movie = mongoose.model('Movie')

const Category = mongoose.model('Category')

async function fetchMovie(item) {
  const url = `https://douban.uieee.com/v2/movie/${item.doubanId}`
  const res = await rp(url)
  let body
  try {
    body = JSON.parse(res)
  } catch (error) {
    console.log(error)
  }
  return body
};
(async () => {
  let movies = await Movie.find({ //查询条件
    $or: [{
        summary: {
          $exists: false
        }
      },
      {
        summary: null
      },
      {
        year: {
          $exists: false
        }
      },
      {
        title: ''
      },
      {
        summary: ''
      }
    ]
  })
  console.log(movies)

  for (let i = 0; i < movies.length; i++) { //循环 电影列表信息
    let movie = movies[i]
    if (movie.doubanId !== undefined) {
      let movieData = await fetchMovie(movie) // 通过这个函数拿到 想要的电影信息
      if (movieData) {
        let tags = movieData.tags || []
        movie.tags = tags.toString()
        movie.summary = movieData.summary || ''
        movie.title = movieData.title || ''
        movie.rawTitle = movieData.alt_title || movieData.title || ''
        movie.countries = movieData.attrs.country || []
        movie.genres = movieData.attrs.movie_type || []

        if (movieData.attrs) {
          movie.movieTypes = movieData.attrs.movie_type || []
          movie.year = movieData.attrs.year[0] || 2500
          for (let i = 0; i < movie.movieTypes.length; i++) {

            let item = movie.movieTypes[i]

            let cat = await Category.findOne({
              name: item
            })

            if (!cat) {
              cat = new Category({
                name: item,
                movies: [movie._id]
              })
            } else {
              if (cat.movies.indexOf(movie._id === -1)) {
                cat.movies.push(movie._id)
              }
            }
            await cat.save()
            if (!movie.category) {
              movie.category.push(cat._id)
            } else {
              if (movie.category.indexOf(cat._id) === -1) {
                movie.category.push(cat._id)
              }
            }
          }

          let dates = movieData.attrs.pubdate || []
          let pubdates = []

          // 电影上映时间
          dates.map(item => {
            if (item && item.split('(').length > 0) {
              let parts = item.split('(')
              let date = parts[0]
              let country = '未知'
              if (parts[1]) {
                country = parts[1].split(')')[0]
              }
              pubdates.push({
                date: new Date(date),
                country
              })
            }
          })

          movie.pubdates = pubdates
        }
        tags.forEach(tag => {
          movie.tags.push(tag.name)
        })
        console.log(movie)
        await movie.save()
      }
    }
  }
})()