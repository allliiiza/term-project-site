<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= product.name %> - Product Details</title>
    <link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
  <header>
    <%- include('partials/navbar') %>
  </header>

  <main class="product-page">
      <section class="product-info">
          <img src="<%= product.imageURL %>" alt="<%= product.name %>" class="product-image">
          <div class="product-details">
              <h1><%= product.name %></h1>
              <h3>$<%= product.price %></h3>
              <p><%= product.description %></p>
              
              <!-- Debugging Product ID -->
              <!-- <p>Product ID for Debugging: <strong><%= product._id %></strong></p> -->
              
              <!-- Corrected Form -->
              <form action="/cart/add/<%= product._id %>" method="POST">
                  <button type="submit" class="btn">Add to Cart</button>
              </form>

              <a href="/" class="btn">Back to product list</a>
          </div>
      </section>
  </main>
</body>
</html>
