// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATABASE SEED - Creates default admin user
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create SuperAdmin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fasalsathi.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@fasalsathi.com',
      phone: '9999999999',
      password: adminPassword,
      role: 'SuperAdmin',
      state: 'Maharashtra',
      district: 'Pune',
      isVerified: true,
    },
  });
  console.log('✅ SuperAdmin created:', admin.email);

  // Create Moderator
  const modPassword = await bcrypt.hash('mod123', 12);
  const moderator = await prisma.user.upsert({
    where: { email: 'moderator@fasalsathi.com' },
    update: {},
    create: {
      name: 'Moderator',
      email: 'moderator@fasalsathi.com',
      phone: '8888888888',
      password: modPassword,
      role: 'Moderator',
      state: 'Maharashtra',
      district: 'Nagpur',
      isVerified: true,
    },
  });
  console.log('✅ Moderator created:', moderator.email);

  // Create test farmer
  const farmerPassword = await bcrypt.hash('farmer123', 12);
  const farmer = await prisma.user.upsert({
    where: { email: 'farmer@fasalsathi.com' },
    update: {},
    create: {
      name: 'Ramesh Kisan',
      email: 'farmer@fasalsathi.com',
      phone: '7777777777',
      password: farmerPassword,
      role: 'Farmer',
      state: 'Madhya Pradesh',
      district: 'Indore',
      crops: 'Wheat,Soybean,Cotton',
      isVerified: true,
    },
  });
  console.log('✅ Farmer created:', farmer.email);

  // Create sample schemes
  await prisma.governmentScheme.createMany({
    data: [
      {
        title: 'PM-KISAN Samman Nidhi',
        description: 'Under PM-KISAN scheme, Rs 6,000 per year is given to eligible farmer families in three installments.',
        ministry: 'Ministry of Agriculture',
        eligibility: 'All landholding farmer families',
        benefits: 'Rs 6,000 per year in 3 installments',
        category: 'subsidy',
        isFeatured: true,
        isActive: true,
      },
      {
        title: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance scheme that provides financial support to farmers suffering crop loss due to natural calamities.',
        ministry: 'Ministry of Agriculture',
        eligibility: 'All farmers growing notified crops',
        benefits: 'Insurance coverage for crop loss',
        category: 'insurance',
        isFeatured: true,
        isActive: true,
      },
    ],
  });
  console.log('✅ Sample schemes created');

  // Create sample mandi prices
  await prisma.mandiPrice.createMany({
    data: [
      { crop: 'Wheat', variety: 'Lokwan', market: 'Indore Mandi', district: 'Indore', state: 'Madhya Pradesh', minPrice: 2100, maxPrice: 2400, modalPrice: 2275, date: new Date() },
      { crop: 'Soybean', variety: 'Yellow', market: 'Indore Mandi', district: 'Indore', state: 'Madhya Pradesh', minPrice: 4200, maxPrice: 4600, modalPrice: 4400, date: new Date() },
      { crop: 'Cotton', variety: 'Medium Staple', market: 'Nagpur Mandi', district: 'Nagpur', state: 'Maharashtra', minPrice: 6200, maxPrice: 6800, modalPrice: 6500, date: new Date() },
      { crop: 'Rice', variety: 'Basmati', market: 'Delhi Mandi', district: 'New Delhi', state: 'Delhi', minPrice: 3400, maxPrice: 3800, modalPrice: 3600, date: new Date() },
      { crop: 'Onion', variety: 'Red', market: 'Nashik Mandi', district: 'Nashik', state: 'Maharashtra', minPrice: 800, maxPrice: 1200, modalPrice: 1000, date: new Date() },
    ],
  });
  console.log('✅ Sample mandi prices created');

  // Create sample news
  await prisma.newsArticle.createMany({
    data: [
      {
        title: 'Kharif Season 2026: MSP Increased for Major Crops',
        content: 'The government has announced an increase in Minimum Support Prices for Kharif crops including paddy, jowar, bajra, and maize for the 2026-27 season.',
        summary: 'MSP hiked for kharif 2026 crops',
        category: 'agriculture',
        isFeatured: true,
      },
      {
        title: 'Heavy Rainfall Expected in Central India',
        content: 'IMD has predicted heavy rainfall in Madhya Pradesh, Maharashtra and Chhattisgarh over the next 3 days. Farmers advised to take precautions.',
        summary: 'Heavy rain alert for central India',
        category: 'weather',
        isBreaking: true,
      },
    ],
  });
  console.log('✅ Sample news articles created');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌾 Database seeded successfully!');
  console.log('');
  console.log('Default Logins:');
  console.log('  SuperAdmin: admin@fasalsathi.com / admin123');
  console.log('  Moderator:  moderator@fasalsathi.com / mod123');
  console.log('  Farmer:     farmer@fasalsathi.com / farmer123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
