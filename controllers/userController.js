const Invoice = require('../models/Invoice');
const User = require('../models/User');

// User Home - View assigned invoices
exports.getHome = async (req, res) => {
    try {
        const { email } = req.query;
        let invoices = [];
        
        if (email) {
            invoices = await Invoice.find({ 
                clientEmail: email.toLowerCase().trim() 
            })
            .populate('items.product')
            .sort({ createdAt: -1 });
        }

        res.render('user/home', {
            title: 'My Invoices - Krushiyuga',
            invoices,
            searchEmail: email || ''
        });
    } catch (error) {
        console.error('User home error:', error);
        res.status(500).render('user/home', {
            title: 'My Invoices - Krushiyuga',
            error: 'Failed to load invoices',
            invoices: [],
            searchEmail: ''
        });
    }
};

// View specific invoice details
exports.getInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.query;
        
        const invoice = await Invoice.findById(id).populate('items.product');
        
        if (!invoice) {
            return res.status(404).render('user/invoice-details', {
                title: 'Invoice Not Found',
                error: 'Invoice not found'
            });
        }

        // Check if the email matches the invoice client email
        if (email && invoice.clientEmail.toLowerCase() !== email.toLowerCase()) {
            return res.status(403).render('user/invoice-details', {
                title: 'Access Denied',
                error: 'You are not authorized to view this invoice'
            });
        }

        res.render('user/invoice-details', {
            title: `Invoice ${invoice.invoiceNumber}`,
            invoice
        });
    } catch (error) {
        console.error('User invoice details error:', error);
        res.status(500).render('user/invoice-details', {
            title: 'Invoice Details',
            error: 'Failed to load invoice details'
        });
    }
};

// Search invoices by email
exports.searchInvoices = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.redirect('/user?error=Please enter an email address');
        }

        res.redirect(`/user?email=${encodeURIComponent(email.trim())}`);
    } catch (error) {
        console.error('Search invoices error:', error);
        res.redirect('/user?error=Failed to search invoices');
    }
};

// Get invoice summary (for quick view)
exports.getInvoiceSummary = async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.json({ error: 'Email is required' });
        }

        const invoices = await Invoice.find({ 
            clientEmail: email.toLowerCase().trim() 
        })
        .select('invoiceNumber totalAmount status createdAt')
        .sort({ createdAt: -1 })
        .limit(10);

        const summary = {
            totalInvoices: invoices.length,
            totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
            paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
            pendingInvoices: invoices.filter(inv => inv.status === 'sent').length,
            invoices: invoices
        };

        res.json(summary);
    } catch (error) {
        console.error('Invoice summary error:', error);
        res.status(500).json({ error: 'Failed to load invoice summary' });
    }
};