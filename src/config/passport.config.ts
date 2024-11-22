import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import UserModel from '../database/models/UserModel';
import dbConnection from '../database';

dotenv.config();

const userRepository = dbConnection.getRepository(UserModel);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('Email not provided by Google'));
        }

        let user = await userRepository.findOne({ where: { email } });

        if (!user) {
          user = userRepository.create({
            googleId: profile.id,
            email,
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
          });
          await userRepository.save(user);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
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
