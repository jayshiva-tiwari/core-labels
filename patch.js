const fs = require('fs');
let code = fs.readFileSync('src/components/LabelMockup.tsx', 'utf8');

code = code.replace(
  `const getStyleObj = (styles?: LabelStyle, defaultAlign?: 'left'|'center'|'right'|'justify') => {`,
  `const getTextStyleObj = (styles?: LabelStyle) => {
    if (!styles) return {};
    const obj: React.CSSProperties = {};
    if (styles.fontFamily) obj.fontFamily = styles.fontFamily;
    if (styles.fontSize) obj.fontSize = \`\${styles.fontSize}px\`;
    if (styles.color) obj.color = styles.color;
    return obj;
  };

  const getStyleObj = (styles?: LabelStyle, defaultAlign?: 'left'|'center'|'right'|'justify') => {`
);

code = code.replace(
  `  const InteractiveBlock: React.FC<{ field?: LabelField; defaultClasses: string; children: React.ReactNode }> = ({ field, defaultClasses, children }) => {
    if (!field) return <div className={defaultClasses}>{children}</div>;
    const isSelected = selectedFieldId === field.id;
    return (
      <div 
        onClick={(e) => { e.stopPropagation(); onSelectField(field.id); }}
        className={\`\${defaultClasses} cursor-pointer transition-colors outline-none \${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded' : 'hover:bg-gray-50/50 rounded'}\`}
        style={getStyleObj(field.styles, 'left')}
      >
        {children}
      </div>
    );
  };`,
  `  const InteractiveBlock: React.FC<{ field?: LabelField; defaultClasses: string; children: React.ReactNode }> = ({ field, defaultClasses, children }) => {
    if (!field) return <div className={defaultClasses}>{children}</div>;
    const isSelected = selectedFieldId === field.id;
    const textStyle = getTextStyleObj(field.styles);
    const styledChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          // @ts-ignore
          style: { ...(child.props.style || {}), ...textStyle }
        });
      }
      return child;
    });

    return (
      <div 
        onClick={(e) => { e.stopPropagation(); onSelectField(field.id); }}
        className={\`\${defaultClasses} cursor-pointer transition-colors outline-none \${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded' : 'hover:bg-gray-50/50 rounded'}\`}
        style={getStyleObj(field.styles, 'left')}
      >
        {styledChildren}
      </div>
    );
  };`
);

// update span elements in Tabular layout
code = code.replace(
  `                     <span className={\`\${c.tabTitle} font-normal break-words whitespace-pre-wrap block w-full\`} title={f.value}>{f.value}</span>`,
  `                     <span className={\`\${c.tabTitle} font-normal break-words whitespace-pre-wrap block w-full\`} style={getTextStyleObj(f.styles)} title={f.value}>{f.value}</span>`
);

code = code.replace(
  `                       <span className={\`\${c.tabText} font-normal break-words whitespace-pre-wrap block w-full\`} title={f.label}>{f.label}</span>`,
  `                       <span className={\`\${c.tabText} font-normal break-words whitespace-pre-wrap block w-full\`} style={getTextStyleObj(f.styles)} title={f.label}>{f.label}</span>`
);

code = code.replace(
  `                       <span className={\`\${c.tabText} font-normal break-words whitespace-pre-wrap block w-full\`} title={f.value}>{f.value}</span>`,
  `                       <span className={\`\${c.tabText} font-normal break-words whitespace-pre-wrap block w-full\`} style={getTextStyleObj(f.styles)} title={f.value}>{f.value}</span>`
);


fs.writeFileSync('src/components/LabelMockup.tsx', code);
