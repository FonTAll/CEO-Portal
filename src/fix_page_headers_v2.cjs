const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('src/pages', { recursive: true })
  .filter(f => f.endsWith('.tsx'))
  .map(f => path.join('src/pages', f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace Header Section container to strictly enforce items-center and flex-row
  content = content.replace(/({\/\*\s*HEADER SECTION[^*]*\*\/\}\s*)<div className="([^"]*?)"/g, (match, prefix, classStr) => {
      classStr = classStr.replace(/flex-col sm:flex-row/g, 'flex-row');
      classStr = classStr.replace(/items-start sm:items-center/g, 'items-center');
      classStr = classStr.replace(/sm:items-center/g, 'items-center');
      return `${prefix}<div className="${classStr}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated items-center in', file);
  }
});
