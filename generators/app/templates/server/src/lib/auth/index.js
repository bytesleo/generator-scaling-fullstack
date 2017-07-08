import express from 'express';
import passport from 'passport';
import User from '../../api/v1/user/user.model';
import config from '../../config';

//Call back login Social return info in req.user

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const router = express.Router();

//Passport
<% if(auth.local){ %>
if (config.oAuth.local.enabled) {
  require('./local/local.passport').setup(User, config);
  router.use('/local', require('./local').default);
}
<% } %>
<% if(auth.github){ %>
if (config.oAuth.github.enabled) {
  require('./github/github.passport').setup(User, config);
  router.use('/github', require('./github').default);
}
<% } %>
<% if(auth.twitter){ %>
if (config.oAuth.twitter.enabled) {
  require('./twitter/twitter.passport').setup(User, config);
  router.use('/twitter', require('./twitter').default);
}
<% } %>
<% if(auth.facebook){ %>
if (config.oAuth.facebook.enabled) {
  require('./facebook/facebook.passport').setup(User, config);
  router.use('/facebook', require('./facebook').default);
}
<% } %>
<% if(auth.google){ %>
if (config.oAuth.google.enabled) {
  require('./google/google.passport').setup(User, config);
  router.use('/google', require('./google').default);
}
<% } %>
<% if(auth.bitbucket){ %>
if (config.oAuth.bitbucket.enabled) {
  require('./bitbucket/bitbucket.passport').setup(User, config);
  router.use('/bitbucket', require('./bitbucket').default);
}
<% } %>
export default router;
