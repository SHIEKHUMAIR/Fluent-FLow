const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '..', '.env');
const envTemplatePath = path.join(__dirname, '..', 'env.template');

console.log('🔍 Checking .env file...\n');

// Check if .env exists
if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('📝 Creating .env file from template...\n');
    
    // Read template if exists
    let content = '';
    if (fs.existsSync(envTemplatePath)) {
        content = fs.readFileSync(envTemplatePath, 'utf8');
    } else {
        // Create basic template
        content = `# Backend Environment Variables
PORT=4000

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fluent_flow
DB_USER=postgres
DB_PASSWORD=
DB_SSL=false

# JWT Secret (IMPORTANT: Change this to a secure random string)
JWT_SECRET=${crypto.randomBytes(32).toString('hex')}

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here

# VAPID Keys for Push Notifications
VAPID_PUBLIC_KEY=BFaip3G8l84m-VkODczkj2759AI5SPMnCGeYGTj-38GNfw2ikJIhkh1BPhtfPsvISeukD4BYA7rmnIk13fFTAgU
VAPID_PRIVATE_KEY=Ir3hdQi1NJsdpLJ4zyoGa3Gwt1yGcUW8E08V4SNpQ9A
`;
    }
    
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('✅ .env file created!\n');
} else {
    console.log('✅ .env file exists\n');
}

// Read and check .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

// Parse environment variables
const envVars = {};
lines.forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim();
        }
    }
});

console.log('📋 Current .env variables:');
console.log('─'.repeat(50));

// Check required variables
const requiredVars = {
    'JWT_SECRET': {
        required: true,
        minLength: 32,
        description: 'Secret key for JWT token signing'
    },
    'VAPID_PUBLIC_KEY': {
        required: true,
        description: 'VAPID public key for push notifications'
    },
    'VAPID_PRIVATE_KEY': {
        required: true,
        description: 'VAPID private key for push notifications'
    },
    'PORT': {
        required: false,
        default: '4000',
        description: 'Server port'
    },
    'DB_HOST': {
        required: false,
        default: 'localhost',
        description: 'Database host'
    },
    'DB_NAME': {
        required: false,
        description: 'Database name'
    }
};

let needsUpdate = false;
let updatedContent = envContent;

// Check each required variable
for (const [varName, config] of Object.entries(requiredVars)) {
    const value = envVars[varName];
    const status = value ? '✅' : '❌';
    const displayValue = value ? (varName.includes('SECRET') || varName.includes('KEY') ? `${value.substring(0, 10)}...` : value) : 'MISSING';
    
    console.log(`${status} ${varName}: ${displayValue}`);
    
    // Check JWT_SECRET specifically
    if (varName === 'JWT_SECRET') {
        if (!value || value.length < 32 || value === 'your_jwt_secret_key_here' || value === 'super_secure_secret_key') {
            console.log(`   ⚠️  JWT_SECRET is weak or missing! Generating secure one...`);
            const newSecret = crypto.randomBytes(32).toString('hex');
            
            // Update the content
            if (!value) {
                // Add new line
                updatedContent += `\nJWT_SECRET=${newSecret}\n`;
            } else {
                // Replace existing
                updatedContent = updatedContent.replace(
                    new RegExp(`^JWT_SECRET=.*$`, 'm'),
                    `JWT_SECRET=${newSecret}`
                );
            }
            needsUpdate = true;
            console.log(`   ✅ Generated new secure JWT_SECRET (64 characters)`);
        } else {
            console.log(`   ✅ JWT_SECRET is secure (${value.length} characters)`);
        }
    }
    
    // Check VAPID keys
    if ((varName === 'VAPID_PUBLIC_KEY' || varName === 'VAPID_PRIVATE_KEY') && !value) {
        console.log(`   ⚠️  ${varName} is missing!`);
        needsUpdate = true;
    }
}

console.log('─'.repeat(50));

if (needsUpdate) {
    console.log('\n📝 Updating .env file...');
    fs.writeFileSync(envPath, updatedContent, 'utf8');
    console.log('✅ .env file updated!\n');
    console.log('⚠️  IMPORTANT: Restart your backend server for changes to take effect!');
} else {
    console.log('\n✅ All required environment variables are set correctly!');
}

console.log('\n💡 Tips:');
console.log('   - JWT_SECRET should be at least 32 characters long');
console.log('   - Never commit .env file to version control');
console.log('   - Restart server after changing .env file');

