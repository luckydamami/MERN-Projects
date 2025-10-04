const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/user");

passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "User Not Found!" });
      const isMatchPassword = user.comparePassword(password);

      if (isMatchPassword) return done(null, user);
      else return done(null, false, { message: "Invalid password!" });
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = passport;
