
const { Client } = require('pg');
const connectionString = 'postgresql://psql_user:psql@localhost:5432/assignment';
const client = new Client({
    connectionString: connectionString,
});
client.connect();

async function ensureCustomerTable() {
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS customer (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        age INT,
        monthly_income INT,
        phone_number INT,
        approved_limit INT
      )
    `);
        console.log('Customer table is ready.');
    } catch (error) {
        console.error('Error creating customer table:', error);
    }
}
ensureCustomerTable();

module.exports = {
    client
}