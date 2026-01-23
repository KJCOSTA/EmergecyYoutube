// Documentation Export Utilities
// Handles PDF and Markdown exports for the Living Documentation module

export interface DocumentationTab {
  id: string;
  title: string;
  icon: string;
  content: string;
}

// Convert HTML content to clean Markdown
export function htmlToMarkdown(html: string, title: string): string {
  // Remove HTML tags and convert to markdown structure
  let markdown = `# ${title}\n\n`;
  markdown += `*Exportado em: ${new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}*\n\n---\n\n`;

  // Basic HTML to Markdown conversion
  const content = html
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    // Paragraphs and breaks
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    // Lists
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    // Bold and italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    // Code
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // Tables
    .replace(/<table[^>]*>/gi, '\n')
    .replace(/<\/table>/gi, '\n')
    .replace(/<thead[^>]*>/gi, '')
    .replace(/<\/thead>/gi, '')
    .replace(/<tbody[^>]*>/gi, '')
    .replace(/<\/tbody>/gi, '')
    .replace(/<tr[^>]*>/gi, '|')
    .replace(/<\/tr>/gi, '|\n')
    .replace(/<th[^>]*>(.*?)<\/th>/gi, ' $1 |')
    .replace(/<td[^>]*>(.*?)<\/td>/gi, ' $1 |')
    // Divs and spans
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1')
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();

  return markdown + content;
}

// Download file helper
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export single tab as Markdown
export function exportTabAsMarkdown(tab: DocumentationTab): void {
  const markdown = tab.content;
  const filename = `documentacao-${tab.id}-${new Date().toISOString().split('T')[0]}.md`;
  downloadFile(markdown, filename, 'text/markdown;charset=utf-8');
}

// Export all tabs as consolidated Markdown
export function exportAllTabsAsMarkdown(tabs: DocumentationTab[]): void {
  let consolidatedMarkdown = `# Documentação Viva do Sistema - ORION

*Sistema de Automação de Produção de Vídeos para YouTube*

**Exportado em:** ${new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}

---

## Índice

${tabs.map((tab, index) => `${index + 1}. [${tab.title}](#${tab.id})`).join('\n')}

---

`;

  tabs.forEach((tab, index) => {
    consolidatedMarkdown += `\n\n${'='.repeat(80)}\n`;
    consolidatedMarkdown += `# ${index + 1}. ${tab.title}\n`;
    consolidatedMarkdown += `${'='.repeat(80)}\n\n`;
    consolidatedMarkdown += tab.content;
    consolidatedMarkdown += '\n\n';
  });

  consolidatedMarkdown += `\n---\n\n*Documento gerado automaticamente pelo módulo de Documentação Viva do ORION*`;

  const filename = `documentacao-completa-orion-${new Date().toISOString().split('T')[0]}.md`;
  downloadFile(consolidatedMarkdown, filename, 'text/markdown;charset=utf-8');
}

// Generate PDF using browser print
export function exportTabAsPDF(tabId: string, tabTitle: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para exportar PDF');
    return;
  }

  const content = document.getElementById(`tab-content-${tabId}`);
  if (!content) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${tabTitle} - Documentação ORION</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }

        h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 24px;
          color: #111;
          border-bottom: 3px solid #6366f1;
          padding-bottom: 12px;
        }

        h2 {
          font-size: 22px;
          font-weight: 600;
          margin: 32px 0 16px 0;
          color: #222;
        }

        h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 24px 0 12px 0;
          color: #333;
        }

        h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 20px 0 10px 0;
          color: #444;
        }

        p {
          margin-bottom: 12px;
          color: #333;
        }

        ul, ol {
          margin: 12px 0 12px 24px;
        }

        li {
          margin-bottom: 6px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        th {
          background: #f5f5f5;
          font-weight: 600;
        }

        code {
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 14px;
        }

        pre {
          background: #1a1a1a;
          color: #f0f0f0;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .badge-green { background: #dcfce7; color: #166534; }
        .badge-yellow { background: #fef9c3; color: #854d0e; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-blue { background: #dbeafe; color: #1e40af; }

        .diagram {
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 20px;
          margin: 16px 0;
        }

        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          font-size: 12px;
          color: #666;
          text-align: center;
        }

        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${tabTitle}</h1>
      <p style="color: #666; font-size: 14px; margin-bottom: 24px;">
        ORION - Documentação Viva do Sistema<br>
        Exportado em: ${new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
      ${content.innerHTML}
      <div class="footer">
        Documento gerado pelo módulo de Documentação Viva - ORION
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 500);
}
