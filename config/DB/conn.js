const mongoose = require("mongoose");
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.mongoDbUrl, {});
    console.log('Connected to MongoDB, JAI BAJARANG BALI JI');
  } catch (error) {
    console.log(error,"Error While connecting to database");
  }
};

connectToMongoDB();
