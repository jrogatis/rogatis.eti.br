'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, { Schema } from 'mongoose';

const authTypes = ['github', 'twitter', 'facebook', 'google'];

const UserSchema = new Schema({
  name: String,
  fullName: String,
  city: String,
  state: String,
  email: {
    type: String,
    lowercase: true,
    required() {
      return authTypes.indexOf(this.provider) === -1 === true;
    }
  },
  role: { type: String, default: 'user' },
  password: { type: String,
    required() {
      return authTypes.indexOf(this.provider) === -1 === true;
    }
  },
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {}
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(() => ({ name: this.name, role: this.role }));

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(() => ({ _id: this._id, role: this.role }));

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return respond(true);
    }

    return this.constructor.findOne({ email: value }).exec()
      .then(user => {
        if (user) {
          if (this.id === user.id) return respond(true);
          return respond(false);
        }
        return respond(true);
      })
      .catch(err => {
        throw err;
      });
  }, 'The specified email address is already in use.');

const validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if (!this.isModified('password')) return next();

    if (!validatePresenceOf(this.password)) {
      if (authTypes.indexOf(this.provider) === -1) {
        return next(new Error('Invalid password'));
      } else {
        return next();
      }
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) return next(saltErr);
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if (encryptErr) return next(encryptErr);
        this.password = hashedPassword;
        return next();
      });
    });
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) return this.password === this.encryptPassword(password);

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    const defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    } else {
      throw new Error('Missing Callback');
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null;
      } else {
        return callback('Missing password or salt');
      }
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, 'base64');
    const digest = 'sha512';

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, digest)
        .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, digest, (err, key) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, key.toString('base64'));
      }
    });
  }
};

export default mongoose.model('User', UserSchema);
