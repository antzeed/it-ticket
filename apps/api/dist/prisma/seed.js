"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Start seeding...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@it-ticket.local' },
        update: {},
        create: {
            email: 'admin@it-ticket.local',
            username: 'admin',
            password: 'password123',
            role: 'ADMIN',
        },
    });
    console.log(`Created admin user: ${admin.username}`);
    const user = await prisma.user.upsert({
        where: { email: 'user@it-ticket.local' },
        update: {},
        create: {
            email: 'user@it-ticket.local',
            username: 'user1',
            password: 'password123',
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
//# sourceMappingURL=seed.js.map