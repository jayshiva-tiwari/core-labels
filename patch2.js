const fs = require('fs');
let code = fs.readFileSync('src/components/PropertiesPanel.tsx', 'utf8');

code = code.replace(
  `                <input 
                  type="number" 
                  value={styles.fontSize || 14} 
                  onChange={(e) => update('fontSize', parseInt(e.target.value))} 
                  className="w-12 text-sm border-l border-gray-300 p-2 outline-none text-center" 
                />`,
  `                <input 
                  type="number" 
                  value={styles.fontSize || ''} 
                  placeholder="14"
                  onChange={(e) => update('fontSize', e.target.value ? parseInt(e.target.value) : undefined)} 
                  className="w-16 text-sm border-l border-gray-300 p-2 outline-none text-center" 
                />`
);

fs.writeFileSync('src/components/PropertiesPanel.tsx', code);
