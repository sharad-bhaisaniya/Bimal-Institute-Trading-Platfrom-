const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const reqDir = path.join(__dirname, 'project requirements');
const outDir = path.join(__dirname, 'frontend', 'src', 'pages', 'public', 'policies');

const docs = [
  { file: 'fee_policy.docx', name: 'FeePolicy', title: 'Fee Policy' },
  { file: 'grievance policy.docx', name: 'GrievancePolicy', title: 'Grievance Redressal Policy' },
  { file: 'privacy policy.docx', name: 'PrivacyPolicy', title: 'Privacy Policy' },
  { file: 'refund policy.docx', name: 'RefundPolicy', title: 'Refund and Cancellation Policy' },
  { file: 'terms of service.docx', name: 'TermsOfService', title: 'Terms of Service' }
];

async function generate() {
  for (const doc of docs) {
    const docPath = path.join(reqDir, doc.file);
    if (!fs.existsSync(docPath)) {
      continue;
    }
    const result = await mammoth.convertToHtml({path: docPath});
    const htmlContent = result.value;
    
    // Custom parser to rebuild JSX
    const jsxContent = parseHtmlToJsx(htmlContent);
    generateComponent(doc.name, doc.title, jsxContent);
  }
}

function parseHtmlToJsx(html) {
  // First, normalize list tags that mammoth grouped
  // Mammoth outputs <ol><li><strong>HEADING</strong></li><li>Paragraph</li></ol>
  // We want to break these down into flat elements so we can process them sequentially
  let flatHtml = html
    .replace(/<\/?ol>/g, '')
    .replace(/<\/?ul>/g, '')
    .replace(/<li><strong>(.*?)<\/strong><\/li>/g, '##HEADING##$1##ENDHEADING##')
    .replace(/<li>(.*?)<\/li>/g, '<p>$1</p>');
  
  // Now we have a flat list of <p> and ##HEADING##...
  
  // Split by elements
  const elements = flatHtml.split(/(<p>.*?<\/p>|##HEADING##.*?##ENDHEADING##)/g).filter(s => s.trim().length > 0);
  
  let sectionCounter = 1;
  let inAlphaList = false;
  let inRomanList = false;
  let sectionOpen = false;
  let output = [];
  
  // Function to close any open lists
  const closeLists = () => {
    if (inRomanList) { output.push('</ol>'); inRomanList = false; }
    if (inAlphaList) { output.push('</ol>'); inAlphaList = false; }
  };

  output.push('<div className="space-y-6">');

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i].trim();
    if (!el) continue;

    if (el.startsWith('##HEADING##')) {
      closeLists();
      if (sectionOpen) { output.push('</section>'); }
      const headingText = el.replace('##HEADING##', '').replace('##ENDHEADING##', '').trim();
      
      // Some headings have numbers, some don't. We will strip existing numbers and re-add them.
      const cleanHeading = headingText.replace(/^[0-9]+[\.\)]?\s*/, '');
      
      output.push(`<section className="mt-8">`);
      output.push(`<h2 className="text-xl font-bold text-white mb-4">${sectionCounter}. ${cleanHeading}</h2>`);
      sectionCounter++;
      sectionOpen = true;
    } 
    else if (el.startsWith('<p>')) {
      const text = el.replace(/<\/?p>/g, '').trim();
      
      // Skip empty paragraphs or title paragraphs (e.g. <strong>FEES POLICY</strong>)
      if (!text || text === '<strong>FEES POLICY</strong>' || text === '<strong>PRIVACY POLICY</strong>' || text === '<strong>TERMS OF SERVICE</strong>') continue;

      // Detect Roman Numerals (i), (ii), (iii), (iv)
      const romanMatch = text.match(/^\((i|ii|iii|iv|v|vi|vii|viii|ix|x)\)\s*(.*)/i);
      // Detect Alpha Numerals (a), (b), (c)
      const alphaMatch = text.match(/^\([a-z]\)\s*(.*)/i);

      if (romanMatch) {
        if (inAlphaList) { output.push('</ol>'); inAlphaList = false; }
        if (!inRomanList) {
          output.push('<ol className="list-[lower-roman] pl-8 space-y-2 text-gray-300 mt-2 mb-4">');
          inRomanList = true;
        }
        output.push(`<li>${romanMatch[2]}</li>`);
      }
      else if (alphaMatch) {
        if (inRomanList) { output.push('</ol>'); inRomanList = false; }
        if (!inAlphaList) {
          output.push('<ol className="list-[lower-alpha] pl-6 space-y-2 text-gray-300 mt-2 mb-4">');
          inAlphaList = true;
        }
        output.push(`<li>${alphaMatch[1]}</li>`);
      }
      else {
        closeLists();
        output.push(`<p className="text-gray-300 leading-relaxed mb-4">${text}</p>`);
      }
    }
  }

  closeLists();
  if (sectionOpen) { output.push('</section>'); }
  output.push('</div>');

  // React requires parsing strings safely, but since we are generating JSX code directly,
  // we need to make sure we don't have unescaped braces { } inside the text unless we intend to.
  // The mammoth output might contain { }, we should replace them with {'{'} and {'}'}
  const safeOutput = output.join('\\n').replace(/\\{/g, '{"{"}').replace(/\\}/g, '{"}"}');
  // Restore the ones we injected for classNames
  const finalOutput = safeOutput.replace(/className="([^"]+)"/g, (match, p1) => {
    return `className="${p1}"`; // actually className=".." is fine in JSX.
  });

  // To prevent react compilation errors with raw html entities or unclosed tags from mammoth strong tags,
  // we can use a wrapper or just rely on the clean regex. Mammoth produces valid HTML.
  // Let's replace any class="..." with className="..." just in case mammoth produced it (it doesn't usually).

  return output.join('\\n');
}

function generateComponent(name, title, jsxContent) {
  // We need to carefully inject the jsxContent. 
  // Mammoth text might contain characters like < or & that break JSX if not wrapped in dangerouslySetInnerHTML,
  // BUT the user wants manual JSX. To avoid JSX parsing errors, we will replace <br> with <br /> etc.
  
  let cleanJsx = jsxContent
    .replace(/<br>/g, '<br />')
    .replace(/&/g, '&amp;') // encode ampersands
    .replace(/class=/g, 'className=')
    .replace(/style="([^"]*)"/g, ''); // strip inline styles if any

  const jsxCode = `import React from 'react';
import { motion } from 'framer-motion';

const ${name} = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111] border border-[#222222] rounded-2xl p-8 md:p-12 shadow-xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-[#222222] pb-6">
            ${title}
          </h1>
          
          ${cleanJsx}
          
        </motion.div>
      </div>
    </div>
  );
};

export default ${name};
`;

  fs.writeFileSync(path.join(outDir, `${name}.jsx`), jsxCode);
  console.log(`Generated Manual JSX Component: ${name}.jsx`);
}

generate().catch(console.error);
