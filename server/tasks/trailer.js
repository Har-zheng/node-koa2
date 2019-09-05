// 保存一些信息
const cp = require('child_process')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');
const {
  resolve
} = require('path');
(async () => {
  let movies = await Movie.find({
    $or: [
      {
        video: {
          $exists: false
        }
      },
      {
        video: null
      }
    ]
  })
  const script = resolve(__dirname, '../crawler/video.js')
  const child = cp.fork(script, [])
  let invoked = false
  child.on('error', err => {
    if (invoked) return
    invoked = false

    console.log(err)
  })
  child.on('exit', code => {
    if (invoked) return
    invoked = true
    let err = code === 0 ? null : new Error('exit code' + code)
  })

  child.on('message', async data => {
    console.log(data)
    let doubanId = data.doubanId
    let movie = await Movie.findOne({
      doubanId: doubanId
    })
    if (data.video) {
      movie.video = data.video
      movie.cover = data.cover

      await movie.save()
    } else {
      await movie.remove()
      let movieTypes = movie.movieTypes
      for (let i = 0; i < movieTypes.length; i++) {
        let type = movieTypes[i]

        let cat = Category.findOne({
          name: type
        })

        if (cat) {
          let idx = cat.movies.indexOf(movie._id)
          if (idx > -1) {
            cat.movies = cat.movies.splice(idx, 1)
          }
          await cat.save()
        }
      }
    }
  })
  child.send(movies)
})()