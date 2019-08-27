const puppeteer = require('puppeteer')
const base = 'https://movie.douban.com/subject/'
const doubanId = '27010768'
const videoBase = `https://movie.douban.com/trailer/251346`
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

var init = async () => {
  console.log('start visit the target page')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'], // 不开启沙箱模式
    dumpio: false
  })

  const page = await browser.newPage()
  await page.goto(base + doubanId, {
    // 访问url
    waitUntil: 'networkidle2' //等待网络空闲再释放控制权
  })
  await sleep(1000) // 让网页加载后 等待一秒

  const result = await page.evaluate(() => {
    // evaluate在页面里执行JS脚本
    var $ = window.$
    var it = $('.related-pic-video')
    var posterDom = $('.nbgnbg')
    if (it && it.length >= 1) {
      var link = it.attr('href')
      var cover = it.css("backgroundImage"); // 获取css的属性
      let res = cover.match(/"(.*?)"/) // 截取背景图的 图片地址的正则  截取双引号 放在数组中
      cover = res[1] // 直接取
      var poster = posterDom.find('img').attr('src')
      return {
        link,
        cover,
        poster
      }
    }
    return {}
  })
  let video
  // 判断是否有预告片
  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'
    })
    await sleep(2000)
    video = await page.evaluate(() => {
      var $ = window.$
      var it = $('source')
      if (it && it.length > 0) {
        return it.attr('src')
      }
      return ''
    })
  }

  const data = {
    video,
    doubanId,
    poster: result.poster,
    cover: result.cover
  }
  await browser.close()
  console.log(result)
  process.send(data)
  process.exit(0)
}
init()