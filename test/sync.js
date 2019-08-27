const doSync = (sth, time) => new Promise(resolve => {
  setTimeout(() => {
    console.log(sth + '用了' + time + '毫秒')
    resolve()
  }, time)
})
const doASync = (sth, time, cb) => {
  setTimeout(() => {
    console.log(sth + '用了' + time + '毫秒')
    cb && cb()
  }, time)
}
const doElse = (sth) => {
  console.log(sth)
}
const Zhz = {
  doSync,
  doASync
}
const Meizi = {
  doSync,
  doASync,
  doElse
}

;
(async () => {
  console.log('case: 1 妹子等待')
  await Zhz.doSync('Zhz 刷牙', 1000)
  console.log('啥也没干一直等')
  await Meizi.doSync('妹子洗澡去了', 2000)
  console.log('妹子去忙别的')

  console.log('case: 3 妹子等待按了下门')
  Zhz.doASync('Zhz 刷牙', 1000, () => {
    console.log('通知妹子来门口')
    Meizi.doASync('妹子洗澡去了', 2000)

  })
  Meizi.doElse('妹子去忙别的')

})()