import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import HTMLtoDOCX from 'html-to-docx';
import https from 'https';

function fetchImageBase64(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch image, status: ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(`data:image/png;base64,${buffer.toString('base64')}`);
      });
    }).on('error', reject);
  });
}

(async () => {
  try {
    console.log("Reading Markdown file...");
    const mdPath = './Research Paper/Lets_Explore_Final_Research_Paper.md';
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    
    // Convert Markdown to simple HTML
    let htmlContent = marked.parse(mdContent);
    
    // Process local images
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
    let match;
    let newHtmlContent = htmlContent;
    
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const imgTag = match[0];
      const src = match[1];
      
      if (src.startsWith('../')) {
        const absolutePath = path.resolve(path.dirname(mdPath), src);
        if (fs.existsSync(absolutePath)) {
            const ext = path.extname(absolutePath).substring(1) || 'jpeg';
            const buffer = fs.readFileSync(absolutePath);
            const base64 = buffer.toString('base64');
            const dataUri = `data:image/${ext};base64,${base64}`;
            
            // Use standard HTML image attributes for better DOCX conversion
            const newImgTag = `<img src="${dataUri}" width="500" height="auto" alt="Project Image" />`;
            newHtmlContent = newHtmlContent.replace(imgTag, newImgTag);
        }
      }
    }
    
    // Process Mermaid Diagrams
    const mermaidRegex = /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g;
    let mermaidMatch;
    while ((mermaidMatch = mermaidRegex.exec(htmlContent)) !== null) {
        const codeBlock = mermaidMatch[0];
        const code = mermaidMatch[1];
        const encoded = Buffer.from(code).toString('base64');
        const url = `https://mermaid.ink/img/${encoded}`;
        
        try {
            const base64Img = await fetchImageBase64(url);
            const imgTag = `<img src="${base64Img}" width="500" height="auto" alt="Architecture Diagram" />`;
            newHtmlContent = newHtmlContent.replace(codeBlock, imgTag);
        } catch (e) {
            newHtmlContent = newHtmlContent.replace(codeBlock, `<p><b>[Diagram: ${code.split('\n')[0]}...]</b></p>`);
        }
    }
    
    // wrap with clean body for docx
    const finalHtml = `<!DOCTYPE html><html><body>${newHtmlContent}</body></html>`;

    console.log("Compiling DOCX...");
    const docxBuf = await HTMLtoDOCX(finalHtml, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });
    
    // Save as a fresh filename
    const outPath = './Research Paper/Lets_Explore_Final_Word_Document.docx';
    fs.writeFileSync(outPath, docxBuf);
    console.log('SUCCESS: Created at', outPath);
  } catch(e) {
    console.error("ERROR:", e);
  }
})();
