const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'maintenance_mode' }
  })
  
  console.log('===== DATABASE CHECK =====')
  console.log('maintenance_mode setting:', setting)
  console.log('Value:', setting?.value)
  console.log('Is maintenance mode ON?', setting?.value === 'true')
  console.log('========================')
  
  await prisma.$disconnect()
}

main().catch(console.error)
