const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Dashboard
router.get('/', adminController.getDashboard);
router.get('/dashboard', adminController.getDashboard);

// Products Routes
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.post('/products/:id/update', adminController.updateProduct);
router.post('/products/:id/delete', adminController.deleteProduct);

// API route for getting product details
router.get('/api/products/:id', adminController.getProductById);

// API route for getting all products
router.get('/api/products', adminController.getProductsAPI);

// Invoices Routes
router.get('/invoices', adminController.getInvoices);
router.get('/invoices/create', adminController.getCreateInvoice);
router.post('/invoices', adminController.createInvoice);
router.get('/invoices/:id', adminController.getInvoiceDetails);
router.post('/invoices/:id/status', adminController.updateInvoiceStatus);
router.post('/invoices/:id/delete', adminController.deleteInvoice);

// PDF Generation
router.get('/invoices/:id/pdf', adminController.generatePDF);

module.exports = router;