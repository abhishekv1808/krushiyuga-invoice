# Krushiyuga Invoice Generator Website

A comprehensive Invoice Management System built for agricultural businesses using modern web technologies.

## 🌟 Features

### Admin Features
- **Dashboard**: Overview of products, invoices, and revenue
- **Product Management**: Add, edit, delete agricultural products
- **Invoice Generation**: Create invoices with automatic calculations
- **PDF Export**: Generate professional PDF invoices
- **Status Management**: Track invoice status (Draft, Sent, Paid, Cancelled)

### User Features
- **Invoice Search**: Users can search invoices by email
- **Invoice Viewing**: Detailed view of assigned invoices
- **Print Functionality**: Print invoices directly from browser
- **Status Tracking**: View payment status and due dates

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js (MVC Architecture)
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS Templates
- **Styling**: TailwindCSS v4.1
- **PDF Generation**: PDFKit
- **Session Management**: Express-session
- **Development**: Nodemon for auto-restart

## 📦 Dependencies

```json
{
  "dependencies": {
    "@tailwindcss/cli": "^4.1.12",
    "bcryptjs": "^12.0.0",
    "body-parser": "^2.2.0",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "express-session": "^1.18.1",
    "express-validator": "^7.2.1",
    "mongodb": "^6.19.0",
    "mongoose": "^8.18.0",
    "nodemon": "^3.1.10",
    "pdfkit": "^0.15.0",
    "tailwindcss": "^4.1.12",
    "uuid": "^11.0.3"
  }
}
```

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd krushiyuga-invoice-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Update MongoDB connection string in `app.js`
   - Configure your database credentials

4. **Build TailwindCSS**
   ```bash
   npx tailwindcss -i ./views/input.css -o ./public/output.css --watch
   ```

5. **Seed Sample Data (Optional)**
   ```bash
   node seed.js
   ```

6. **Start the server**
   ```bash
   npm start
   ```

7. **Access the application**
   - Admin Dashboard: http://localhost:3006/admin
   - User Portal: http://localhost:3006/user
   - Main App: http://localhost:3006

## 📁 Project Structure

```
krushiyuga-invoice-web/
├── app.js                 # Main application entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
├── seed.js               # Database seeding script
├── controllers/
│   ├── adminController.js # Admin functionality
│   └── userController.js  # User functionality
├── models/
│   ├── Product.js        # Product schema
│   ├── Invoice.js        # Invoice schema
│   └── User.js           # User schema
├── routes/
│   ├── adminRouter.js    # Admin routes
│   └── userRouter.js     # User routes
├── utils/
│   └── mainUtils.js      # Utility functions & PDF generator
├── views/
│   ├── partials/
│   │   ├── head.ejs      # Common head section
│   │   └── navbar.ejs    # Navigation component
│   ├── admin/
│   │   ├── dashboard.ejs      # Admin dashboard
│   │   ├── products.ejs       # Product management
│   │   ├── invoices.ejs       # Invoice listing
│   │   ├── create-invoice.ejs # Invoice creation form
│   │   └── invoice-details.ejs # Invoice details view
│   ├── user/
│   │   ├── home.ejs           # User portal home
│   │   └── invoice-details.ejs # User invoice view
│   ├── 404.ejs           # Page not found
│   ├── 500.ejs           # Server error
│   └── input.css         # TailwindCSS input file
└── public/
    ├── output.css        # Compiled TailwindCSS
    └── invoices/         # Generated PDF invoices
```

## 🎯 API Endpoints

### Admin Routes (`/admin`)
- `GET /` - Admin dashboard
- `GET /products` - Product management page
- `POST /products` - Create new product
- `POST /products/:id/update` - Update product
- `POST /products/:id/delete` - Delete product
- `GET /invoices` - Invoice listing
- `GET /invoices/create` - Create invoice form
- `POST /invoices` - Create new invoice
- `GET /invoices/:id` - Invoice details
- `GET /invoices/:id/pdf` - Download PDF
- `POST /invoices/:id/status` - Update invoice status

### User Routes (`/user`)
- `GET /` - User portal home
- `POST /search` - Search invoices
- `GET /invoices/:id` - View invoice details
- `GET /api/summary` - Invoice summary API

## 🗄️ Database Schema

### Product Model
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  category: String,
  unit: String (default: 'pcs'),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Invoice Model
```javascript
{
  invoiceNumber: String (auto-generated),
  clientName: String (required),
  clientEmail: String (required),
  clientPhone: String,
  clientAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  items: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  subtotal: Number,
  gstRate: Number (default: 18),
  gstAmount: Number,
  totalAmount: Number,
  status: String (enum: draft, sent, paid, cancelled),
  dueDate: Date,
  notes: String,
  timestamps: true
}
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean Interface**: Modern TailwindCSS components
- **Interactive Forms**: Dynamic item addition in invoice creation
- **Status Indicators**: Color-coded invoice statuses
- **Print Support**: Optimized print styles for invoices
- **Loading States**: User feedback during operations
- **Error Handling**: Comprehensive error messages

## 📊 Key Functionalities

### Invoice Generation
1. Select products from database
2. Auto-calculate item totals
3. Apply GST calculations
4. Generate unique invoice numbers
5. Save to database
6. Export as PDF

### PDF Generation
- Company branding with logo
- Professional invoice layout
- Detailed item breakdown
- Tax calculations
- Terms and conditions
- Client information

### User Experience
- Email-based invoice search
- Status tracking
- Mobile-responsive design
- Print-friendly layouts

## 🔧 Configuration

### MongoDB Connection
Update the connection string in `app.js`:
```javascript
const mongoDBURL = 'your-mongodb-connection-string';
```

### TailwindCSS
Configuration in `tailwind.config.js`:
```javascript
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif']
      }
    }
  }
}
```

## 🧪 Testing

To test the application with sample data:

1. Run the seed script: `node seed.js`
2. Visit admin dashboard: http://localhost:3006/admin
3. Test user portal with email: `ravi.kumar@example.com`
4. Create new products and invoices
5. Generate PDF exports

## 🚀 Deployment

For production deployment:

1. Set environment variables
2. Configure production MongoDB
3. Build optimized CSS
4. Use PM2 for process management
5. Set up reverse proxy (Nginx)
6. Enable HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and queries:
- Email: info@krushiyuga.com
- Phone: +91 9876543210

---

**Krushiyuga Invoice Management System** - Empowering Agricultural Businesses with Digital Solutions 🌱
