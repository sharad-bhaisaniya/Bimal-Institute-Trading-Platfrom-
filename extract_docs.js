const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const reqDir = path.join(__dirname, 'project requirements');
const tempDir = path.join(reqDir, 'temp_docs');

const policies = [
  'fee_policy',
  'grievance policy',
  'privacy policy',
  'refund policy',
  'terms of service',
  'disclaimer'
];

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

policies.forEach(policy => {
  const docxPath = path.join(reqDir, `${policy}.docx`);
  const zipPath = path.join(reqDir, `${policy}.zip`);
  const outDir = path.join(tempDir, policy);

  if (fs.existsSync(docxPath)) {
    console.log(`Processing ${policy}...`);
    // Copy docx to zip
    fs.copyFileSync(docxPath, zipPath);
    // Unzip
    try {
      execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${outDir}' -Force"`);
      const xmlPath = path.join(outDir, 'word', 'document.xml');
      if (fs.existsSync(xmlPath)) {
        const xmlContent = fs.readFileSync(xmlPath, 'utf8');
        // Extract text inside <w:t> tags
        const textMatches = xmlContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
        const plainText = textMatches.map(match => {
          return match.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '');
        }).join('');
        
        fs.writeFileSync(path.join(reqDir, `${policy}.md`), plainText);
        console.log(`Successfully extracted ${policy}.md`);
      }
    } catch (e) {
      console.error(`Error processing ${policy}:`, e.message);
    }
  }
});

console.log("Done");
