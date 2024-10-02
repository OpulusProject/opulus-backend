## Prisma
Generate Prisma client:
```bash
cd backend/typescript
npx prisma generate
```

Synchronize Prisma schema with database schema:
```bash
npx prisma db push
```

Generate and apply migrations:
```bash
npx prisma migrate dev
```

Open Prisma studio:
```bash
npx prisma studio
```