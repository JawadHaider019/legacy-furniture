import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Blog } from '../models/blogModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const blogsData = [
  {
    title: "How to Choose the Best Furniture for Your Home in the UK (2026 Guide)",
    content: `
      <p>Choosing the best furniture for your home in the UK can completely transform your living space. The right furniture improves comfort, functionality, and overall interior design.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">1. Measure Your Space Before Buying Furniture</h3>
      <p>Before purchasing any furniture, always measure your room. This ensures your sofa, bed, or dining table fits perfectly without overcrowding the space.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">2. Choose High-Quality Materials</h3>
      <p>For long-lasting furniture, choose materials like:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Solid wood (oak, walnut, sheesham)</li>
        <li>Metal frames for durability</li>
        <li>Premium fabrics for comfort</li>
      </ul>
      <p class="mt-4">High-quality materials improve both lifespan and appearance.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">3. Match Furniture With Your Interior Style</h3>
      <p>Popular UK furniture styles include:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Modern minimalist</li>
        <li>Scandinavian design</li>
        <li>Classic luxury interiors</li>
      </ul>
      <p class="mt-4">Consistency in design creates a premium and balanced look.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">4. Focus on Comfort and Functionality</h3>
      <p>Furniture should not only look good but also provide comfort. Always test seating comfort, storage options, and usability before purchasing.</p>
      
      <div class="bg-brand-cream/30 p-8 border-l-4 border-brand-bronze mt-12 italic">
        Choosing the right furniture in the UK requires planning, quality selection, and style consistency. Investing in well-designed furniture ensures long-term comfort and value.
      </div>
    `,
    category: ['Guides', 'Interior Design'],
    tags: ['buy furniture UK', 'luxury furniture UK', 'home decor', 'modern furniture UK', 'luxury furniture online UK', 'bedroom furniture UK', 'living room furniture UK'],
    status: 'published',
    author: 'Legacy Furniture Expert',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: "Top Furniture Trends in the UK 2026: Modern Home Design Ideas",
    content: `
      <p>Furniture trends in the UK in 2026 focus on sustainability, comfort, and smart living. Homeowners are now choosing modern, functional, and eco-friendly furniture designs.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">1. Sustainable Furniture Materials</h3>
      <p>Eco-friendly furniture is becoming the top trend. Materials like:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Recycled wood</li>
        <li>Bamboo</li>
        <li>Organic fabrics</li>
      </ul>
      <p class="mt-4">are widely used in modern UK homes.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">2. Multi-Functional Furniture for Small Spaces</h3>
      <p>With increasing urban living, space-saving furniture is in demand:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Sofa beds</li>
        <li>Storage beds</li>
        <li>Extendable dining tables</li>
      </ul>
      <p class="mt-4">These pieces maximize functionality in small homes.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">3. Neutral Colour Palettes</h3>
      <p>Popular colours in 2026 include:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Beige</li>
        <li>Grey</li>
        <li>Earth tones</li>
      </ul>
      <p class="mt-4">These colours create a calm and modern interior environment.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">4. Minimalist Interior Design</h3>
      <p>Minimalism continues to dominate UK furniture trends. Clean lines, simple shapes, and clutter-free spaces define modern homes.</p>
      
      <div class="bg-brand-cream/30 p-8 border-l-4 border-brand-bronze mt-12 italic">
        UK furniture trends in 2026 are all about sustainability, simplicity, and smart design. Investing in modern furniture ensures a stylish and functional home.
      </div>
    `,
    category: ['Trends', 'Design'],
    tags: ['modern furniture UK', 'furniture trends 2026', 'UK home design', 'buy furniture UK', 'luxury furniture online UK', 'living room furniture UK'],
    status: 'published',
    author: 'Design Concierge',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: "Why Investing in Quality Furniture is Worth It (UK Buyers Guide)",
    content: `
      <p>Buying furniture is a long-term investment. In the UK, homeowners are increasingly choosing quality furniture over cheap alternatives for durability and style.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">1. Durable Furniture Lasts Longer</h3>
      <p>High-quality furniture made from solid materials can last for decades. It reduces the need for frequent replacements.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">2. Better Value Over Time</h3>
      <p>Although premium furniture may cost more initially, it saves money in the long run by avoiding repairs and replacements.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">3. Enhances Home Appearance</h3>
      <p>Well-designed furniture improves the overall look of your home, making it feel more elegant and premium.</p>
      
      <h3 class="text-2xl font-serif text-brand-ink mt-8 mb-4">4. Comfort and Everyday Use</h3>
      <p>Quality furniture provides better comfort for daily use, whether it’s sofas, beds, or dining chairs.</p>
      
      <div class="bg-brand-cream/30 p-8 border-l-4 border-brand-bronze mt-12 italic">
        Investing in quality furniture is always a smart decision. It improves comfort, enhances home design, and provides long-term value for UK homeowners.
      </div>
    `,
    category: ['Buyers Guide', 'Quality'],
    tags: ['buy furniture UK', 'luxury furniture online UK', 'quality furniture', 'bedroom furniture UK', 'living room furniture UK', 'modern furniture UK'],
    status: 'published',
    author: 'Legacy Furniture Curator',
    imageUrl: 'https://images.unsplash.com/photo-1540638349517-3abd5afc5847?auto=format&fit=crop&q=80&w=1200'
  }
];

const updateBlogs = async () => {
  try {
    console.log("🔗 Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
    console.log("✅ Connected.");

    // Clear existing blogs
    const deleteResult = await Blog.deleteMany({});
    console.log(`🧹 Deleted ${deleteResult.deletedCount} existing blogs.`);

    // Add new blogs one by one to ensure pre-save hooks run
    const createdBlogs = [];
    for (const data of blogsData) {
      const blog = await Blog.create(data);
      createdBlogs.push(blog);
      console.log(`📝 Slug generated for "${blog.title}": ${blog.slug}`);
    }

    console.log(`✨ Successfully added ${createdBlogs.length} new blogs.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Blog update failed:", error);
    process.exit(1);
  }
};

updateBlogs();
