const mongoose = require('mongoose');
const Product = require('./models/Product');
const Invoice = require('./models/Invoice');

const mongoDBURL = 'mongodb+srv://abhishekv1808:' + encodeURIComponent('Grow@$@2025') + '@aribnb.xvmlcnz.mongodb.net/krushiyuga-invoice?retryWrites=true&w=majority&appName=aribnb';

async function seedDatabase() {
    try {
        await mongoose.connect(mongoDBURL);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await Invoice.deleteMany({});

        // Sample products
        const products = [
            {
                name: 'Organic Wheat Seeds',
                description: 'High-quality organic wheat seeds for farming',
                price: 45.00,
                category: 'Seeds',
                unit: 'kg'
            },
            {
                name: 'NPK Fertilizer',
                description: 'Balanced NPK fertilizer for all crops',
                price: 120.00,
                category: 'Fertilizers',
                unit: 'bag'
            },
            {
                name: 'Drip Irrigation Kit',
                description: 'Complete drip irrigation system for small farms',
                price: 2500.00,
                category: 'Irrigation',
                unit: 'kit'
            },
            {
                name: 'Pesticide Spray',
                description: 'Organic pesticide for crop protection',
                price: 85.00,
                category: 'Pesticides',
                unit: 'bottle'
            },
            {
                name: 'Garden Hoe',
                description: 'Durable garden hoe for farming',
                price: 350.00,
                category: 'Tools',
                unit: 'pcs'
            }
        ];

        const createdProducts = await Product.insertMany(products);
        console.log('Sample products created:', createdProducts.length);

        // Sample invoice
        const sampleInvoice = new Invoice({
            clientName: 'Farmer Ravi Kumar',
            clientEmail: 'ravi.kumar@example.com',
            clientPhone: '+91 9876543210',
            clientAddress: {
                street: '123 Village Road',
                city: 'Pune',
                state: 'Maharashtra',
                pincode: '411001'
            },
            items: [
                {
                    product: createdProducts[0]._id,
                    quantity: 10,
                    unitPrice: createdProducts[0].price,
                    totalPrice: 10 * createdProducts[0].price
                },
                {
                    product: createdProducts[1]._id,
                    quantity: 2,
                    unitPrice: createdProducts[1].price,
                    totalPrice: 2 * createdProducts[1].price
                }
            ],
            subtotal: (10 * createdProducts[0].price) + (2 * createdProducts[1].price),
            gstRate: 18,
            gstAmount: ((10 * createdProducts[0].price) + (2 * createdProducts[1].price)) * 0.18,
            totalAmount: ((10 * createdProducts[0].price) + (2 * createdProducts[1].price)) * 1.18,
            status: 'sent',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            notes: 'Thank you for your business. Please pay within 30 days.'
        });

        await sampleInvoice.save();
        console.log('Sample invoice created:', sampleInvoice.invoiceNumber);

        console.log('\n=== Database Seeded Successfully! ===');
        console.log('Products:', createdProducts.length);
        console.log('Invoices: 1');
        console.log('\nYou can now:');
        console.log('1. Visit http://localhost:3006/admin for admin dashboard');
        console.log('2. Visit http://localhost:3006/user for user portal');
        console.log('3. Search for invoice using email: ravi.kumar@example.com');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
