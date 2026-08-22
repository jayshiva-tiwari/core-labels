const fs = require('fs');
let code = fs.readFileSync('src/components/LabelMockup.tsx', 'utf8');

const interactiveBlockDef = `  const InteractiveBlock: React.FC<{ field?: LabelField; defaultClasses: string; children: React.ReactNode }> = ({ field, defaultClasses, children }) => {
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
  };`;

// Remove it from its current location
code = code.replace(interactiveBlockDef, '');

// Insert it right before `if (template === 'tabular') {`
code = code.replace(
  `  if (template === 'tabular') {`,
  interactiveBlockDef + `\n\n  if (template === 'blank') {
    return (
      <div 
        className={\`bg-white shadow-2xl rounded-sm p-4 flex flex-col relative transition-all duration-300 ease-in-out \${sizeClasses[size]} mx-auto my-auto overflow-hidden\`}
        style={printDims[size]}
        id="print-label"
        onClick={() => onSelectField('')}
      >
        <div className="flex-1 w-full flex flex-col gap-2 relative z-10">
          {fields.length === 0 ? (
             <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
               <span className="text-xl font-medium tracking-wide">Blank Canvas</span>
             </div>
          ) : (
            fields.map(f => (
              <InteractiveBlock key={f.id} field={f} defaultClasses="w-full">
                <FieldContent field={f} className="font-semibold block w-full" style={getTextStyleObj(f.styles)} />
              </InteractiveBlock>
            ))
          )}
        </div>
      </div>
    );
  }

  if (template === 'tabular') {`
);

fs.writeFileSync('src/components/LabelMockup.tsx', code);
