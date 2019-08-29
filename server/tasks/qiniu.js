const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config/index')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie');
const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.accessKey, config.qiniu.secretKey)

const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, ret, info) => { // 抓取网络资源  发布到空间
      if (err) {
        reject(err)
      } else {
        if (info.statusCode = 200) {
          resolve({
            key
          })
        } else {
          reject(info)
        }
      }
    })
  })
};
(async () => {
  const movies = await Movie.find({
    $or: [{
        videoKey: {
          $exists: false
        }
      },
      {
        videoKey: null
      },
      {
        videoKey: ''
      }
    ]
  })
  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]

    // 上传
    if (movie.video && !movie.videoKey) {
      try {
        console.log('开始 video')
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        console.log('开始 cover')
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.jpg')
        console.log('开始 poster')
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')
        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
          console.log(movie)
        }
        await movie.save()
      } catch (error) {
        console.log(error)
      }
    }
  }
})()

/*{ video:
  'http://vt1.doubanio.com/201908271522/10e9b68136f31ff7dcf4ccf092e2b654/view/movie/M/402510346.mp4',
 doubanId: '27010768',
 cover:
  'https://img3.doubanio.com/img/trailer/medium/2565710731.jpg?',
 poster:
  'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2535260806.jpg',
 videoKey: 'pwvwvarwl.bkt.clouddn.com/UZ03DfG17ms0FO7ofyN3d.mp4',
 coverKey: 'Bo4UFMiVPAmVSLNX7ZYD-.jpg',
 posterKey: 'pwvwvarwl.bkt.clouddn.com/jWEQTHWZEOTJ30b1G0gqS.jpg' }*/