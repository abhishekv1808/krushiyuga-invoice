const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const PDFGenerator = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');

// Dashboard
exports.getDashboard = async (req, res) => {
    try {
        const productsCount = await Product.countDocuments({ isActive: true });
        const invoicesCount = await Invoice.countDocuments();
        const recentInvoices = await Invoice.find()
            .populate('items.product')
            .sort({ createdAt: -1 })
            .limit(5);

        const totalRevenue = await Invoice.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            productsCount,
            invoicesCount,
            recentInvoices,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('admin/dashboard', {
            title: 'Admin Dashboard',
            error: 'Failed to load dashboard data'
        });
    }
};

// Products Management
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
        res.render('admin/products', {
            title: 'Manage Products',
            products
        });
    } catch (error) {
        console.error('Products error:', error);
        res.status(500).render('admin/products', {
            title: 'Manage Products',
            error: 'Failed to load products'
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, unit } = req.body;
        
        const product = new Product({
            name: name.trim(),
            description: description?.trim(),
            price: parseFloat(price),
            category: category?.trim(),
            unit: unit?.trim() || 'pcs'
        });

        await product.save();
        res.redirect('/admin/products?success=Product created successfully');
    } catch (error) {
        console.error('Create product error:', error);
        res.redirect('/admin/products?error=Failed to create product');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, unit } = req.body;

        await Product.findByIdAndUpdate(id, {
            name: name.trim(),
            description: description?.trim(),
            price: parseFloat(price),
            category: category?.trim(),
            unit: unit?.trim() || 'pcs'
        });

        res.redirect('/admin/products?success=Product updated successfully');
    } catch (error) {
        console.error('Update product error:', error);
        res.redirect('/admin/products?error=Failed to update product');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndUpdate(id, { isActive: false });
        res.redirect('/admin/products?success=Product deleted successfully');
    } catch (error) {
        console.error('Delete product error:', error);
        res.redirect('/admin/products?error=Failed to delete product');
    }
};

// Invoices Management
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('items.product')
            .sort({ createdAt: -1 });
        
        res.render('admin/invoices', {
            title: 'Manage Invoices',
            invoices
        });
    } catch (error) {
        console.error('Invoices error:', error);
        res.status(500).render('admin/invoices', {
            title: 'Manage Invoices',
            error: 'Failed to load invoices'
        });
    }
};

exports.getCreateInvoice = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ name: 1 });
        res.render('admin/create-invoice', {
            title: 'Create Invoice',
            products
        });
    } catch (error) {
        console.error('Create invoice page error:', error);
        res.status(500).render('admin/create-invoice', {
            title: 'Create Invoice',
            error: 'Failed to load products',
            products: []
        });
    }
};

exports.createInvoice = async (req, res) => {
    try {
        const {
            clientName,
            clientEmail,
            clientPhone,
            clientStreet,
            clientCity,
            clientState,
            clientPincode,
            items,
            gstRate,
            notes
        } = req.body;

        // Parse items and calculate totals
        const invoiceItems = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            const quantity = parseInt(item.quantity);
            const unitPrice = parseFloat(product.price);
            const totalPrice = quantity * unitPrice;

            invoiceItems.push({
                product: product._id,
                quantity,
                unitPrice,
                totalPrice
            });

            subtotal += totalPrice;
        }

        const gst = parseFloat(gstRate) || 18;
        const gstAmount = (subtotal * gst) / 100;
        const totalAmount = subtotal + gstAmount;

        const invoice = new Invoice({
            clientName: clientName.trim(),
            clientEmail: clientEmail.trim(),
            clientPhone: clientPhone?.trim(),
            clientAddress: {
                street: clientStreet?.trim(),
                city: clientCity?.trim(),
                state: clientState?.trim(),
                pincode: clientPincode?.trim()
            },
            items: invoiceItems,
            subtotal: Math.round(subtotal * 100) / 100,
            gstRate: gst,
            gstAmount: Math.round(gstAmount * 100) / 100,
            totalAmount: Math.round(totalAmount * 100) / 100,
            notes: notes?.trim()
        });

        await invoice.save();
        res.redirect('/admin/invoices?success=Invoice created successfully');
    } catch (error) {
        console.error('Create invoice error:', error);
        res.redirect('/admin/create-invoice?error=Failed to create invoice');
    }
};

exports.getInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id).populate('items.product');
        
        if (!invoice) {
            return res.status(404).render('admin/invoice-details', {
                title: 'Invoice Not Found',
                error: 'Invoice not found'
            });
        }

        res.render('admin/invoice-details', {
            title: `Invoice ${invoice.invoiceNumber}`,
            invoice
        });
    } catch (error) {
        console.error('Invoice details error:', error);
        res.status(500).render('admin/invoice-details', {
            title: 'Invoice Details',
            error: 'Failed to load invoice details'
        });
    }
};

exports.generatePDF = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id).populate('items.product');
        
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        const outputDir = path.join(__dirname, '../public/invoices');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filename = `invoice-${invoice.invoiceNumber}.pdf`;
        const outputPath = path.join(outputDir, filename);

        await PDFGenerator.generateInvoicePDF(invoice, outputPath);

        res.download(outputPath, filename, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ error: 'Failed to download PDF' });
            }
        });
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};

exports.updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await Invoice.findByIdAndUpdate(id, { status });
        res.redirect(`/admin/invoices?success=Invoice status updated to ${status}`);
    } catch (error) {
        console.error('Update invoice status error:', error);
        res.redirect('/admin/invoices?error=Failed to update invoice status');
    }
};

// API endpoints for AJAX requests
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Get product by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

// API endpoint to get all products
exports.getProductsAPI = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ name: 1 });
        console.log('API: Products found:', products.length);
        res.json({ products });
    } catch (error) {
        console.error('Get products API error:', error);
        res.status(500).json({ error: 'Failed to fetch products', products: [] });
    }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if invoice exists
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        
        // Delete associated PDF file if it exists
        const pdfPath = path.join(process.cwd(), 'generated-pdfs', `invoice-${invoice.invoiceNumber}.pdf`);
        if (fs.existsSync(pdfPath)) {
            try {
                fs.unlinkSync(pdfPath);
                console.log(`PDF file deleted: ${pdfPath}`);
            } catch (pdfError) {
                console.log('Could not delete PDF file:', pdfError.message);
                // Continue with invoice deletion even if PDF deletion fails
            }
        }
        
        // Delete the invoice
        await Invoice.findByIdAndDelete(id);
        
        console.log(`Invoice ${invoice.invoiceNumber} deleted successfully`);
        res.json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Delete invoice error:', error);
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
};