const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
    static async generateInvoicePDF(invoice, outputPath) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ 
                    margin: 40,
                    size: 'A4'
                });
                const stream = fs.createWriteStream(outputPath);
                doc.pipe(stream);

                // Colors (matching Amazon style)
                const headerColor = '#1f2937';    // Dark gray
                const textColor = '#374151';      // Medium gray
                const borderColor = '#d1d5db';    // Light gray border
                const highlightColor = '#f9fafb'; // Very light gray

                // Helper function to draw borders
                const drawLine = (x1, y1, x2, y2) => {
                    doc.moveTo(x1, y1).lineTo(x2, y2).stroke(borderColor);
                };

                // Header Section - TAX INVOICE
                doc.fillColor(headerColor)
                   .fontSize(16)
                   .font('Helvetica-Bold')
                   .text('TAX INVOICE', 50, 50);

                // Original for Recipient
                doc.fontSize(10)
                   .font('Helvetica')
                   .text('ORIGINAL FOR RECIPIENT', 420, 40);

                // Add Logo - debug version with text fallback
                const logoPngPath = path.join(process.cwd(), 'public', 'images', 'krushiyuga-logo.png');
                
                console.log('=== LOGO DEBUG ===');
                console.log('Attempting to load logo from:', logoPngPath);
                console.log('File exists:', fs.existsSync(logoPngPath));
                
                let logoLoaded = false;
                
                if (fs.existsSync(logoPngPath)) {
                    try {
                        console.log('PNG logo found, loading...');
                        // Try loading with increased size
                        doc.image(logoPngPath, 360, 40, { fit: [200, 70] });
                        console.log('PNG logo loaded successfully with fit constraint');
                        logoLoaded = true;
                    } catch (logoError) {
                        console.log('PNG Logo loading failed:', logoError.message);
                        console.log('Error details:', logoError);
                    }
                }
                
                // Add text fallback if logo fails
                if (!logoLoaded) {
                    console.log('Adding text fallback for logo');
                    doc.fontSize(16)
                       .font('Helvetica-Bold')
                       .fillColor('#1f2937')
                       .text('KRUSHIYUGA', 400, 80);
                }
                
                console.log('=== END LOGO DEBUG ===');

                // Company Details (Left Side)
                doc.fillColor(textColor)
                   .fontSize(12)
                   .font('Helvetica-Bold')
                   .text('Krushiyuga', 50, 90);

                doc.fontSize(9)
                   .font('Helvetica')
                   .text('GSTIN 22AAAAA0000A1Z5', 50, 105)
                   .text('Agricultural Solutions & Services', 50, 120)
                   .text('No. 39 & 1479, DRLS Plaza Union Bank Building', 50, 135)
                   .text('Tumkur Road, Vidya Nagar, T. Dasarahalli, Bengaluru 560057', 50, 150)
                   .text('Mobile : 9876543210  Email : info@krushiyuga.com', 50, 165);

                // Invoice Details Section
                const invoiceDetailsY = 190;
                doc.fontSize(10)
                   .font('Helvetica-Bold')
                   .text('Invoice #: ' + invoice.invoiceNumber, 50, invoiceDetailsY)
                   .text('Invoice Date: ' + new Date(invoice.createdAt).toLocaleDateString('en-GB'), 200, invoiceDetailsY);

                // Customer and Address Details
                const detailsY = 220;
                doc.fontSize(10)
                   .font('Helvetica-Bold')
                   .text('Customer Details:', 50, detailsY)
                   .text('Billing address:', 200, detailsY)
                   .text('Shipping address:', 350, detailsY);

                doc.fontSize(9)
                   .font('Helvetica-Bold')
                   .text(invoice.clientName, 50, detailsY + 20);

                doc.font('Helvetica')
                   .text(invoice.clientEmail, 50, detailsY + 35);

                if (invoice.clientPhone) {
                    doc.text(invoice.clientPhone, 50, detailsY + 50);
                }

                // Billing Address
                if (invoice.clientAddress) {
                    const address = `${invoice.clientAddress.street || ''}, ${invoice.clientAddress.city || ''}, ${invoice.clientAddress.state || ''} ${invoice.clientAddress.pincode || ''}`;
                    if (address.trim() !== ', ') {
                        doc.text(address, 200, detailsY + 20, { width: 140 });
                        doc.text(address, 350, detailsY + 20, { width: 140 }); // Same for shipping
                    }
                }

                // Place of Supply
                doc.fontSize(10)
                   .font('Helvetica-Bold')
                   .text('Place of Supply: KARNATAKA', 50, detailsY + 80);

                // Items Table - ADJUSTED COLUMN WIDTHS
                const tableTop = 320;
                const tableLeft = 50;
                const tableWidth = 500;
                
                // Column positions (adjusted widths)
                const col1 = tableLeft + 5;      // # column (20px wide)
                const col2 = tableLeft + 25;     // Item column (180px wide - reduced from 245)
                const col3 = tableLeft + 205;    // Rate/Item column (60px wide)
                const col4 = tableLeft + 265;    // Qty column (40px wide)
                const col5 = tableLeft + 305;    // Taxable Value column (70px wide)
                const col6 = tableLeft + 375;    // Tax Amount column (70px wide)
                const col7 = tableLeft + 445;    // Amount column (55px wide)
                
                // Table Header
                doc.rect(tableLeft, tableTop, tableWidth, 25).fill(highlightColor);
                drawLine(tableLeft, tableTop, tableLeft + tableWidth, tableTop);
                drawLine(tableLeft, tableTop + 25, tableLeft + tableWidth, tableTop + 25);

                doc.fillColor(textColor)
                   .fontSize(9)
                   .font('Helvetica-Bold')
                   .text('#', col1, tableTop + 8)
                   .text('Item', col2, tableTop + 8)
                   .text('Rate/Item', col3, tableTop + 8)
                   .text('Qty', col4, tableTop + 8)
                   .text('Taxable Value', col5, tableTop + 8)
                   .text('Tax Amount', col6, tableTop + 8)
                   .text('Amount', col7, tableTop + 8);

                // Vertical lines for table header
                drawLine(tableLeft, tableTop, tableLeft, tableTop + 25);
                drawLine(tableLeft + 20, tableTop, tableLeft + 20, tableTop + 25);
                drawLine(tableLeft + 200, tableTop, tableLeft + 200, tableTop + 25);
                drawLine(tableLeft + 260, tableTop, tableLeft + 260, tableTop + 25);
                drawLine(tableLeft + 300, tableTop, tableLeft + 300, tableTop + 25);
                drawLine(tableLeft + 370, tableTop, tableLeft + 370, tableTop + 25);
                drawLine(tableLeft + 440, tableTop, tableLeft + 440, tableTop + 25);
                drawLine(tableLeft + tableWidth, tableTop, tableLeft + tableWidth, tableTop + 25);

                // Table Items
                let currentY = tableTop + 25;
                const itemHeight = 45; // Reduced height for more compact rows

                invoice.items.forEach((item, index) => {
                    const itemY = currentY;
                    
                    // Draw horizontal line
                    drawLine(tableLeft, itemY + itemHeight, tableLeft + tableWidth, itemY + itemHeight);
                    
                    // Draw vertical lines
                    drawLine(tableLeft, itemY, tableLeft, itemY + itemHeight);
                    drawLine(tableLeft + 20, itemY, tableLeft + 20, itemY + itemHeight);
                    drawLine(tableLeft + 200, itemY, tableLeft + 200, itemY + itemHeight);
                    drawLine(tableLeft + 260, itemY, tableLeft + 260, itemY + itemHeight);
                    drawLine(tableLeft + 300, itemY, tableLeft + 300, itemY + itemHeight);
                    drawLine(tableLeft + 370, itemY, tableLeft + 370, itemY + itemHeight);
                    drawLine(tableLeft + 440, itemY, tableLeft + 440, itemY + itemHeight);
                    drawLine(tableLeft + tableWidth, itemY, tableLeft + tableWidth, itemY + itemHeight);

                    // Calculate tax values properly
                    const taxableAmount = item.totalPrice / (1 + invoice.gstRate / 100);
                    const taxAmount = item.totalPrice - taxableAmount;

                    doc.fillColor(textColor)
                       .fontSize(9)
                       .font('Helvetica')
                       .text((index + 1).toString(), col1, itemY + 8)
                       .text(item.product.name, col2, itemY + 8, { width: 170 });

                    // Product description (if available)
                    if (item.product.description) {
                        doc.fontSize(8)
                           .fillColor('#6b7280')
                           .text(item.product.description, col2, itemY + 25, { width: 170 });
                    }

                    // Format numbers properly - avoid the leading "1" digit issue
                    doc.fillColor(textColor)
                       .fontSize(9)
                       .font('Helvetica')
                       .text(item.unitPrice.toFixed(2), col3, itemY + 8)
                       .text(item.quantity.toString(), col4, itemY + 8)
                       .text(taxableAmount.toFixed(2), col5, itemY + 8)
                       .text(taxAmount.toFixed(2) + ' (' + invoice.gstRate.toString() + '%)', col6, itemY + 8)
                       .text(item.totalPrice.toFixed(2), col7, itemY + 8);

                    currentY += itemHeight;
                });

                // Totals Section
                const totalsY = currentY + 20;
                
                doc.fontSize(10)
                   .font('Helvetica')
                   .text('Total Items / Qty : ' + invoice.items.length + ' / ' + invoice.items.reduce((sum, item) => sum + item.quantity, 0), tableLeft, totalsY);

                const taxableAmount = invoice.subtotal;
                const totalInWords = this.numberToWords(invoice.totalAmount);

                // Increased spacing for better visibility (changed from +20 to +35)
                doc.font('Helvetica-Bold')
                   .text('Total amount (in words): ', tableLeft, totalsY + 20);
                doc.font('Helvetica')
                   .text(totalInWords + ' Only.', tableLeft, totalsY + 35, { width: 250});

                // Right side totals with table-like structure
                const totalsTableX = 320;
                const totalsTableWidth = 230;
                const totalsRowHeight = 25;
                
                // Totals table background
                doc.rect(totalsTableX, totalsY, totalsTableWidth, totalsRowHeight * 4)
                   .stroke(borderColor);

                // Taxable Amount row
                drawLine(totalsTableX, totalsY, totalsTableX + totalsTableWidth, totalsY);
                drawLine(totalsTableX, totalsY + totalsRowHeight, totalsTableX + totalsTableWidth, totalsY + totalsRowHeight);
                drawLine(totalsTableX, totalsY, totalsTableX, totalsY + totalsRowHeight);
                drawLine(totalsTableX + 120, totalsY, totalsTableX + 120, totalsY + totalsRowHeight);
                drawLine(totalsTableX + totalsTableWidth, totalsY, totalsTableX + totalsTableWidth, totalsY + totalsRowHeight);

                doc.fontSize(10)
                   .font('Helvetica')
                   .text('Taxable Amount', totalsTableX + 10, totalsY + 8)
                   .text('Rs. ' + taxableAmount.toFixed(2), totalsTableX + 130, totalsY + 8, { align: 'right', width: 90 });

                // IGST row
                drawLine(totalsTableX, totalsY + totalsRowHeight, totalsTableX + totalsTableWidth, totalsY + totalsRowHeight);
                drawLine(totalsTableX, totalsY + totalsRowHeight * 2, totalsTableX + totalsTableWidth, totalsY + totalsRowHeight * 2);
                drawLine(totalsTableX, totalsY + totalsRowHeight, totalsTableX, totalsY + totalsRowHeight * 2);
                drawLine(totalsTableX + 120, totalsY + totalsRowHeight, totalsTableX + 120, totalsY + totalsRowHeight * 2);
                drawLine(totalsTableX + totalsTableWidth, totalsY + totalsRowHeight, totalsTableX + totalsTableWidth, totalsY + totalsRowHeight * 2);

                doc.text('IGST ' + invoice.gstRate.toString() + '%', totalsTableX + 10, totalsY + totalsRowHeight + 8)
                   .text('Rs. ' + invoice.gstAmount.toFixed(2), totalsTableX + 130, totalsY + totalsRowHeight + 8, { align: 'right', width: 90 });

                // Total row (highlighted)
                doc.rect(totalsTableX, totalsY + totalsRowHeight * 2, totalsTableWidth, totalsRowHeight)
                   .fillAndStroke(highlightColor, borderColor);
                drawLine(totalsTableX, totalsY + totalsRowHeight * 2, totalsTableX, totalsY + totalsRowHeight * 3);
                drawLine(totalsTableX + 120, totalsY + totalsRowHeight * 2, totalsTableX + 120, totalsY + totalsRowHeight * 3);
                drawLine(totalsTableX + totalsTableWidth, totalsY + totalsRowHeight * 2, totalsTableX + totalsTableWidth, totalsY + totalsRowHeight * 3);

                doc.fontSize(12)
                   .font('Helvetica-Bold')
                   .fillColor(textColor)
                   .text('Total', totalsTableX + 10, totalsY + totalsRowHeight * 2 + 8)
                   .text('Rs. ' + invoice.totalAmount.toFixed(2), totalsTableX + 130, totalsY + totalsRowHeight * 2 + 8, { align: 'right', width: 90 });

                // Amount Payable row
                drawLine(totalsTableX, totalsY + totalsRowHeight * 3, totalsTableX + totalsTableWidth, totalsY + totalsRowHeight * 3);
                drawLine(totalsTableX, totalsY + totalsRowHeight * 4, totalsTableX + totalsTableWidth, totalsY + totalsRowHeight * 4);
                drawLine(totalsTableX, totalsY + totalsRowHeight * 3, totalsTableX, totalsY + totalsRowHeight * 4);
                drawLine(totalsTableX + 120, totalsY + totalsRowHeight * 3, totalsTableX + 120, totalsY + totalsRowHeight * 4);
                drawLine(totalsTableX + totalsTableWidth, totalsY + totalsRowHeight * 3, totalsTableX + totalsTableWidth, totalsY + totalsRowHeight * 4);

                doc.fontSize(10)
                   .font('Helvetica')
                   .text('Amount Payable:', totalsTableX + 10, totalsY + totalsRowHeight * 3 + 8)
                   .text('Rs. ' + invoice.totalAmount.toFixed(2), totalsTableX + 130, totalsY + totalsRowHeight * 3 + 8, { align: 'right', width: 90 });

                // Payment Details Section
                const paymentY = totalsY + 110;
                doc.fontSize(10)
                   .font('Helvetica-Bold')
                   .text('Pay using UPI:', 50, paymentY)
                   .text('Bank Details:', 195, paymentY);

                // Add QR Code for UPI payment
                const qrPath = path.join(process.cwd(), 'public', 'images', 'QR-Code.png');
                if (fs.existsSync(qrPath)) {
                    try {
                        doc.image(qrPath, 50, paymentY + 20, { width: 80, height: 80 });
                    } catch (qrError) {
                        console.log('QR Code could not be loaded, continuing without QR');
                    }
                }

                doc.fontSize(9)
                   .font('Helvetica')
                   .text('Bank :', 195, paymentY + 20)
                   .text('BANK OF BARODA', 250, paymentY + 20)
                   .text('Account No :', 195, paymentY + 35)
                   .text('33760200000952', 250, paymentY + 35)
                   .text('IFSC :', 195, paymentY + 50)
                   .text('BARB0PEENYA (Fifth character is zero)', 250, paymentY + 50)
                   .text('Branch :', 195, paymentY + 65)
                   .text('PEENYA', 250, paymentY + 65);

                // Authorized Signatory
                doc.text('For Krushiyuga', 400, paymentY + 20)
                   .text('Authorized Signatory', 400, paymentY + 80);

                // Notes and Terms
                const notesY = paymentY + 120;
                doc.fontSize(9)
                   .font('Helvetica-Bold')
                   .text('Notes:', 50, notesY);

                if (invoice.notes) {
                    doc.font('Helvetica')
                       .text(invoice.notes, 50, notesY + 15, { width: 400 });
                } else {
                    doc.font('Helvetica')
                       .text('Thank you for the Business', 50, notesY + 15);
                }

                doc.font('Helvetica-Bold')
                   .text('Terms and Conditions:', 50, notesY + 40);

                doc.fontSize(8)
                   .font('Helvetica')
                   .text('1. Goods once sold cannot be taken back or exchanged.', 50, notesY + 55);

                doc.end();
                
                // Wait for the stream to finish writing
                stream.on('finish', () => {
                    console.log('PDF generation completed');
                    resolve(outputPath);
                });
                
                stream.on('error', (error) => {
                    console.error('PDF generation error:', error);
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // Helper function to convert number to words (simplified version)
    static numberToWords(num) {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

        if (num === 0) return 'Zero';

        const [rupees, paisa] = num.toFixed(2).split('.');
        let result = '';

        // Convert rupees part
        const rupeesNum = parseInt(rupees);
        if (rupeesNum > 0) {
            result += this.convertToWords(rupeesNum, ones, teens, tens, thousands) + ' Rupees';
        }

        // Convert paisa part
        const paisaNum = parseInt(paisa);
        if (paisaNum > 0) {
            if (result) result += ' and ';
            result += this.convertToWords(paisaNum, ones, teens, tens, thousands) + ' Paisa';
        }

        return result;
    }

    static convertToWords(num, ones, teens, tens, thousands) {
        if (num === 0) return '';

        let result = '';
        let place = 0;

        while (num > 0) {
            let chunk = num % 1000;
            if (place === 1) chunk = num % 100; // For Indian numbering system

            if (chunk !== 0) {
                let chunkWords = '';
                
                if (chunk >= 100) {
                    chunkWords += ones[Math.floor(chunk / 100)] + ' Hundred ';
                    chunk %= 100;
                }
                
                if (chunk >= 20) {
                    chunkWords += tens[Math.floor(chunk / 10)] + ' ';
                    chunk %= 10;
                } else if (chunk >= 10) {
                    chunkWords += teens[chunk - 10] + ' ';
                    chunk = 0;
                }
                
                if (chunk > 0) {
                    chunkWords += ones[chunk] + ' ';
                }

                result = chunkWords + thousands[place] + ' ' + result;
            }

            num = place === 0 ? Math.floor(num / 1000) : Math.floor(num / 100);
            place++;
        }

        return result.trim();
    }

    static calculateInvoiceTotals(items, gstRate = 18) {
        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const gstAmount = (subtotal * gstRate) / 100;
        const totalAmount = subtotal + gstAmount;

        return {
            subtotal: Math.round(subtotal * 100) / 100,
            gstAmount: Math.round(gstAmount * 100) / 100,
            totalAmount: Math.round(totalAmount * 100) / 100
        };
    }
}

module.exports = PDFGenerator;
