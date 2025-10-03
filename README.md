# MongoDB Assignment – Week 1

This project contains basic MongoDB operations including installation, database setup, collections, CRUD operations, aggregation pipelines, and indexing.


## 📦 Requirements

* Node.js (v14 or above)
* MongoDB installed locally or accessible via a cloud service (e.g., MongoDB Atlas)
* npm package manager


## ⚙️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/mongodb-data-layer-fundamentals-and-advanced-techniques-Wales254
   cd Assignment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   * Create a `.env` file in the root folder.
   * Add your MongoDB connection string:

     ```env
     MONGO_URI=mongodb://127.0.0.1:27017/mongo_assignment
     ```

     *(or your Atlas connection string if using MongoDB Atlas)*



## ▶️ Running the Scripts

* **Insert Data**

  ```bash
  node insert_books.js
  ```

* **Read Data**

  ```bash
  node find_books.js
  ```

* **Update Data**

  ```bash
  node update_books.js
  ```

* **Delete Data**

  ```bash
  node delete_books.js
  ```

* **Aggregation Example**

  ```bash
  node aggregate_books.js
  ```


## 📚 What’s Included

* `insert_books.js` → Inserts sample documents
* `find_books.js` → Queries documents
* `update_books.js` → Updates records
* `delete_books.js` → Deletes records
* `aggregate_books.js` → Runs aggregation pipelines


## ✅ Notes

* Ensure your MongoDB server is running before executing the scripts.
* If using MongoDB Atlas, whitelist your IP and update the connection string in `.env`.
* All outputs are logged in the terminal.



## ✍️ Author

Assignment completed by *Sydney Wesonga Walusala*

