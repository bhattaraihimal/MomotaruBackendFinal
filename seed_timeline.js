require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { URL } = require('url');

const dbUrl = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.substring(1),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // Clear old timeline
    await prisma.timeline.deleteMany({});
    
    const entries = [
      { year: '1999', topic: 'The Beginning', description: 'First Momotarou restaurant opened in Thamel, Kathmandu.' },
      { year: '2004', topic: 'Expansion to Lalitpur', description: 'Second branch opened in Sanepa, Lalitpur.' },
      { year: '2005', topic: 'Expansion to Pokhara', description: 'Successfully opened our branch in Pokhara Lakeside.' },
      { year: '2024', topic: 'First Franchise', description: 'Expanding our reach with the first franchise outlet in Bhaisepati, Lalitpur.' }
    ];

    for (const data of entries) {
      await prisma.timeline.create({ data });
    }
    
    console.log('Timeline seeded successfully!');
  } catch (e) {
    console.error('Error seeding timeline:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
