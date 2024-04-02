const { Pool } = require('pg')
require('dotenv').config()

const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_DATABASE } = process.env

function createDatabaseConnection(database) {
  return new Pool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: database,
    port: DB_PORT,
    max: 20,
    idleTimeoutMillis: 30000
  })
}

const khass = createDatabaseConnection(DB_DATABASE)

module.exports = {
  async queryAll(queryString) {
    const client = await khass.connect()

    try {
      const result = await client.query(queryString)
      return result.rows
    } finally {
      client.release() // Release the client back to the pool when done
    }
  },
  async query(queryString) {
    const client = await khass.connect()

    try {
      const result = await client.query(queryString)
      return result.rows[0]
    } finally {
      client.release() // Release the client back to the pool when done
    }
  },
  async resultQuery(queryString) {
    const client = await khass.connect()

    try {
      const result = await client.query(queryString)
      return result
    } finally {
      client.release() // Release the client back to the pool when done
    }
  }
}
