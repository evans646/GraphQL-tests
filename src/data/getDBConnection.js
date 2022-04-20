import mongoose from 'mongoose';
import Sequelize from 'sequelize';
import _ from 'lodash';
import casual from 'casual';



const dbUrl = 'mongodb+srv://gqlesst:TtwAN65jYgFqCaMx@cluster0.kvkhe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "CONNECTION ERROR:"));
db.once("open", () => {console.log("DATABASE CONNECTED")});


const friendSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    gender: {
        type: String
    },
    age: {
        type: Number
    },
    language: {
        type: String
    },
    email: {
        type: String
    },
    contacts: {
        type: Array
    }
});

const Friends = mongoose.model('friends', friendSchema);

// SQL
const sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: './alien.sqlite',
});

//we define the table for the alien data
const Aliens = sequelize.define('aliens', {
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    planet: { type: Sequelize.STRING },
});

//func to create new alines in the sqlite if not exist 
//start the server to check if there is no data, if not then we create 10 names inisde the db randomly
//casul allows us to craete random things
Aliens.sync({ force: true }).then(() => {
    _.times(10, (i) => {
        Aliens.create({
            firstName: casual.first_name,
            lastName: casual.last_name,
            planet: casual.word,
        });
    });
});

export { Friends, Aliens };

