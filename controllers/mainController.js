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
        req.session.user = email
    },
    authSession: (req, res) => {
        const { user } = req.session
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
        const updatedDiscussions = await discussionSchema.findOneAndUpdate({ _id: req.body.topic }, { $push: { topics: { title: req.body.title, message: req.body.message, author: req.body.author } } });
        res.send({ error: false, message: 'updated successfully', data: updatedDiscussions })
        const updateMessageCount = await userSchema.findOneAndUpdate({ email: req.body.fullName }, { $inc: { messages: 1 } })

    },
    getUserProfile: async (req, res) => {
        const userEmail = req.body.join("@");
        const userProfile = await userSchema.find({ email: req.body.userEmail })
        res.send({ error: false, message: 'user profile data', data: userProfile })
    },
    changeProfilePic: async (req, res) => {
        const updatePicture = await userSchema.findOneAndUpdate({ email: req.body.userEmail }, { image: req.body.image })
        res.send({ error: false, message: 'updated successfully', data: updatePicture })
    },
    getUsers: async (req, res) => {
        const allUsers = await userSchema.find()
        res.send({ error: false, message: 'updated successfully', data: allUsers })
    }
}
