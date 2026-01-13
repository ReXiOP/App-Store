const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Starting category migration...");

    // 1. Get all apps with categoryName
    const apps = await prisma.app.findMany({
        where: {
            categoryId: null,
            categoryName: { not: null }
        }
    });

    console.log(`Found ${apps.length} apps to migrate.`);

    for (const app of apps) {
        if (!app.categoryName) continue;

        // 2. Find or create the category
        let category = await prisma.category.findUnique({
            where: { name: app.categoryName }
        });

        if (!category) {
            console.log(`Creating category: ${app.categoryName}`);
            category = await prisma.category.create({
                data: { name: app.categoryName }
            });
        }

        // 3. Link the app to the category
        await prisma.app.update({
            where: { id: app.id },
            data: {
                categoryId: category.id
            }
        });

        console.log(`Linked ${app.name} to category ${app.categoryName}`);
    }

    console.log("Migration finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
