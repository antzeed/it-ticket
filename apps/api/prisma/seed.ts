import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@it-ticket.local' },
        update: { department: 'IT', position: 'System Admin' },
        create: {
            email: 'admin@it-ticket.local',
            username: 'admin',
            password: hashedPassword,
            role: 'ADMIN',
            department: 'IT',
            position: 'System Admin'
        },
    });
    console.log(`Created admin user: ${admin.username}`);

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
