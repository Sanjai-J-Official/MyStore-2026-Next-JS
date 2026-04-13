import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://admin:sanjai1234@cluster0.rr98awv.mongodb.net/mystore?retryWrites=true&w=majority";

const NEW_CATEGORIES = [
  'Handcraft Product', 
  'Wooden Product', 
  'Home Decor', 
  'Wooden Toys', 
  'Wooden Premium Product', 
  'Wooden Kitchen Products', 
  'Coconut Shell Products'
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const CategorySchema = new mongoose.Schema({ name: String });
  const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
  
  const ProductSchema = new mongoose.Schema({
    category: String,
    categories: [String]
  }, { strict: false });
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

  let addedCats = 0;
  for (const catName of NEW_CATEGORIES) {
    const exists = await Category.findOne({ name: catName });
    if (!exists) {
      await Category.create({ name: catName });
      addedCats++;
    }
  }

  const products = await Product.find({});
  let updatedProductsCount = 0;

  for (const product of products) {
    let needsUpdate = false;
    const currentCategories = product.categories || [];

    if (product.category && !currentCategories.includes(product.category)) {
       product.categories.push(product.category);
       needsUpdate = true;
    }

    if (needsUpdate) {
       await Product.updateOne({ _id: product._id }, { $set: { categories: product.categories }});
       updatedProductsCount++;
    }
  }

  console.log(`Migration completed! Categories Added: ${addedCats}, Products Updated: ${updatedProductsCount}`);
  process.exit(0);
}

run().catch(console.error);
