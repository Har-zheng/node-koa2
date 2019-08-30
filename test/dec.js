class Boy {
  @speak('中文')
  run() {
    console.log('I can speak !' + this.language)
    console.log('I can run !')
  }
}

function speak(language) {
  return function (target, key, descriptor) {
    console.log(target)
    console.log(key) // 指的 run 方法
    console.log(descriptor) // 指的方法里的内容
    target.language = language
    console.log(target)
    return descriptor
  }
}

let louk = new Boy()
louk.run()