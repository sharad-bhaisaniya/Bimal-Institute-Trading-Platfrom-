const fs = require('fs');
const path = require('path');

const reqDir = path.join(__dirname, 'project requirements');
const outDir = path.join(__dirname, 'frontend', 'src', 'pages', 'public', 'policies');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const policies = [
  { file: 'fee_policy.md', name: 'FeePolicy', title: 'Fee Policy' },
  { file: 'grievance policy.md', name: 'GrievancePolicy', title: 'Grievance Redressal Policy' },
  { file: 'privacy policy.md', name: 'PrivacyPolicy', title: 'Privacy Policy' },
  { file: 'refund policy.md', name: 'RefundPolicy', title: 'Refund and Cancellation Policy' },
  { file: 'terms of service.md', name: 'TermsOfService', title: 'Terms of Service' },
  { file: 'disclaimer.md', name: 'Disclaimer', title: 'Disclaimer Policy' }
];

policies.forEach(p => {
  let content = '';
  try {
    content = fs.readFileSync(path.join(reqDir, p.file), 'utf8');
  } catch (e) {
    console.error(`Missing ${p.file}`);
  }
  
  // Escape backticks and dollar signs for template literal
  const escapedContent = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');

  const jsxCode = `import React from 'react';
import { motion } from 'framer-motion';

const ${p.name} = () => {
  const content = \`${escapedContent}\`;

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-surface border border-dark-border rounded-2xl p-8 md:p-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            ${p.title}
          </h1>
          <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
            {content}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ${p.name};
`;

  fs.writeFileSync(path.join(outDir, `${p.name}.jsx`), jsxCode);
  console.log(`Generated ${p.name}.jsx`);
});
