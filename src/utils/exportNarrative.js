/**
 * @fileoverview TRACE Narrative Exporter
 * Compiles life story chapters, discovered connections, and archive stats
 * into a portable Museum Exhibition Dossier (Markdown or JSON).
 */

/**
 * Compiles a formatted Markdown document representing the life archive dossier.
 * @param {Object} params
 * @param {string} params.archiveName
 * @param {Array} params.chapters
 * @param {Array} params.connections
 * @param {number} params.totalRecords
 * @returns {string} Markdown text
 */
export function generateDossierMarkdown({ archiveName, chapters = [], connections = [], totalRecords = 0 }) {
  const dateStr = new Date().toLocaleDateString('en-US', { dateStyle: 'full' });
  
  let md = `# 🏛️ TRACE Museum Exhibition Dossier\n`;
  md += `> *"Every moment leaves a trace."*\n\n`;
  md += `**Archive Collection**: ${archiveName}\n`;
  md += `**Compiled On**: ${dateStr}\n`;
  md += `**Total Verified Records**: ${totalRecords.toLocaleString()}\n`;
  md += `**Discovered Relationships**: ${connections.length}\n`;
  md += `**Curated Story Chapters**: ${chapters.length}\n\n`;
  md += `---\n\n`;

  md += `## 📖 Curated Narrative Chapters\n\n`;
  chapters.forEach((ch, idx) => {
    md += `### Chapter ${idx + 1}: ${ch.title}\n`;
    md += `* **Epoch**: ${ch.epoch}\n`;
    md += `* **Thematic Anchor**: ${ch.theme}\n\n`;
    md += `**Narrative Summary**:\n${ch.summary}\n\n`;

    if (ch.observedFacts && ch.observedFacts.length > 0) {
      md += `**Observed Dataset Facts**:\n`;
      ch.observedFacts.forEach(fact => {
        md += `- ${fact}\n`;
      });
      md += `\n`;
    }

    if (ch.cautiousInterpretation) {
      md += `**Cautious Analytical Interpretation**:\n> "${ch.cautiousInterpretation}"\n\n`;
    }
    md += `---\n\n`;
  });

  md += `## 🔗 Discovered Relationship Synapses (Sample Top 20)\n\n`;
  connections.slice(0, 20).forEach((c, idx) => {
    md += `${idx + 1}. **${c.type}** (Confidence: ${c.confidence}%)\n`;
    md += `   - *Interpretation*: ${c.interpretation}\n`;
    if (c.evidence && c.evidence.length > 0) {
      c.evidence.forEach(ev => {
        md += `   - *Fact*: ${ev}\n`;
      });
    }
  });

  md += `\n---\n*Exported natively from TRACE — Your Life, Connected (Zero-Backend Client-Side Museum).*`;
  return md;
}

/**
 * Triggers a client-side file download.
 * @param {string} filename
 * @param {string} content
 * @param {string} mimeType
 */
export function downloadFile(filename, content, mimeType = 'text/markdown;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
