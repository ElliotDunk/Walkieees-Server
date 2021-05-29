import mongoose from "mongoose";

export default function mongooseConfig() {
  //DB Connection
  mongoose.set("useCreateIndex", true);
  mongoose.connect(process.env.DATABASE_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  // If DB successfully connected
  mongoose.connection.on("connected", () => {
    console.log("Established Mongoose Connection");
  });
  // If DB connection throws an error
  mongoose.connection.on("error", (err) => {
    console.error("Mongoose Default Connection Error : " + err);
  });
}
