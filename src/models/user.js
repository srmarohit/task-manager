const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');// if not working the you can use bcryptjs module.
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Enter Proper Email...");
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0)
                throw new Error("Enter Proper age..!");
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [{
      token : {
        type: String,
        required: true
        }
    }],
    avator: {
        type : Buffer
    }
}, {
     timestamps : true 
});

// create virtual model for User which is actually not stored in database.
userSchema.virtual('tasks', {
    ref: 'Task',  // rel with Task model
    localField: '_id',
    foreignField:'owner'
});

// this method is used to hide private data of user.
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

// this method is called from User's Instance
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY);
    user.tokens = user.tokens.concat({token : token});
    await user.save();
    return token;
}

userSchema.statics.logIn = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user)
        throw new Error("Entered Email is not registered in our database..");

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
        throw new Error("Entered password is invalid...");

    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;