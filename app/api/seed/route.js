import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

const seedProducts = [
  {
    name: "Classic White T-Shirt",
    price: 499, originalPrice: 799,
    description: "Premium 100% cotton comfort tee perfect for everyday wear. Soft, breathable, and long-lasting.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "Clothing", stock: 10
  },
  {
    name: "Running Sneakers",
    price: 1999, originalPrice: 2999,
    description: "Lightweight running shoes with responsive cushioning. Ideal for daily training and long runs.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    category: "Footwear", stock: 5
  },
  {
    name: "Leather Wallet",
    price: 799, originalPrice: 1200,
    description: "Slim genuine leather wallet with 6 card slots and RFID blocking technology.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    category: "Accessories", stock: 20
  },
  {
    name: "Wireless Earbuds",
    price: 2499, originalPrice: 3999,
    description: "True wireless earbuds with active noise cancellation and 24hr total battery life.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
    category: "Electronics", stock: 8
  },
  {
    name: "Polarized Sunglasses",
    price: 999, originalPrice: 1499,
    description: "UV400 polarized lenses with lightweight TR90 frame. Stylish and protective.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    category: "Accessories", stock: 15
  },
  {
    name: "Waterproof Backpack",
    price: 1499, originalPrice: 2199,
    description: "30L waterproof backpack with dedicated laptop compartment and USB charging port.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "Bags", stock: 12
  },
  {
    name: "Denim Jacket",
    price: 1299, originalPrice: 1999,
    description: "Classic stonewashed denim jacket with a modern slim fit. A wardrobe essential.",
    image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=500",
    category: "Clothing", stock: 7
  },
  {
    name: "Smart Watch",
    price: 3499, originalPrice: 5999,
    description: "Fitness tracker with heart rate monitor, sleep tracking, and 7-day battery life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Electronics", stock: 6
  }
];

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert seed data
    const insertedProducts = await Product.insertMany(seedProducts);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully', 
      count: insertedProducts.length,
      data: insertedProducts 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Database seeding failed' },
      { status: 500 }
    );
  }
}
