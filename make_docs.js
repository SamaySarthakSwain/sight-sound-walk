import fs from 'fs';
import { marked } from 'marked';
import HTMLtoDOCX from 'html-to-docx';

(async () => {
  console.log("Reading Markdown file...");
  const mdContent = fs.readFileSync('./Research Paper/Lets_Explore_Final_Research_Paper.md', 'utf8');
  
  console.log("Parsing to HTML...");
  let htmlContent = marked.parse(mdContent);
  // Strip out images and mermaid blocks which usually break html-to-docx
  htmlContent = htmlContent.replace(/<img[^>]*>/g, '[Image referenced here in Markdown version]');
  htmlContent = htmlContent.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, '[Mermaid Architecture Diagram referenced here]');
  
  console.log("Generating DOCX...");
  try {
    const docxBuf = await HTMLtoDOCX(htmlContent, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });
    fs.writeFileSync('./Research Paper/Lets_Explore_Final_Research_Paper.docx', docxBuf);
    console.log('DOCX created successfully.');
  } catch (e) {
    console.error('FAILED TO CREATE DOCX:', e);
    process.exit(1);
  }
})();
