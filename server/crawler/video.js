// 爬取电影的 海报 预告片地址  等信息
const puppeteer = require('puppeteer')
const base = 'https://movie.douban.com/subject/'
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})
process.on('message', async movies => {


  console.log('start visit the target page')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'], // 不开启沙箱模式
    dumpio: false
  })

  const page = await browser.newPage()

  for (let i = 0; i < movies.length; i++) {
    let doubanId = movies[i].doubanId
    if(doubanId !== undefined){}
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
    process.send(data)
  }
  await browser.close()
  process.exit(0)
})