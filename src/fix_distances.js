import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages', { recursive: true })
  .filter(f => f.endsWith('.tsx'))
  .map(f => path.join('src/pages', f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace mt-2 with mt-[2px] right after HEADER SECTION
  let lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
     if (lines[i].includes('<!-- HEADER SECTION') || lines[i].includes('{/* HEADER SECTION')) {
        // search forward a bit
        for (let j = i+1; j < Math.min(i+30, lines.length); j++) {
            if (lines[j].includes('className="mt-2 pb-6"')) {
                lines[j] = lines[j].replace('mt-2 pb-6', 'mt-[2px] px-8 pb-6');
                break;
            }
            if (lines[j].includes('className="px-8 mt-2 pb-6 max-w-')) {
                lines[j] = lines[j].replace('mt-2 pb-6', 'mt-[2px] pb-6');
                break;
            }
            if (lines[j].includes('className="mt-4 pb-6"')) {
                lines[j] = lines[j].replace('mt-4 pb-6', 'mt-[2px] px-8 pb-6');
                break;
            }
        }
     }
  }
  content = lines.join('\n');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated distance', file);
  }
});
