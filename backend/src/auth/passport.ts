// backend/src/auth/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../../models/User';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing Google OAuth credentials in .env");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("GoogleStrategy callback invoked");
      console.log("Profile data:", profile);
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          console.log("User not found, creating new user");
          user = await User.create({
            googleId: profile.id,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
            name: profile.displayName,
          });
          console.log("User created:", user);
        } else {
          console.log("User found:", user);
        }
        return done(null, user);
      } catch (err) {
        console.error("Error in GoogleStrategy callback:", err);
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    console.log("Deserializing user with id:", id);
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err);
  }
});

export default passport;
