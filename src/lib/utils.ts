import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function indentContent(content: string, indent: string = '      '): string {
  return content.split('\n').map(line => indent + line).join('\n');
}

export function htmlToJsx(
  html: string,
  componentName: string = "HtmlComponent"
): string {
  const toCamelCase = (str: string): string =>
    str.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());

  const jsxContent: string = html
    .replace(/class=/g, "className=")
    .replace(/for=/g, "htmlFor=")
    .replace(
      /([a-zA-Z-]+)=/g,
      (match: string, p1: string) => `${toCamelCase(p1)}=`
    );
  
  const jsxContentIndented: string = indentContent(jsxContent);
  const component: string = `import React from 'react';

const ${componentName} = () => {
  return (
    <>
${jsxContentIndented}
    </>
  );
};

export default ${componentName};
`;
  return component;
}
