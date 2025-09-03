const PDFDocument = require('pdfkit');
const fs = require('fs');

console.log('Creating debug PDF...');

async function createDebugPDF() {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const outputPath = './public/invoices/debug-test.pdf';
        const stream = fs.createWriteStream(outputPath);
        
        doc.pipe(stream);

        // Simple test content
        doc.fillColor('#2563eb')
           .fontSize(24)
           .font('Helvetica-Bold')
           .text('KRUSHIYUGA TEST', 60, 65);

        doc.fillColor('#1e293b')
           .fontSize(12)
           .font('Helvetica')
           .text('This is a test PDF to debug the issue', 60, 100);

        doc.end();

        stream.on('finish', () => {
            console.log('✅ Debug PDF generation completed');
            const stats = fs.statSync(outputPath);
            console.log('✅ PDF file size:', stats.size, 'bytes');
            resolve(outputPath);
        });

        stream.on('error', (error) => {
            console.error('❌ PDF generation error:', error);
            reject(error);
        });
    });
}

createDebugPDF().then(() => {
    console.log('Debug test completed');
    process.exit(0);
}).catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
