const fs = require('fs');
const xml = fs.readFileSync('C:\\Users\\86151\\Desktop\\26年8月找实习材料\\Rsuem_Website\\extracted\\word\\document.xml', 'utf8');
const text = xml.replace(/<w:p[^>]*>/g, '\n').replace(/<[^>]+>/g, '');
fs.writeFileSync('C:\\Users\\86151\\Desktop\\26年8月找实习材料\\Rsuem_Website\\extracted_text.txt', text);
console.log('Done');
