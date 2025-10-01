// queries.js; TASK 2-5:
const { MongoClient } = require('mongodb');
const insertBooks = require('./insert_books'); // Import function

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await insertBooks();  // Populate DB using exported function
    await client.connect();  // Connect for queries
    console.log('Connected to MongoDB for queries');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);


    // TASK 2: BASIC CRUID OPERATIONS

    // 2.1 : Find all books in a specific genre
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    console.log('\n Fiction Books:', fictionBooks);

    // 2.2 : Find books published after a certain year
    const recentBooks = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    console.log('\n Books published after 1950:', recentBooks);

    // 2.3 : Find books by a specific author
    const orwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    console.log('\n Books by George Orwell:', orwellBooks);

    // 2.4 : Update price of a specific book
    const updateResult = await collection.updateOne(
      { title: 'The Hobbit' },
      { $set: { price: 20.99 } }
    );
    console.log(`\n Updated Hobbit price: ${updateResult.modifiedCount > 0 ? 'Success' : 'No changes made'}`);

    // 2.5 : Delete a book by its title
    const deleteResult = await collection.deleteOne({ title: 'Moby Dick' });
    console.log(`\n Deleted Moby Dick: ${deleteResult.deletedCount > 0 ? 'Success' : 'Not found'}`);


    // TASK 3 : ADVANCED QUERIES

    // 3.1 : Find books that are in stock and published after 2010
    const inStockRecentBooks = await collection.find(
    { in_stock: true, published_year: { $gt: 2010 } }
    ).toArray();

    console.log('\n Books in stock & published after 2010:', inStockRecentBooks);


    // 3.2 : Projection: show only title, author, price
    const projectedBooks = await collection.find({},
    { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();

    console.log('\n Projection (title, author, price):', projectedBooks);

    // 3.3 : Ascending and Descending

    // Sort books by price ascending
    const sortedAsc = await collection.find({}).sort({ price: 1 }).toArray(); // 1 = ascending
    console.log('\nBooks sorted by price (ascending):', sortedAsc);

    // Sort books by price descending
    const sortedDesc = await collection.find({}).sort({ price: -1 }).toArray();
    console.log('\nBooks sorted by price (descending):', sortedDesc);

    // 3.4: Pagination (5 books per page with limit & skip)

    const page = 2;
    const pageSize = 5;
    const paginatedBooks = await collection.find({})
    .skip((page - 1) * pageSize) // skip previous pages
    .limit(pageSize)             // only return 5
    .toArray();

    console.log(`\n Page ${page} (5 books per page):, paginatedBooks`);



    // TASK 4 : AGGRIGATION PIPELINES

    // 4.1 : Aggregation: Average price of books by genre
    const avgPriceByGenre = await collection.aggregate([
    { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } },
    { $sort: { averagePrice: -1 } }]).toArray();

    console.log("\n Average price by genre:", avgPriceByGenre);


    // 4.2 : Aggregation: Find the author with the most books
    const mostBooksByAuthor = await collection.aggregate([
    { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
    { $sort: { totalBooks: -1 } },
    { $limit: 1 } // keep only top 1
    ]).toArray();

    console.log("\n Author with the most books:", mostBooksByAuthor);


    // 4.3 : Aggregation: Group books by decade and count them
    const booksByDecade = await collection.aggregate([
    {
        $group: {
        _id: { $subtract: [ { $divide: ["$published_year", 10] }, { $mod: [ { $divide: ["$published_year", 10] }, 1 ] } ] },
        count: { $sum: 1 }
        }
    },
    {
        $project: {
        decade: { $multiply: ["$_id", 10] }, // convert group back into year range
        count: 1,
        _id: 0
        }
    },
    { $sort: { decade: 1 } }
    ]).toArray();

    console.log("\n Books grouped by decade:", booksByDecade);


    // TASK 5 : INDEXES

    // 5.1 : Create index on title (ascending order by default)
    await collection.createIndex({ title: 1 });
    console.log("Index created on 'title'");


    // 5.2 : Create compound index on author + published_year
    await collection.createIndex({ author: 1, published_year: -1 });
    console.log("Compound index created on 'author' and 'published_year'");


    // 5.3 : Query without index (will be faster after index is built)
    const explainBefore = await collection.find({ title: "1984" }).explain("executionStats");
    console.log("\n Query performance with title search:", explainBefore.executionStats);

    //  5.3 :Query using compound index
    const explainCompound = await collection.find({ author: "George Orwell", published_year: { $gt: 1900 } }).explain("executionStats");
    console.log("\n Query performance with author+year search:", explainCompound.executionStats);



  } catch (err) {
    console.error('Error running queries:', err);
  } finally {
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

runQueries();