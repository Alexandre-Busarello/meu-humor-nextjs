import { jsPDF } from 'jspdf';
import { HealthRecord } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { timestampToDate } from './timezone';

/**
 * Export health record to PDF with markdown support
 */
export function exportHealthRecordToPDF(record: HealthRecord): void {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper to add new page if needed
    const checkNewPage = (neededSpace: number = 10) => {
      if (yPosition + neededSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper to render text with bold markdown support
    const renderTextWithMarkdown = (text: string, x: number, y: number, maxWidth: number) => {
      // Check if there's any markdown
      const hasBold = /\*\*[^*]+\*\*/g.test(text);
      
      if (!hasBold) {
        // No markdown, use regular text wrapping
        pdf.setFont('helvetica', 'normal');
        const lines = pdf.splitTextToSize(text, maxWidth);
        for (let i = 0; i < lines.length; i++) {
          checkNewPage(7);
          pdf.text(lines[i], x, y);
          if (i < lines.length - 1) {
            y += 5.5; // Line spacing within paragraph
          }
        }
        return y;
      }

      // Split text by bold markers and process with wrapping
      const boldPattern = /\*\*([^*]+)\*\*/g;
      const parts: Array<{ text: string; bold: boolean }> = [];
      let lastIndex = 0;
      let match;

      // Reset regex
      boldPattern.lastIndex = 0;
      
      while ((match = boldPattern.exec(text)) !== null) {
        // Add text before the bold part
        if (match.index > lastIndex) {
          parts.push({
            text: text.substring(lastIndex, match.index),
            bold: false
          });
        }
        // Add the bold part
        parts.push({
          text: match[1],
          bold: true
        });
        lastIndex = boldPattern.lastIndex;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push({
          text: text.substring(lastIndex),
          bold: false
        });
      }

      // Render parts with proper line wrapping
      let currentX = x;
      let currentLine = '';
      let currentLineSegments: Array<{ text: string; bold: boolean }> = [];

      for (const part of parts) {
        const words = part.text.split(/(\s+)/); // Split but keep whitespace
        
        for (const word of words) {
          if (word === '') continue;
          
          // Set font to measure width
          pdf.setFont('helvetica', part.bold ? 'bold' : 'normal');
          const wordWidth = pdf.getTextWidth(word);
          const currentWidth = currentX - x;
          
          // Check if adding this word would exceed max width
          if (currentWidth + wordWidth > maxWidth && currentLine !== '') {
            // Render current line
            let renderX = x;
            for (const seg of currentLineSegments) {
              pdf.setFont('helvetica', seg.bold ? 'bold' : 'normal');
              pdf.text(seg.text, renderX, y);
              renderX += pdf.getTextWidth(seg.text);
            }
            
            // Move to next line
            y += 5.5; // Consistent line spacing
            checkNewPage(7);
            currentX = x;
            currentLine = '';
            currentLineSegments = [];
          }
          
          // Add word to current line
          currentLine += word;
          currentLineSegments.push({ text: word, bold: part.bold });
          currentX += wordWidth;
        }
      }

      // Render remaining line
      if (currentLine !== '') {
        let renderX = x;
        for (const seg of currentLineSegments) {
          pdf.setFont('helvetica', seg.bold ? 'bold' : 'normal');
          pdf.text(seg.text, renderX, y);
          renderX += pdf.getTextWidth(seg.text);
        }
      }

      return y;
    };

    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(12, 142, 231); // primary-500
    pdf.text('Prontuário de Saúde Mental', margin, yPosition);
    yPosition += 8;

    // Underline
    pdf.setDrawColor(12, 142, 231);
    pdf.setLineWidth(0.8);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Date
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(107, 114, 128); // neutral-500
    const recordDate = format(timestampToDate(record.timestamp), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    pdf.text(`Gerado em: ${recordDate}`, margin, yPosition);
    yPosition += 15;

    // Process content - parse simple markdown
    pdf.setTextColor(0, 0, 0);
    const lines = record.content.split('\n');
    
    for (const line of lines) {
      checkNewPage(10);
      
      // Empty line
      if (line.trim() === '') {
        yPosition += 5;
        continue;
      }
      
      // H1 Headers (# )
      if (line.startsWith('# ')) {
        yPosition += 4; // Space before header
        checkNewPage(15);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(30, 41, 59); // neutral-800
        const text = line.substring(2).trim();
        pdf.text(text, margin, yPosition);
        yPosition += 12; // Space after header
        continue;
      }
      
      // H2 Headers (## )
      if (line.startsWith('## ')) {
        yPosition += 3; // Space before header
        checkNewPage(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(15);
        pdf.setTextColor(51, 65, 85); // neutral-700
        const text = line.substring(3).trim();
        pdf.text(text, margin, yPosition);
        yPosition += 9; // Space after header
        continue;
      }
      
      // H3 Headers (### )
      if (line.startsWith('### ')) {
        yPosition += 2; // Space before header
        checkNewPage(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(71, 85, 105); // neutral-600
        const text = line.substring(4).trim();
        pdf.text(text, margin, yPosition);
        yPosition += 7; // Space after header
        continue;
      }
      
      // Bullet points (- or *)
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        checkNewPage(8);
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const text = line.trim().substring(2);
        
        // Add bullet with better positioning
        pdf.setFillColor(50, 50, 50);
        pdf.circle(margin + 2, yPosition - 1.5, 0.7, 'F');
        
        // Render text with markdown support
        yPosition = renderTextWithMarkdown(text, margin + 6, yPosition, maxWidth - 6);
        yPosition += 6; // Space after bullet item
        continue;
      }
      
      // Numbered lists (1. , 2. , etc.)
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numberedListMatch) {
        checkNewPage(8);
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const number = numberedListMatch[1];
        const text = numberedListMatch[2];
        
        // Add number
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${number}.`, margin, yPosition);
        
        // Render text with markdown support
        yPosition = renderTextWithMarkdown(text, margin + 10, yPosition, maxWidth - 10);
        yPosition += 6; // Space after list item
        continue;
      }
      
      // Regular paragraph with markdown support
      checkNewPage(8);
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      
      // Render text with markdown support
      yPosition = renderTextWithMarkdown(line, margin, yPosition, maxWidth);
      yPosition += 7; // Space after paragraph
    }

    // Footer on all pages
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(156, 163, 175); // neutral-400
      
      // Page number
      pdf.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      
      // Disclaimer
      pdf.setFontSize(8);
      pdf.text(
        'Este documento foi gerado automaticamente pelo aplicativo Meu Humor',
        pageWidth / 2,
        pageHeight - 6,
        { align: 'center' }
      );
    }

    // Save PDF
    const recordDateStr = format(timestampToDate(record.timestamp), 'yyyy-MM-dd');
    pdf.save(`prontuario-${recordDateStr}.pdf`);
  } catch (err) {
    console.error('Error exporting PDF:', err);
    throw new Error('Erro ao exportar PDF. Tente novamente.');
  }
}

