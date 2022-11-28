const userSchema = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const { uid } = require('uid');

module.exports = {
    register: async (req, res) => {
        console.log('req.body ===', req.body);

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
    },

}
