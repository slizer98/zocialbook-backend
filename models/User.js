import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import { uniqueId, urlId } from '../utils/index.js'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  usernameUrl: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase:true,
  },
  password: {
    type: String,
    required: true,
  },
  oldPasswords: [
    {
      type: String,
    },
  ],
  birthday: {
    type: Date,
  },
  location: String,
  createAt: {
    type: Date,
    required: true,
  },
  aboutMe: String,
  favoriteAuthor: String,
  profilePicture: String, 
  token: {
    type: String,
    default: () =>uniqueId(),
  },
  followers: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  challenge: {
    type: Number,
    default: 0,
  },
  books: {
    read: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
        year: Number,
      },
    ],
    reading: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
      },
    ],
    toRead: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
      },
    ],
    favorites: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
      },
    ],
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  messages: [
    {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      sendDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  annualBookGoal: Number,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    const usernameLower = this.username.toLowerCase()
    const clearUsername = usernameLower.replace(/[^a-zA-Z0-9]/g, '-')
    this.usernameUrl = urlId(clearUsername)
})

userSchema.methods.checkPassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password)
}

const User = mongoose.model('User', userSchema);

export default User;
