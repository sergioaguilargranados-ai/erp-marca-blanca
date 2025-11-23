import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function main() {
  console.log('🚀 Ejecutando migraciones...')

  await migrate(db, { migrationsFolder: './drizzle' })

  console.log('✅ Migraciones completadas!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Error ejecutando migraciones:', err)
  process.exit(1)
})
