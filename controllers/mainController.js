const userSchema = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const { uid } = require('uid');
const { MongoClient } = require('mongodb');
const discussionSchema = require('../schemas/discussionSchema');

const client = new MongoClient(process.env.MONGO_KEY);

module.exports = {
    register: async (req, res) => {

        const { email, password } = req.body;
        const userExists = await userSchema.findOne({ email });
        if (userExists) {
            res.send({ error: true, message: 'user already exists', data: null });
            return
        }

        // JEIGU NERASTAS USERIS, REGISTRUOJAM NAUJA

        const hashedPsw = await bcrypt.hash(password, 10)
        const secret = uid(30);
        const newUser = new userSchema({ email, hashedPsw, secret });
        await newUser.save();
        res.send({ error: false, message: 'registered successfully', data: newUser })
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        const userExists = await userSchema.findOne({ email });
        if (!userExists) return res.send({ error: true, message: 'user does not exist. Please register first', data: null });
        const comparedPsw = await bcrypt.compare(password, userExists.hashedPsw)
        if (comparedPsw) res.send({ error: false, message: 'logged in ok', data: userExists })
        req.session.user = userExists.secret
    },
    authSession: (req, res) => {
        const { user } = req.session
        res.send({ error: !(!!user) })
    },
    getAllTopics: async (req, res) => {
        const con = await client.connect();
        const data = await con.db("test").collection("type12discussions-full-projects").find().toArray();
        res.send({ error: false, message: 'all topics downloaded successfully', data: data })
    },
    getSingleTopic: async (req, res) => {
        const con = await client.connect();
        const data = await con.db("test").collection("type12discussions-full-projects").findOne()
        res.send({ error: false, message: 'all topics downloaded successfully', data: data })
    },
    postNewDiscussion: async (req, res) => {
        console.log('req.body ===', req.body);
        const discussionId = req.body.topic
        console.log('discussionId ===', discussionId);
        const updatedBidHistory = await discussionSchema.findOneAndUpdate({ _id: req.body.topic }, { $push: { topics: { title: req.body.title, message: req.body.message } } });
        res.send(updatedBidHistory)
    }
}
