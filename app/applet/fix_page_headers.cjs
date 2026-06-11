const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('src/pages', { recursive: true })
  .filter(f => f.endsWith('.tsx'))
  .map(f => path.join('src/pages', f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace pt-* pb-* on the HEADER SECTION div with h-14
  content = content.replace(/({\/\*\s*HEADER SECTION[^*]*\*\/\}\s*)<div className="([^"]*?)"/g, (match, prefix, classStr) => {
      classStr = classStr.replace(/pt-\d+\s+pb-\d+\s+/g, '');
      classStr = classStr.replace(/pt-0\s+pb-0\s+/g, '');
      classStr = classStr.replace(/px-8 /g, ''); // User might want px-8, we will add it back explicitly
      
      // Ensure h-14
      if (!classStr.includes('h-14')) {
          classStr = 'h-14 px-8 ' + classStr;
      }
      return `${prefix}<div className="${classStr}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
