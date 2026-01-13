const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

async function main() {
    try {
        const apps = await prisma.app.findMany();
        for (const app of apps) {
            if (!app.size && app.downloadUrl) {
                const filePath = path.join(process.cwd(), 'public', app.downloadUrl);
                if (fs.existsSync(filePath)) {
                    const stats = fs.statSync(filePath);
                    const size = formatFileSize(stats.size);
                    await prisma.app.update({
                        where: { id: app.id },
                        data: { size }
                    });
                    console.log(`Updated ${app.name} with size ${size}`);
                }
            }
        }
        console.log("Migration complete.");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

main().finally(() => prisma.$disconnect());
