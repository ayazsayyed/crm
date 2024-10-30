const bcrypt = require('bcryptjs');

async function generateHash() {
    console.log('Hashing password:');

    const password = 'admin123'; // your desired password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hash);
}

generateHash();