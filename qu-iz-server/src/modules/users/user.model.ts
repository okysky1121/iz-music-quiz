import GenerateId from '@utils/id.util';
import { Schema } from 'mongoose';
import User from './user.interface';

const UserSchema = new Schema<User>({
  id: { type: String, required: true, unique: true, default: () => GenerateId(12) },
  nickname: { type: String, required: true },
  point: { type: Number, required: true, default: 0 },
});

UserSchema.methods.getRank = async function (this: User): Promise<number> {
  return 1;
};

UserSchema.methods.getToken = async function (this: User): Promise<string> {
  const payload: JwtPayload = { id: this.id };
  return Jwt.sign(payload);
};

const UserModel = model<User>('User', UserSchema);

export default UserModel;
