require('dotenv').config();
const { Timeline, sequelize } = require('./config/db');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Database Connected');

    // Clear old timeline
    await Timeline.destroy({ where: {} });
    
    const entries = [
      { year: '1999', topic: 'The Beginning', description: 'First Momotarou restaurant opened in Thamel, Kathmandu.' },
      { year: '2004', topic: 'Expansion to Lalitpur', description: 'Second branch opened in Sanepa, Lalitpur.' },
      { year: '2005', topic: 'Expansion to Pokhara', description: 'Successfully opened our branch in Pokhara Lakeside.' },
      { year: '2024', topic: 'First Franchise', description: 'Expanding our reach with the first franchise outlet in Bhaisepati, Lalitpur.' }
    ];

    for (const data of entries) {
      await Timeline.create(data);
    }
    
    console.log('Timeline seeded successfully!');
  } catch (e) {
    console.error('Error seeding timeline:', e);
  } finally {
    process.exit();
  }
}

main();
