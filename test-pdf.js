const mongoose = require('mongoose');
const Invoice = require('./models/Invoice');
const Product = require('./models/Product');
const PDFGenerator = require('./utils/pdfGenerator');
const path = require('path');
const fs = require('fs');

const mongoDBURL = 'mongodb+srv://abhishekv1808:' + encodeURIComponent('Grow@$@2025') + '@aribnb.xvmlcnz.mongodb.net/krushiyuga-invoice?retryWrites=true&w=majority&appName=aribnb';

async function testPDFGeneration() {
    try {
        await mongoose.connect(mongoDBURL);
        console.log('Connected to MongoDB');

        // Find an invoice
        const invoice = await Invoice.findOne().populate('items.product');
        
        if (!invoice) {
            console.log('No invoice found in database');
            process.exit(1);
        }

        console.log(`Found invoice: ${invoice.invoiceNumber} for ${invoice.clientName}`);

        // Create output directory
        const outputDir = path.join(__dirname, 'public/invoices');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Generate PDF
        const filename = `test-invoice-${invoice.invoiceNumber}.pdf`;
        const outputPath = path.join(outputDir, filename);

        console.log('Generating PDF...');
        await PDFGenerator.generateInvoicePDF(invoice, outputPath);
        
        console.log(`✅ PDF generated successfully: ${outputPath}`);
        
        // Check if file exists
        if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            console.log(`✅ PDF file size: ${stats.size} bytes`);
        } else {
            console.log('❌ PDF file was not created');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ PDF generation failed:', error);
        process.exit(1);
    }
}

testPDFGeneration();
