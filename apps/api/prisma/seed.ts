import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const departments = ['IT', 'Human Resources', 'Finance', 'Marketing', 'Sales', 'Operations', 'Executive'];
const positions = ['Manager', 'Senior Staff', 'Staff', 'Director', 'Specialist', 'Coordinator'];

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

    // Create standard mock users
    const usersCreated = [];
    for (let i = 1; i <= 100; i++) {
        const dept = departments[i % departments.length];
        const pos = positions[i % positions.length];
        const email = `user${i}@it-ticket.local`;
        
        const user = await prisma.user.upsert({
            where: { username: `user${i}` },
            update: { department: dept, position: pos, password: hashedPassword }, // Ensure password is correct and fields updated
            create: {
                email,
                username: `user${i}`,
                password: hashedPassword,
                role: 'USER',
                department: dept,
                position: pos
            },
        });
        usersCreated.push(user);
    }

    console.log(`Successfully seeded ${usersCreated.length} standard users.`);
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
