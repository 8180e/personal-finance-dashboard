import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

interface IUserToJSON {
  id: string;
  name: string;
  email: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model<IUser, mongoose.Model<IUser & IUserToJSON>>(
  "User",
  userSchema
);

export default User;
