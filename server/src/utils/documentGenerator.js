const { Document, Packer, Paragraph, TextRun } = require('docx');
const PDFDocument = require('pdfkit');
const stream = require('stream');

const buildDocumentText = ({ type, caseRecord }) => {
  const header = `GOVERNMENT OF INDIA - MINISTRY OF HOME AFFAIRS\n${type.toUpperCase()}\n`;
  const body = `CASE NUMBER: ${caseRecord.caseNumber}\nACCUSED: ${caseRecord.accused.name}\nVICTIM: ${caseRecord.victim.name}\nSECTIONS: ${caseRecord.legalSections.join(', ')}\n\nSTATEMENT:\n${caseRecord.statement}\n`;
  return `${header}\n${body}`;
};

const generatePDF = (type, caseRecord) => {
  const doc = new PDFDocument({ margin: 36 });
  const bufferChunks = [];
  doc.on('data', (chunk) => bufferChunks.push(chunk));
  doc.on('end', () => {});
  doc.fontSize(12).text(buildDocumentText({ type, caseRecord }), { lineGap: 4 });
  doc.end();
  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(bufferChunks)));
  });
};

const generateDOCX = async (type, caseRecord) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: type.toUpperCase(), bold: true, size: 28 })],
          }),
          new Paragraph({ text: '' }),
          ...buildDocumentText({ type, caseRecord }).split('\n').map((line) => new Paragraph({ text: line })),
        ],
      },
    ],
  });
  const buffer = await Packer.toBuffer(doc);
  return buffer;
};

module.exports = { generatePDF, generateDOCX };
