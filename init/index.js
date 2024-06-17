const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderers";
const  User = require("../models/user.js")
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const ownerId = "666c5c87df0d35d553cda265"; // Replace with the actual ObjectId of the owner

  initData.data = initData.data.map(item => ({
    ...item,
    owner: ownerId,
  }));

  try {
    await Listing.insertMany(initData.data);
    console.log("Formatted Data:", initData.data);
    console.log("Data was initialized");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

initDB();
