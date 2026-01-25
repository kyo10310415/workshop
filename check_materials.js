const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMaterials() {
  try {
    const materials = await prisma.material.findMany({
      include: { workshop: true }
    });
    
    console.log('=== Materials in Database ===');
    materials.forEach(m => {
      console.log(`ID: ${m.id}, Title: ${m.title}, Filename: ${m.filename}, Workshop: ${m.workshop.title}`);
    });
    
    console.log('\n=== Workshop 2 Materials ===');
    const workshop2Materials = await prisma.material.findMany({
      where: { workshopId: 2 },
      include: { workshop: true }
    });
    
    workshop2Materials.forEach(m => {
      console.log(`ID: ${m.id}, Title: ${m.title}, Filename: ${m.filename}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMaterials();
