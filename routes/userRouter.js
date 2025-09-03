const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User home page - view invoices
router.get('/', userController.getHome);

// Search invoices
router.post('/search', userController.searchInvoices);

// View specific invoice
router.get('/invoices/:id', userController.getInvoiceDetails);

// API endpoints
router.get('/api/summary', userController.getInvoiceSummary);

module.exports = router;