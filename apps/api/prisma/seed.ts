import { PrismaClient } from '@prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding...');

    // Create admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@it-ticket.local' },
        update: {},
        create: {
            email: 'admin@it-ticket.local',
            username: 'admin',
            password: 'password123', // In a real app, this should be hashed
            role: 'ADMIN',
        },
    });
    console.log(`Created admin user: ${admin.username}`);

    // Create standard user
    const user = await prisma.user.upsert({
        where: { email: 'user@it-ticket.local' },
        update: {},
        create: {
            email: 'user@it-ticket.local',
            username: 'user1',
            password: 'password123', // In a real app, this should be hashed
            role: 'USER',
        },
    });
    console.log(`Created user: ${user.username}`);

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
