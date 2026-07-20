import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/product.model.js";
import Category from "./src/models/category.model.js";
import Brand from "./src/models/brand.model.js";

dotenv.config();

const brandsData = [
  { name: "Apple", description: "Apple Inc. products" },
  { name: "Sony", description: "Sony Corporation products" },
  { name: "Nike", description: "Nike Sports products" },
  { name: "Samsung", description: "Samsung electronics" },
  { name: "Puma", description: "Puma athletic products" },
  { name: "Ikea", description: "Ikea furniture" },
  { name: "Lego", description: "Lego toys" },
  { name: "L'Oreal", description: "L'Oreal beauty products" },
];

const categoriesData = [
  // Parent Categories (parentCategory will be null)
  { name: "Electronics", key: "electronics" },
  { name: "Fashion", key: "fashion" },
  { name: "Home & Furniture", key: "home" },
  { name: "Beauty & Toys", key: "beauty" },
];

const subcategoriesData = [
  // Child Categories
  { name: "Mobiles", parentKey: "electronics" },
  { name: "Laptops", parentKey: "electronics" },
  { name: "Accessories", parentKey: "electronics" },
  
  { name: "Men's Wear", parentKey: "fashion" },
  { name: "Women's Wear", parentKey: "fashion" },
  { name: "Footwear", parentKey: "fashion" },
  
  { name: "Furniture", parentKey: "home" },
  { name: "Home Decor", parentKey: "home" },
  
  { name: "Beauty", parentKey: "beauty" },
  { name: "Toys & Games", parentKey: "beauty" },
];

const productsData = [
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry leading wireless noise cancelling headphones with auto noise cancelling optimizer.",
    price: 24999,
    discountPrice: 21999,
    stock: 50,
    images: [{ url: "/images/headphone.png", isPrimary: true }],
    brandName: "Sony",
    categoryName: "Accessories",
    ratingsAverage: 4.8,
    ratingsCount: 120,
    isFeatured: true
  },
  {
    name: "Apple iPhone 15 Pro",
    description: "Strong and light titanium design with new Action button, powerful camera upgrades.",
    price: 134900,
    discountPrice: 129900,
    stock: 25,
    images: [{ url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", isPrimary: true }],
    brandName: "Apple",
    categoryName: "Mobiles",
    ratingsAverage: 4.9,
    ratingsCount: 85,
    isFeatured: true
  },
  {
    name: "MacBook Pro M3",
    description: "The ultimate pro laptop. With M3 chip, beautiful Liquid Retina XDR display, up to 22 hours of battery life.",
    price: 169900,
    discountPrice: 159900,
    stock: 15,
    images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", isPrimary: true }],
    brandName: "Apple",
    categoryName: "Laptops",
    ratingsAverage: 4.9,
    ratingsCount: 42,
    isFeatured: true
  },
  {
    name: "Nike Air Max Sneakers",
    description: "Premium comfort and timeless style with revolutionary Air technology.",
    price: 9999,
    discountPrice: 7999,
    stock: 100,
    images: [{ url: "/images/shoes.png", isPrimary: true }],
    brandName: "Nike",
    categoryName: "Footwear",
    ratingsAverage: 4.7,
    ratingsCount: 310,
    isFeatured: true
  },
  {
    name: "Puma Classic Sweatshirt",
    description: "Cozy and stylish crew neck sweatshirt, made from high quality cotton.",
    price: 2999,
    discountPrice: 1999,
    stock: 80,
    images: [{ url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500", isPrimary: true }],
    brandName: "Puma",
    categoryName: "Men's Wear",
    ratingsAverage: 4.5,
    ratingsCount: 64,
  },
  {
    name: "Minimalist Wooden Dining Table",
    description: "Solid wood dining table seating up to 6 people, bringing cozy Scandinavian vibes to your home.",
    price: 24999,
    discountPrice: 21999,
    stock: 10,
    images: [{ url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500", isPrimary: true }],
    brandName: "Ikea",
    categoryName: "Furniture",
    ratingsAverage: 4.6,
    ratingsCount: 18,
  },
  {
    name: "L'Oreal Face Serum",
    description: "Hydrating hyaluronic acid serum for plumper, younger-looking skin.",
    price: 1299,
    discountPrice: 999,
    stock: 150,
    images: [{ url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500", isPrimary: true }],
    brandName: "L'Oreal",
    categoryName: "Beauty",
    ratingsAverage: 4.4,
    ratingsCount: 95,
  },
  {
    name: "Lego Technic Sports Car",
    description: "Build an authentic replica of a racing sports car with working pistons and steering.",
    price: 4999,
    discountPrice: 4299,
    stock: 40,
    images: [{ url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500", isPrimary: true }],
    brandName: "Lego",
    categoryName: "Toys & Games",
    ratingsAverage: 4.8,
    ratingsCount: 38,
  }
];

async function seed() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");

    // Clear existing
    console.log("Clearing existing products, categories, brands...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});

    // Seed Brands
    console.log("Seeding Brands...");
    const createdBrands = await Brand.insertMany(brandsData);
    console.log(`Seeded ${createdBrands.length} brands.`);

    // Seed Parent Categories
    console.log("Seeding Parent Categories...");
    const parentMap = {};
    for (const parent of categoriesData) {
      const cat = await Category.create({
        name: parent.name,
        parentCategory: null,
      });
      parentMap[parent.key] = cat._id;
    }
    console.log("Parent categories seeded.");

    // Seed Child Categories
    console.log("Seeding Child Categories...");
    const childMap = {};
    for (const child of subcategoriesData) {
      const parentId = parentMap[child.parentKey];
      const cat = await Category.create({
        name: child.name,
        parentCategory: parentId,
      });
      childMap[child.name] = cat._id;
    }
    console.log("Child categories seeded.");

    // Seed Products
    console.log("Seeding Products...");
    for (const prod of productsData) {
      const brand = createdBrands.find(b => b.name === prod.brandName);
      const categoryId = childMap[prod.categoryName];

      if (!brand || !categoryId) {
        console.warn(`Skipping product ${prod.name}: brand or category not found`);
        continue;
      }

      await Product.create({
        name: prod.name,
        description: prod.description,
        price: prod.price,
        discountPrice: prod.discountPrice,
        stock: prod.stock,
        images: prod.images,
        brand: brand._id,
        category: categoryId,
        ratingsAverage: prod.ratingsAverage,
        ratingsCount: prod.ratingsCount,
        isFeatured: prod.isFeatured || false,
      });
    }
    console.log("Products seeded successfully.");

  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
