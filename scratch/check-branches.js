const { Branch } = require('../config/db');

async function checkBranches() {
  try {
    const branches = await Branch.findAll();
    console.log('Current Branches:', JSON.stringify(branches, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error fetching branches:', err);
    process.exit(1);
  }
}

checkBranches();
