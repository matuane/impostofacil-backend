import { PrismaClient } from './generated/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

interface AssetData {
  ticker: string;
  type: string;
}

async function main() {
  // Create a test user (or get existing one)
  const hashedPassword = await hash('123456', 10);
  
  let user = await prisma.user.findUnique({
    where: { email: 'test@example.com' }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
      },
    });
    console.log('Created test user:', user);
  } else {
    console.log('Using existing test user:', user);
  }

  // Clear existing data to start fresh
  await prisma.transaction.deleteMany({});
  await prisma.monthlyTax.deleteMany({});
  await prisma.asset.deleteMany({});

  // Create assets
  const assets: AssetData[] = [
    { ticker: 'PETR4', type: 'acao' },
    { ticker: 'VALE3', type: 'acao' },
    { ticker: 'ITUB4', type: 'acao' },
    { ticker: 'BBDC4', type: 'acao' },
    { ticker: 'ABEV3', type: 'acao' },
    { ticker: 'VISC11', type: 'fii' },
    { ticker: 'HGLG11', type: 'fii' },
    { ticker: 'XPML11', type: 'fii' },
    { ticker: 'IRDM11', type: 'fii' },
    { ticker: 'BCFF11', type: 'fii' }
  ];

  const createdAssets: any[] = [];
  for (const asset of assets) {
    const createdAsset = await prisma.asset.create({
      data: asset
    });
    createdAssets.push(createdAsset);
    console.log(`Created asset: ${asset.ticker}`);
  }

  // Create transactions for each month (January to December 2024)
  const months = [
    { month: 1, name: 'Janeiro' },
    { month: 2, name: 'Fevereiro' },
    { month: 3, name: 'Março' },
    { month: 4, name: 'Abril' },
    { month: 5, name: 'Maio' },
    { month: 6, name: 'Junho' },
    { month: 7, name: 'Julho' },
    { month: 8, name: 'Agosto' },
    { month: 9, name: 'Setembro' },
    { month: 10, name: 'Outubro' },
    { month: 11, name: 'Novembro' },
    { month: 12, name: 'Dezembro' }
  ];

  // Store buy transactions to calculate profit later
  const buyTransactions: any[] = [];

  for (const monthData of months) {
    const month = monthData.month;
    const monthName = monthData.name;
    
    console.log(`\n=== Creating transactions for ${monthName} 2024 ===`);

    // 2 buy operations per month
    for (let i = 1; i <= 2; i++) {
      const assetIndex = (month - 1 + i) % createdAssets.length;
      const asset = createdAssets[assetIndex];
      
      // Vary the price and quantity for realism
      const basePrice = asset.type === 'acao' ? 25 + (month * 0.5) : 80 + (month * 1.2);
      const priceVariation = (Math.random() - 0.5) * 5; // ±2.5 variation
      const price = Math.round((basePrice + priceVariation) * 100) / 100;
      
      const quantity = asset.type === 'acao' ? 50 + Math.floor(Math.random() * 100) : 10 + Math.floor(Math.random() * 20);
      const totalValue = price * quantity;

      const buyOperation = await prisma.transaction.create({
        data: {
          type: 'compra',
          quantity: quantity,
          price_per_unit: price,
          total_value: totalValue,
          date: new Date(2024, month - 1, 5 + (i * 5)), // 5th and 10th of each month
          userId: user.id,
          assetId: asset.id
        },
      });

      buyTransactions.push(buyOperation);
      console.log(`Created buy operation ${i} for ${monthName}: ${asset.ticker} - ${quantity} units at R$ ${price} each`);
    }

    // 1 sell operation per month (starting from March to have some buy history)
    if (month >= 3) {
      const assetIndex = (month - 1) % createdAssets.length;
      const asset = createdAssets[assetIndex];
      
      // Find a previous buy transaction for this asset to calculate profit
      const previousBuy = buyTransactions.find(t => t.assetId === asset.id);
      
      // Sell at a higher price than purchase for profit
      const basePrice = asset.type === 'acao' ? 30 + (month * 0.8) : 90 + (month * 1.5);
      const priceVariation = (Math.random() - 0.3) * 8; // Slight positive variation for profit
      const sellPrice = Math.round((basePrice + priceVariation) * 100) / 100;
      
      const quantity = asset.type === 'acao' ? 20 + Math.floor(Math.random() * 30) : 5 + Math.floor(Math.random() * 10);
      const totalValue = sellPrice * quantity;

      const sellOperation = await prisma.transaction.create({
        data: {
          type: 'venda',
          quantity: quantity,
          price_per_unit: sellPrice,
          total_value: totalValue,
          date: new Date(2024, month - 1, 20), // 20th of each month
          userId: user.id,
          assetId: asset.id
        },
      });

      console.log(`Created sell operation for ${monthName}: ${asset.ticker} - ${quantity} units at R$ ${sellPrice} each`);

      // Calculate profit and create MonthlyTax
      if (previousBuy) {
        const buyPrice = previousBuy.price_per_unit;
        const profitPerUnit = sellPrice - buyPrice;
        const totalProfit = profitPerUnit * quantity;
        
        // Tax rate: 15% for stocks, 20% for FIIs
        const taxRate = asset.type === 'acao' ? 0.15 : 0.20;
        const taxAmount = totalProfit > 0 ? totalProfit * taxRate : 0;

        const monthlyTax = await prisma.monthlyTax.create({
          data: {
            month: month,
            year: 2024,
            asset_type: asset.type,
            total_gain: totalProfit,
            carried_forward_tax: 0, // No carried forward tax for this example
            tax_due: taxAmount,
            userId: user.id,
            transactions: {
              connect: {
                id: sellOperation.id
              }
            }
          },
        });

        console.log(`Created MonthlyTax for ${monthName}: Profit R$ ${totalProfit.toFixed(2)}, Tax R$ ${taxAmount.toFixed(2)}`);
      }
    }
  }

  console.log('\n🌱 Seed completed successfully!');
  console.log(`Created ${months.length * 2} buy operations and ${months.length - 2} sell operations`);
  console.log(`Created ${months.length - 2} MonthlyTax records`);
  console.log(`Total transactions: ${months.length * 2 + (months.length - 2)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 