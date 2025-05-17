import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const hashedPassword = await hash('123456', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  console.log('Created test user:', user);

  // Create a buy operation
  const buyOperation = await prisma.operacao.create({
    data: {
      tipo: 'compra',
      ativo: 'PETR4',
      quantidade: 100,
      preco: 28.50,
      valorTotal: 2850.00,
      data: new Date('2024-03-15'),
      userId: user.id,
    },
  });

  console.log('Created buy operation:', buyOperation);

  // Create a sell operation
  const sellOperation = await prisma.operacao.create({
    data: {
      tipo: 'venda',
      ativo: 'VALE3',
      quantidade: 50,
      preco: 72.30,
      valorTotal: 3615.00,
      data: new Date('2024-03-16'),
      userId: user.id,
    },
  });

  console.log('Created sell operation:', sellOperation);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 