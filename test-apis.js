const axios = require('axios');

async function testExternalAPIs() {
  const name = 'ella';

  console.log('Testing external APIs...\n');

  try {
    // Test Genderize
    const gender = await axios.get(`https://api.genderize.io?name=${name}`);
    console.log('✅ Genderize:', gender.data);

    // Test Agify
    const age = await axios.get(`https://api.agify.io?name=${name}`);
    console.log('✅ Agify:', age.data);

    // Test Nationalize
    const country = await axios.get(`https://api.nationalize.io?name=${name}`);
    console.log('✅ Nationalize:', country.data);

    console.log('\n✅ All external APIs are working!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testExternalAPIs();
