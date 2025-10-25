import Database from 'better-sqlite3'
import { join } from 'path'

let db: Database.Database | null = null

export function getDatabase() {
  if (!db) {
    const dbPath = join(process.cwd(), 'data', 'posts.db')
    db = new Database(dbPath)
    
    // Create posts table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }
  
  return db
}

export interface Post {
  id: number
  content: string
  timestamp: string
  created_at?: string
}