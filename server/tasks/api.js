

//https://douban.uieee.com  /v2/movie/subject/:id 查询电影的详情 简介

const rp = require('request-promise-native')

async function fetchMovie(item) {
  const url = `https://douban.uieee.com/v2/movie/subject/${item.doubanId}` 
  const res = await rp(url)
  return res
}
;(async () => {
  let movies = [
    {
      doubanId: 30254040,
      title: '',
      rate: 0,
      poster:
        'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2565165033.jpg'
    },
    {
      doubanId: 26425063,
      title: '',
      rate: 0,
      poster:
        'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2535260806.jpg'
    }
  ]
  movies.map(async movie => {
    let movieData = await fetchMovie(movie)
    try {
      movieData = JSON.parse(movieData)
      console.log(movieData.tags)
      console.log(movieData.summary)
    } catch (error) {
      console.log(error)
    }
  })
})()