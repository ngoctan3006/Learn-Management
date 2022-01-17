const authRouter = require('./auth');
const postRouter = require('./post');

const route = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/posts', postRouter);

    app.use('/', (req, res) => {
        res.send(
            "<div style='display:flex;justify-content:center;align-items:center;height:100vh;color:red;font-size:5rem'>Hi, I'm Tân!! ❤️❤️❤️</div>"
        );
    });
};

module.exports = route;
