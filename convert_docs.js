const mammoth = require('mammoth');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const reqDir = path.join(__dirname, 'project requirements');
const outDir = path.join(__dirname, 'frontend', 'src', 'pages', 'public', 'policies');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const docs = [
  { file: 'fee_policy.docx', name: 'FeePolicy', title: 'Fee Policy' },
  { file: 'grievance policy.docx', name: 'GrievancePolicy', title: 'Grievance Redressal Policy' },
  { file: 'privacy policy.docx', name: 'PrivacyPolicy', title: 'Privacy Policy' },
  { file: 'refund policy.docx', name: 'RefundPolicy', title: 'Refund and Cancellation Policy' },
  { file: 'terms of service.docx', name: 'TermsOfService', title: 'Terms of Service' },
  { file: 'disclaimer.docx', name: 'Disclaimer', title: 'Disclaimer' }
];

async function generate() {
  for (const doc of docs) {
    const docPath = path.join(reqDir, doc.file);
    if (!fs.existsSync(docPath)) {
      console.log(`Skipping missing doc: ${doc.file}`);
      continue;
    }
    const result = await mammoth.convertToHtml({path: docPath});
    const htmlContent = result.value;
    generateComponent(doc.name, doc.title, htmlContent);
  }
}

function generateComponent(name, title, htmlContent) {
  // Escape backticks and dollar signs for template literal
  const escapedContent = htmlContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');

  const jsxCode = `import React from 'react';
import { motion } from 'framer-motion';

const ${name} = () => {
  const content = \`${escapedContent}\`;

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
          <div 
            className="prose prose-invert max-w-none text-gray-300 prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary-light prose-strong:text-white prose-ul:my-4 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ${name};
`;

  fs.writeFileSync(path.join(outDir, `${name}.jsx`), jsxCode);
  console.log(`Generated HTML Component: ${name}.jsx`);
}

generate().catch(console.error);
