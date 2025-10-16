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
    
    // Track previous element type for smart spacing
    let prevElementType: 'header' | 'bullet' | 'numbered' | 'paragraph' | 'empty' | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = i < lines.length - 1 ? lines[i + 1] : null;
      
      checkNewPage(10);
      
      // Empty line
      if (line.trim() === '') {
        // Smart spacing based on context
        if (prevElementType === 'bullet' || prevElementType === 'numbered') {
          yPosition += 4; // Small gap within lists
        } else if (prevElementType === 'paragraph') {
          yPosition += 5; // Medium gap after paragraph
        } else {
          yPosition += 3; // Minimal gap
        }
        prevElementType = 'empty';
        continue;
      }
      
      // H1 Headers (# )
      if (line.startsWith('# ')) {
        // Smart spacing before header
        if (prevElementType && prevElementType !== 'empty') {
          yPosition += 6;
        } else {
          yPosition += 2;
        }
        checkNewPage(15);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(30, 41, 59); // neutral-800
        const text = line.substring(2).trim();
        pdf.text(text, margin, yPosition);
        yPosition += 10; // Space after header
        prevElementType = 'header';
        continue;
      }
      
      // H2 Headers (## )
      if (line.startsWith('## ')) {
        // Smart spacing before header
        if (prevElementType && prevElementType !== 'empty') {
          yPosition += 5;
        } else {
          yPosition += 2;
        }
        checkNewPage(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(15);
        pdf.setTextColor(51, 65, 85); // neutral-700
        const text = line.substring(3).trim();
        pdf.text(text, margin, yPosition);
        yPosition += 8; // Space after header
        prevElementType = 'header';
        continue;
      }
      
      // H3 Headers (### )
      if (line.startsWith('### ')) {
        // Smart spacing before header
        if (prevElementType && prevElementType !== 'empty') {
          yPosition += 4;
        } else {
          yPosition += 2;
        }
        checkNewPage(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(71, 85, 105); // neutral-600
        const text = line.substring(4).trim();
        pdf.text(text, margin, yPosition);
        yPosition += 7; // Space after header
        prevElementType = 'header';
        continue;
      }
      
      // Bullet points (- or *)
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        checkNewPage(10);
        
        // Smart spacing before first bullet or after paragraph
        if (prevElementType === 'paragraph' || prevElementType === 'header') {
          yPosition += 3;
        } else if (prevElementType === 'numbered') {
          yPosition += 5; // Extra space when switching from numbered to bullet
        } else if (prevElementType === 'bullet') {
          yPosition += 4; // Good spacing between bullets
        }
        
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const text = line.trim().substring(2);
        
        // Add bullet with better positioning
        pdf.setFillColor(50, 50, 50);
        pdf.circle(margin + 2, yPosition - 1.5, 0.7, 'F');
        
        // Render text with markdown support
        const textIndent = margin + 7;
        const startY = yPosition;
        yPosition = renderTextWithMarkdown(text, textIndent, yPosition, maxWidth - 7);
        
        // Add minimum spacing after text (ensure at least one line was added)
        const linesRendered = Math.max(1, Math.floor((yPosition - startY) / 5.5) + 1);
        yPosition = startY + (linesRendered * 5.5);
        
        // Check if next line is continuation (bullet or numbered)
        const isNextBullet = nextLine?.trim().startsWith('- ') || nextLine?.trim().startsWith('* ');
        const isNextNumbered = nextLine?.match(/^\d+\.\s+/);
        
        if (!isNextBullet && !isNextNumbered) {
          yPosition += 4; // Space after last bullet before different content
        }
        
        prevElementType = 'bullet';
        continue;
      }
      
      // Numbered lists (1. , 2. , etc.)
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numberedListMatch) {
        checkNewPage(10);
        
        // Smart spacing
        if (prevElementType === 'paragraph' || prevElementType === 'header') {
          yPosition += 3;
        } else if (prevElementType === 'bullet') {
          yPosition += 5; // Extra space when switching from bullet to numbered
        } else if (prevElementType === 'numbered') {
          yPosition += 4; // Good spacing between numbered items
        }
        
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const number = numberedListMatch[1];
        const text = numberedListMatch[2];
        
        // Add number with better alignment
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(60, 60, 60);
        pdf.text(`${number}.`, margin, yPosition);
        
        // Render text with markdown support
        pdf.setTextColor(0, 0, 0);
        const textIndent = margin + 11;
        const startY = yPosition;
        yPosition = renderTextWithMarkdown(text, textIndent, yPosition, maxWidth - 11);
        
        // Add minimum spacing after text (ensure at least one line was added)
        const linesRendered = Math.max(1, Math.floor((yPosition - startY) / 5.5) + 1);
        yPosition = startY + (linesRendered * 5.5);
        
        // Check if next line is continuation
        const isNextNumbered = nextLine?.match(/^\d+\.\s+/);
        const isNextBullet = nextLine?.trim().startsWith('- ') || nextLine?.trim().startsWith('* ');
        
        if (!isNextNumbered && !isNextBullet) {
          yPosition += 4; // Space after last numbered item before different content
        }
        
        prevElementType = 'numbered';
        continue;
      }
      
      // Regular paragraph with markdown support
      checkNewPage(10);
      
      // Smart spacing before paragraph
      if (prevElementType === 'bullet' || prevElementType === 'numbered') {
        yPosition += 5; // Extra space after list ends
      } else if (prevElementType === 'paragraph') {
        yPosition += 4; // Normal spacing between paragraphs
      } else if (prevElementType === 'header') {
        yPosition += 1; // Less space after header (already has space)
      }
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      
      // Render text with markdown support
      const startY = yPosition;
      yPosition = renderTextWithMarkdown(line, margin, yPosition, maxWidth);
      
      // Add minimum spacing after text
      const linesRendered = Math.max(1, Math.floor((yPosition - startY) / 5.5) + 1);
      yPosition = startY + (linesRendered * 5.5);
      
      prevElementType = 'paragraph';
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

