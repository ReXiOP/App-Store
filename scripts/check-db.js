const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const apps = await prisma.app.findMany({
        select: {
            id: true,
            name: true,
            size: true,
            downloadUrl: true
        }
    });
    apps.forEach(app => {
        console.log(`App: ${app.name}, Size: ${app.size}, URL: ${app.downloadUrl}`);
    });
}

main().finally(() => prisma.$disconnect());
