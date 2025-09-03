const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    clientEmail: {
        type: String,
        required: true,
        trim: true
    },
    clientPhone: {
        type: String,
        trim: true
    },
    clientAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unitPrice: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    gstRate: {
        type: Number,
        default: 18
    },
    gstAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'cancelled'],
        default: 'draft'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
    if (!this.invoiceNumber) {
        try {
            const count = await this.constructor.countDocuments();
            this.invoiceNumber = `KRU-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
