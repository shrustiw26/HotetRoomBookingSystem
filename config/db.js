const { MongoClient } = require('mongodb');

let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(process.env.DB_NAME); // Example: "appointmentDB"
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };
