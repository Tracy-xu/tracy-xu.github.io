const fs = require('fs');
const path = require('path');

function writeFileSync(fileURL, data) {
  // path.sep 表示操作系统特定的路径分隔符，在 Windows 上是反斜杠 \，在 Unix 上是正斜杠 /。在正则表达式中，反斜杠 \ 是一个特殊字符，用于转义其他字符，如果直接将 path.sep 用于正则表达式的构造函数，会导致语法错误
  // 使用 path.sep.replace(/\\/g, '\\\\') 来将路径分隔符中的反斜杠 \ 转义为 \\，以便在正则表达式中正确匹配
  const filePath = new RegExp(path.sep.replace(/\\/g, '\\\\')).test(fileURL) ? fileURL.slice(0, fileURL.lastIndexOf(path.sep)) : fileURL;
  if (!fs.existsSync(filePath)) {
    mkdirSync(filePath);
  }
  fs.writeFileSync(fileURL, data);
}
function mkdirSync(filePath) {
  let folderList = filePath.split(path.sep);
  let curPath = folderList[0];
  for (let i = 0; i < folderList.length; i++) {
    if (!fs.existsSync(curPath)) {
      fs.mkdirSync(curPath);
    }
    curPath = curPath + path.sep + folderList[i + 1];
  }
}

// path.normalize 输出规范格式的 path 字符串
writeFileSync(path.normalize('./data/17/a/b/1017.txt'), 'asdfasdf');
