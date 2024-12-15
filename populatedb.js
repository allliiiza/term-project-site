const mongoose = require('mongoose');
const Product = require('./models/product'); // Import your Product model

// Replace with your MongoDB connection string
const dbURI = 'mongodb+srv://mernelotrisha:dit2004IoPJgK9n9@cluster0.kq8hk.mongodb.net/local_library?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Adding more products
        const products = [
            { 
                name: 'T-shirt', 
                description: 'A comfortable cotton T-shirt', 
                price: 19.99, 
                quantity: 50, 
                imageURL: '/images/t-shirt_01.jpg' 
            },
            { 
                name: 'Jeans', 
                description: 'Stylish denim jeans', 
                price: 39.99, 
                quantity: 30, 
                imageURL: '/images/jeans_02.jpg' 
            },
            // Add more products here with their image URLs
        ];

        // Insert products into the database
        return Product.insertMany(products);
    })
    .then(() => {
        console.log('Products added to database');
        mongoose.connection.close(); // Close connection after adding products
    })
    .catch(err => {
        console.error('Error:', err);
        mongoose.connection.close();
    });
