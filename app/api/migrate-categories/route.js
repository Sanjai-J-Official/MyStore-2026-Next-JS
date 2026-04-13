import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

const NEW_CATEGORIES = [
  'Handcraft Product', 
  'Wooden Product', 
  'Home Decor', 
  'Wooden Toys', 
  'Wooden Premium Product', 
  'Wooden Kitchen Products', 
  'Coconut Shell Products'
];

export async function GET(request) {
  try {
    await dbConnect();
    
    // 1. Seed New Categories
    let addedCats = 0;
    for (const catName of NEW_CATEGORIES) {
      const exists = await Category.findOne({ name: catName });
      if (!exists) {
        await Category.create({ name: catName });
        addedCats++;
      }
    }

    // 2. Map existing properties from string 'category' to array 'categories'
    // NOTE: This uses updating documents without triggering hooks to prevent slug re-generation issues
    const products = await Product.find({});
    let updatedProductsCount = 0;

    for (const product of products) {
       let needsUpdate = false;
       const currentCategories = product.categories || [];

       // If it has old 'category' string and it's not in 'categories' array yet
       if (product.category && !currentCategories.includes(product.category)) {
          product.categories.push(product.category);
          needsUpdate = true;
       }

       if (needsUpdate) {
          // We use updateOne directly to avoid Mongoose validation errors on the deprecated 'category' ENUM field if it still triggers
          await Product.updateOne({ _id: product._id }, { $set: { categories: product.categories }});
          updatedProductsCount++;
       }
    }

    // 3. (Optional) In a real prod environment you might use $unset to remove `category`, 
    // but for safety we will leave it there. It's removed from Schema, so mongoose ignores it on fetch.

    return NextResponse.json({ 
      success: true, 
      message: 'Migration completed successfully.',
      categoriesAdded: addedCats,
      productsUpdated: updatedProductsCount
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: 'Migration failed: ' + error.message },
      { status: 500 }
    );
  }
}
