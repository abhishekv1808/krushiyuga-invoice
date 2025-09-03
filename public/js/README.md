# JavaScript Files Documentation

This document outlines the separation of inline JavaScript code from EJS templates into dedicated JavaScript files.

## Files Created

### 1. `/public/js/navbar.js`
**Purpose**: Mobile navigation menu functionality
**Functions**:
- Mobile menu toggle for responsive navigation
- Event listener for mobile menu button clicks

**Used in**: All pages (via navbar.ejs partial)

### 2. `/public/js/create-invoice.js`
**Purpose**: Invoice creation page functionality
**Functions**:
- `initializeProducts(productsData)` - Initialize products array from server data
- `addItem()` - Add new item row to invoice
- `removeItem(index)` - Remove item row from invoice
- `updatePrice(index)` - Update unit price when product is selected
- `calculateItemTotal(index)` - Calculate total for individual item
- `calculateTotals()` - Calculate subtotal, GST, and total amount

**Used in**: `/admin/invoices/create` page

### 3. `/public/js/products.js`
**Purpose**: Product management functionality
**Functions**:
- `openAddProductModal()` - Open modal for adding new product
- `editProduct(id, name, description, price, category, unit)` - Open modal for editing product
- `closeProductModal()` - Close product modal
- Modal outside-click event listener

**Used in**: `/admin/products` page

### 4. `/public/js/invoices.js`
**Purpose**: Invoice list management functionality
**Functions**:
- `updateInvoiceStatus(invoiceId, newStatus)` - Update invoice status via API call

**Used in**: `/admin/invoices` page

## Benefits of Separation

1. **Better Organization**: JavaScript logic is separated from HTML templates
2. **Caching**: Browser can cache JavaScript files separately
3. **Maintainability**: Easier to debug and modify JavaScript code
4. **Reusability**: JavaScript functions can be potentially reused across pages
5. **Performance**: Reduced inline script parsing on each page load
6. **Development**: Better IDE support for JavaScript editing

## Implementation Notes

- All files are loaded from `/js/` path (served from `public/js/` directory)
- Server data (like products array) is still passed from EJS to JavaScript using a small initialization script
- Function names remain the same to maintain compatibility with existing HTML onclick handlers
- Error handling and console logging preserved from original implementations
