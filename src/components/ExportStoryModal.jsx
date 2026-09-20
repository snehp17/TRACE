import React, { useState } from 'react';
import { Download, FileText, Code2, Check, X, Sparkles, Printer } from 'lucide-react';
import { generateDossierMarkdown, downloadFile } from '../utils/exportNarrative';

export default function ExportStoryModal({
  isOpen,
  onClose,
  activeAdapter,
  chapters = [],
  relationshipData,
  totalRecords = 0
}) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const metadata = activeAdapter?.getMetadata ? activeAdapter.getMetadata() : { name: 'TRACE Archive' };
  const connections = relationshipData?.connections || [];

  const handleExportMarkdown = () => {
    const md = generateDossierMarkdown({
      archiveName: metadata.name,
      chapters,
      connections,
      totalRecords
    });
    downloadFile(`TRACE_Exhibition_Dossier_${activeAdapter?.id || 'archive'}.md`, md, 'text/markdown;charset=utf-8;');
  };

  const handleExportJson = () => {
    const data = {
      archive: metadata.name,
      exportedAt: new Date().toISOString(),
      totalRecords,
      chapters,
      relationshipsSample: connections.slice(0, 50)
    };
    downloadFile(`TRACE_Exhibition_Data_${activeAdapter?.id || 'archive'}.json`, JSON.stringify(data, null, 2), 'application/json');
  };

  const handleCopyMarkdown = () => {
    const md = generateDossierMarkdown({
      archiveName: metadata.name,
      chapters,
      connections,
      totalRecords
    });
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 bg-archive-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-archive-900 border border-amber-accent/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-slide-up text-left">
        
        <div className="flex items-center justify-between border-b border-archive-700/60 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-accent/15 text-amber-accent border border-amber-accent/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 id="export-modal-title" className="font-editorial text-lg text-paper font-semibold">
                Export Museum Exhibition Dossier
              </h3>
              <p className="text-[11px] font-mono text-archive-400">
                Download verified personal narratives and connection syntheses.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-archive-400 hover:text-white p-1 rounded-lg hover:bg-archive-800 transition-colors"
            aria-label="Close Export Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-archive-850 hover:bg-archive-800 border border-archive-700/60 hover:border-amber-accent/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-accent/10 text-amber-accent group-hover:bg-amber-accent/20">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-paper text-xs font-mono">
                  Download Markdown Dossier (.md)
                </div>
                <div className="text-[11px] text-archive-400 font-sans">
                  Complete human-readable museum exhibition catalog with observed facts.
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-archive-400 group-hover:text-amber-accent transition-colors" />
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-archive-850 hover:bg-archive-800 border border-archive-700/60 hover:border-sage-accent/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-sage-accent/10 text-sage-accent group-hover:bg-sage-accent/20">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-paper text-xs font-mono">
                  Export Structured Schema JSON (.json)
                </div>
                <div className="text-[11px] text-archive-400 font-sans">
                  Structured evidence nodes, confidence metrics, and chapter schemas.
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-archive-400 group-hover:text-sage-accent transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-archive-850 hover:bg-archive-800 border border-archive-700/60 hover:border-lavender-accent/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-lavender-accent/10 text-lavender-accent group-hover:bg-lavender-accent/20">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-paper text-xs font-mono">
                  Print Exhibition Sheet / Save as PDF
                </div>
                <div className="text-[11px] text-archive-400 font-sans">
                  Formats the current museum view for archival printing or PDF export.
                </div>
              </div>
            </div>
            <Printer className="w-4 h-4 text-archive-400 group-hover:text-lavender-accent transition-colors" />
          </button>
        </div>

        {/* Quick Clipboard Copy */}
        <div className="pt-2 border-t border-archive-700/50 flex items-center justify-between text-xs font-mono">
          <span className="text-archive-400">Want raw text?</span>
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-1.5 text-amber-accent hover:text-amber-light font-semibold cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <span>Copy Markdown to Clipboard</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
