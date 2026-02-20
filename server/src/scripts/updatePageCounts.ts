import prisma from '../utils/prisma';
import { storageService } from '../services/storageService';
import fs from 'fs';

// pdf-parse uses CommonJS export, need to use require with default
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.default || pdfParseModule;

async function updatePageCounts() {
  try {
    console.log('Starting page count update...');
    
    // Get all PDF materials
    const materials = await prisma.material.findMany({
      where: {
        type: 'PDF',
        filename: { not: null }
      }
    });

    console.log(`Found ${materials.length} PDF materials`);

    for (const material of materials) {
      try {
        if (!material.filename) continue;

        const filepath = storageService.getFilePath(material.filename);
        
        if (!fs.existsSync(filepath)) {
          console.log(`File not found: ${material.filename}`);
          continue;
        }

        const dataBuffer = fs.readFileSync(filepath);
        const pdfData = await pdfParse(dataBuffer);
        const pageCount = pdfData.numpages;

        await prisma.material.update({
          where: { id: material.id },
          data: { pageCount }
        });

        console.log(`Updated material ${material.id} (${material.title}): ${pageCount} pages`);
      } catch (error) {
        console.error(`Failed to update material ${material.id}:`, error);
      }
    }

    console.log('Page count update completed');
  } catch (error) {
    console.error('Update page counts error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePageCounts();
