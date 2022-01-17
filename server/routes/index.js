const authRouter = require('./auth');
const postRouter = require('./post');

const route = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/posts', postRouter);
};

module.exports = route;
