const bcrypt = require('bcryptjs');

async function generateHashes() {
    const passwords = {
        admin: 'admin123',
        manager: 'manager123',
        developer: 'dev123',
        user: 'user123'
    };

    for (const [role, password] of Object.entries(passwords)) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log(`${role}: ${hash}`);
    }
}

generateHashes();