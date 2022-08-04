import mongoose from 'mongoose';

interface IUserSchema {
    name: string,
    about: string,
    avatar: string,
}

const userSchema = new mongoose.Schema<IUserSchema>({
  name: {
    type: String,
    required: [
      function () { return true; },
      'username is required',
    ],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [
      function () { return true; },
      'about is required',
    ],
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: [
      function () { return true; },
      'avatar is required',
    ],
  },
});

// userSchema.statics.findUserByCredentials = function (email, password) {
//   return this.findOne({ "auth.email": email })
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Неправильные почта'));
//       }

//       return bcrypt.compare(password, user.auth.password)
//         .then((matched) => {
//           if (!matched) {
//             return Promise.reject(new Error('Неправильные пароль'));
//           }
//           return user;
//         });
//     });
// };

export default mongoose.model<IUserSchema>('user', userSchema);
