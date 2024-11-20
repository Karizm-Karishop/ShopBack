import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../database/models/UserModel';
import dbConnection from '../database';

const userRepository = dbConnection.getRepository(UserModel);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userRepository.findOne({ where: { googleId: profile.id } });
        
        if (!user) {
          user = userRepository.create({
            googleId: profile.id,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile.emails?.[0].value,
            profile_picture: profile.photos?.[0].value,
          });
          await userRepository.save(user);
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await userRepository.findOne({ where: { user_id: id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
