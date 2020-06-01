const fs = require('fs')
const path = require('path')
let base = 'docs' // md文件夹

let sidebar = {}
var getFiles = function(srcDir, parentFolder) {
  
  let files = fs.readdirSync(srcDir)
  files.forEach(function(file) {
    let srcPath = path.join(srcDir, file)
    let stats = fs.statSync(srcPath)
    if (stats.isDirectory()) {
      sidebar[`/${base}/${file}/`] = [{
        title: `${file}`,
        children: []
      }]
      getFiles(srcPath, file)
    } else {
      let f = file.split('.md')[0]
      if (f === 'README') {
        sidebar[`/${base}/${parentFolder}/`][0].children.unshift('')
      } else {
        sidebar[`/${base}/${parentFolder}/`][0].children.push(f)
      }
    }
  })
  return sidebar
}

exports.getFiles = getFiles