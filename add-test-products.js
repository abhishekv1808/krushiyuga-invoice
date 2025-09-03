const mongoose = require('mongoose');
const Product = require('./models/Product');

const mongoDBURL = 'mongodb+srv://abhishekv1808:' + encodeURIComponent('Grow@$@2025') + '@aribnb.xvmlcnz.mongodb.net/krushiyuga-invoice?retryWrites=true&w=majority&appName=aribnb';

// Connect to MongoDB
mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB');
        addTestProducts();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

async function addTestProducts() {
    try {
        // Check if products already exist
        const existingProducts = await Product.find();
        if (existingProducts.length > 0) {
            console.log('Products already exist:', existingProducts.length);
            process.exit(0);
        }

        // Create test products
        const testProducts = [
            {
                name: 'Organic Rice',
                description: 'Premium quality organic rice',
                price: 120.00,
                category: 'Grains',
                unit: 'kg',
                isActive: true
            },
            {
                name: 'Fresh Wheat',
                description: 'High quality wheat grains',
                price: 80.00,
                category: 'Grains',
                unit: 'kg',
                isActive: true
            },
            {
                name: 'Organic Fertilizer',
                description: 'Natural organic fertilizer for crops',
                price: 250.00,
                category: 'Fertilizers',
                unit: 'bag',
                isActive: true
            },
            {
                name: 'Seeds - Tomato',
                description: 'High yield tomato seeds',
                price: 150.00,
                category: 'Seeds',
                unit: 'packet',
                isActive: true
            },
            {
                name: 'Agricultural Tools',
                description: 'Basic farming tools set',
                price: 500.00,
                category: 'Tools',
                unit: 'set',
                isActive: true
            }
        ];

        const products = await Product.insertMany(testProducts);
        console.log('Test products added successfully:', products.length);
        
        // Show created products
        products.forEach(product => {
            console.log(`- ${product.name}: ₹${product.price}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error adding test products:', error);
        process.exit(1);
    }
}
