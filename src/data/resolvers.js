import {Friends,Aliens} from './getDBConnection';

// class Friend {
//     constructor(id, { firstName, lastName, gender, age, email, contacts }) {
//         this.id = id;
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.gender = gender;
//         this.age = age;
//         this.email = email;
//         this.contacts = contacts;
//     }
// }

// const friendDatabase = {};

// resolver map
export const resolvers = { 
    // Query: {
    //     getFriend: ({ id }) => {
    //         return new Friend(id, friendDatabase[id]);
    //     },
    // },

    //query to get one friend
    Query: {
        getOneFriend: (root, { id }) => {
            return new Promise(( resolve, object) => {
                Friends.findById(id, (err, friend) => {
                    if (err) reject(err)
                    else resolve(friend)
                })
            })
        },
        ///query to find all aliens, func of squelize to find all items in the sqlite
        getAliens: () => {
            return Aliens.findAll();
        }
    },
    Mutation: {
        createFriend: (root, { input }) => {
            const newFriend = new Friends({
                firstName: input.firstName,
                lastName: input.lastName,
                gender: input.gender,
                language:input.language,
                age: input.age,
                email: input.email,
                contacts:input.contacts
            });

            newFriend.id = newFriend._id;

            return new Promise((resolve, object) => {
                newFriend.save((err) => {
                    if (err) reject(err)
                    else resolve(newFriend)
                })
            })
        },
        updateFriend: (root, { input }) => {
            return new Promise((resolve, object)=>{
                //get the id from graphQL pass it to mongo to update a friend in the db 
                Friends.findByIdAndUpdate({_id:input.id},input,{new:true},(err,friend)=>{
                    if(err) console.log(err)
                    else resolve(friend)
                })
            })
        },
        deleteFriend: (root, { id }) => {
            return new Promise(( resolve, object) => {
                Friends.remove({ _id: id }, (err) => {
                    if (err) reject(err)
                    else resolve('Successfully deleted friend')
                })
            })
        }
    },
};
