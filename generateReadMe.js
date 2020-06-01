const fs = require('fs')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname + '/' + dir)
}

function getFolderContent (folder) {
  let files = fs.readdirSync(folder)
  if (!files && files.length === 0) {
    return false
  }
  let html = '## 目录\r\r'
  files.forEach(function(file) {
    let srcPath = path.join(folder, file)
    let stats = fs.statSync(srcPath)
    if (!stats.isDirectory()) {
      let f = file.split('.')[0]
      if (f !== 'README') {
        html += `[${f}](${file})\r\r`
      }
    }
  })
  return html
}

function read (srcDir) {
  let files = fs.readdirSync(srcDir)
  files.forEach(function(file) {
    let srcPath = path.join(srcDir, file)
    let stats = fs.statSync(srcPath)
    if (stats.isDirectory()) {
      let content = getFolderContent(srcPath)
      if (content) {
        fs.writeFile(path.join(srcPath, '/README.md'), content, function (err) {
          if (err) {
            console.log(`${path.join(srcPath, '/README.md')} 写入失败`)
          }
        })
      }
    }
  })
}

read(resolve('docs'))
