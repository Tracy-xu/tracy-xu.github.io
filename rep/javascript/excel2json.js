/**
 * EXCEL 转 JSON
 */
import fs from 'fs';
import xlsx from 'node-xlsx';

const sheetList = xlsx.parse('test.xlsx');
const [title, ...contentList] = sheetList[0].data;
const result = contentList.map(item => ({
  companyName: item[0],
  socialCode: item[2],
  licence: item[3],
  companyType: item[5],
  companyLevel: item[8],
  principal: item[9],
  duty: item[11],
  phone: item[23],
}));
function writeFile(fileName, data) {
  fs.writeFile(fileName, data, 'utf-8', err => {
    if (!err) {
      console.log('文件生成成功');
    }
  });
}
writeFile('result.json', JSON.stringify(result));
