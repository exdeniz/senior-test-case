import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
const prisma = new PrismaClient()

const fakeMarketTrade = (): any => ({
  ask: faker.helpers.arrayElement(['usdt', 'rub', 'eur']), // Static string
  avgPrice: faker.datatype.float({ min: 0, max: 10, precision: 0.001 }), // Random float
  bid: faker.helpers.arrayElement(['usdt', 'rub', 'eur']), // Static string
  createdAt: faker.date.recent(90).toISOString(), // Recent date, converted to ISO string
  direction: faker.helpers.arrayElement(['bid', 'ask']), // Randomly selects either "bid" or "ask"
  executedVolume: faker.datatype.float({ min: 0, max: 100, precision: 0.01 }), // Random float
  factor: faker.datatype.number({ min: 0, max: 10 }), // Random integer
  fixPrice: faker.datatype.float({ min: 0, max: 5, precision: 0.001 }), // Random float
  fundsFee: faker.datatype.float({ min: 0, max: 1, precision: 0.001 }), // Random float
  fundsReceived: faker.datatype.float({ min: 0, max: 1000, precision: 0.01 }), // Random float
  marketId: faker.helpers.arrayElement(['usdtusd', 'usdteur', 'usdtrub']), // Static string', // Static string
  originVolume: faker.datatype.float({ min: 0, max: 100, precision: 0.01 }), // Random float
  price: faker.datatype.float({ min: 0, max: 10, precision: 0.001 }), // Random float
  received: faker.datatype.float({ min: 0, max: 1000, precision: 0.01 }), // Random float
  state: faker.helpers.arrayElement(['wait', 'active', 'completed', 'filled']), // Randomly selects a state
  tradesCount: faker.datatype.number({ max: 100 }), // Random integer
  type: faker.helpers.arrayElement(['limit', 'market']), // Randomly selects either "limit" or "market"
  volume: faker.datatype.float({ min: 0, max: 100, precision: 0.01 }), // Random float
})

async function main() {
  const fakerRounds = 250
  console.log('Seeding...')
  /// --------- Users ---------------
  for (let i = 0; i < fakerRounds; i++) {
    await prisma.orders.create({ data: fakeMarketTrade() })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
