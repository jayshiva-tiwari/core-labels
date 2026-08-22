const fs = require('fs');
let code = fs.readFileSync('src/components/LabelMockup.tsx', 'utf8');

if (!code.includes('import { FieldContent }')) {
  code = code.replace(
    `import { LabelSize, LabelField, LabelTemplate, LabelStyle } from '../types';`,
    `import { LabelSize, LabelField, LabelTemplate, LabelStyle } from '../types';\nimport { FieldContent } from './FieldContent';`
  );
}

code = code.replace(
  `<span className={\`\${c.tabTitle} font-normal break-words whitespace-pre-wrap block w-full\`} style={getTextStyleObj(f.styles)} title={f.value}>{f.value}</span>`,
  `<FieldContent field={f} className={\`\${c.tabTitle} font-normal break-words whitespace-pre-wrap\`} style={getTextStyleObj(f.styles)} />`
);

code = code.replace(
  `<span className={\`\${c.tabText} font-normal break-words whitespace-pre-wrap block w-full\`} style={getTextStyleObj(f.styles)} title={f.value}>{f.value}</span>`,
  `<FieldContent field={f} className={\`\${c.tabText} font-normal break-words whitespace-pre-wrap\`} style={getTextStyleObj(f.styles)} />`
);


// And for extra fields
code = code.replace(
  `            <InteractiveBlock key={f.id} field={f} defaultClasses="w-full">
              <div className="font-semibold block w-full">{f.value}</div>
            </InteractiveBlock>`,
  `            <InteractiveBlock key={f.id} field={f} defaultClasses="w-full">
              <FieldContent field={f} className="font-semibold block w-full" style={getTextStyleObj(f.styles)} />
            </InteractiveBlock>`
);

fs.writeFileSync('src/components/LabelMockup.tsx', code);
