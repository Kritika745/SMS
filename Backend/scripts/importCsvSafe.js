import csv from "csvtojson";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = "salesDB";
const collectionName = "sales";
const csvFilePath = "./truestate_assignment_dataset.csv";

const importCSV = async () => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const jsonArray = await csv().fromFile(csvFilePath);

    const uniqueArray = [];
    const seen = new Set();

    for (const [index, item] of jsonArray.entries()) {
      // Get transaction ID from CSV
      let transactionId = item["Transaction ID"];

      // Auto-generate if missing
      if (!transactionId) {
        transactionId = `tx-${Date.now()}-${index}`;
      }

      // Skip if duplicate
      if (seen.has(transactionId)) continue;
      seen.add(transactionId);

      // Assign to the field matching MongoDB unique index
      item.transactionId = transactionId;

      // Optionally remove the original CSV key to avoid confusion
      // delete item["Transaction ID"];

      uniqueArray.push(item);
    }

    if (uniqueArray.length > 0) {
      const result = await collection.insertMany(uniqueArray);
      console.log(`${result.insertedCount} documents inserted successfully.`);
    } else {
      console.log("No new unique documents to insert.");
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

importCSV();
