import { connectToDatabase } from "../lib/db/connect";
import { Event } from "../lib/db/models/Event";
import mongoose from "mongoose";

async function main() {
    try {
        console.log("Connecting to database...");
        await connectToDatabase();

        console.log("Checking indexes for Event collection...");
        const indexes = await Event.collection.indexes();
        console.log("Current indexes:", indexes);

        const indexName = "code_1";
        const indexExists = indexes.some(idx => idx.name === indexName);

        if (indexExists) {
            console.log(`Dropping index '${indexName}'...`);
            await Event.collection.dropIndex(indexName);
            console.log("Index dropped successfully.");
        } else {
            console.log(`Index '${indexName}' not found.`);
        }

        console.log("Done.");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

main();
