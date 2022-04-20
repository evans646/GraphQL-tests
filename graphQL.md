the first step to creating the graphQL is by making anew folder and then, we have to initialize teh project with: npm init


Then we can install the dev dependancies with :



npm i --s-dev babel-cli babel-preset-env babel-preset-state-0


afterwards we can install our main dependancies 

npm i express express-graphql graphql  


we can add graphql by creating a schema :=>

schema.js and :

import { buildSchema } from "graphql";

then use this to build a schema :=>

import { buildSchema } from "graphql";


const schema = buildSchema(`
    type Query {
        hello: String
    }
`)

export default schema;



so we can import and use it on the index file :=>

import {schema} from './schema';
import { graphqlHTTP } from 'express-graphql';


and use them to write the endpoint :=>


const root = { hello: () => "Hi, I'm Manny"};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(8080, () => console.log('Running server on port localhost:8080/graphql'));


So teh root contains the valjue of the query response, and when you open this up in the graphiql, and send teh query:  hello 


query{
  hello
}

to get :=>

{
  "data": {
    "hello": "Hi, I'm Manny"
  }
}


BASIC GRAPHQL SCHEMAS
---------------------

To be able to make gql queries, you need to define a schema, which defines the uery type, and tehn a resolver for each api endpoint

SO we can change the old query schema to be :

const schema = buildSchema(`
    type Friend {
        id: ID
        firstName:String
        lastName:Strinng
        gender:String
        email:String
    }
`)

export default schema;


and then in order to return data from this et of schema we need to reurn a query type

const schema = buildSchema(`
    type Friend {
        id: ID
        firstName:String
        lastName:Strinng
        gender:String
        email:String
    }

    type Query{
        friend:Friend
    }
`)

Then on the index file we can now return the resolver with teh friend schema =>


const root = {friend:()=>{
    return {
        "id":352223,
       "firstName":"Jesus",
        "lastName":"Christ",
        "gender":"feamale",
        "email":"jews@mail.com"
    }
}};

It must follow the same pattern likw how it was arranged on the schema 

No we can test it with the graphiql (refresh teh page to get the new query type):


query{
  friend {
    id
    firstName
    lastName
    email
  }
}

since we are returning multiple itmes we need to add the objects, so what you ask is what will be included in the returned data =>

{
  "data": {
    "friend": {
      "id": "352223",
      "firstName": "Jesus",
      "lastName": "Christ",
      "email": "jews@mail.com"
    }
  }
}

This is the power of graphQL you can ask what you want and nothing more or less


OBJECTS TYPES AND FIELDS
-----------------------
So for every schema, we define gthe object type and a field :


const schema = buildSchema(`
    type Friend {
        id: ID
        firstName:String
        lastName:Strinng
        gender:String
        email:String
    }
`)

Firstname i sthe field and the String is trhe type of data we exxpect. So a field could be a string , an array or anotehr types of data, for example we can have an array of emails, since others  may have more than one email, what we have to do is to define the type email. 
First we define teh type we epxect with the email data :=>

  type Email {
  email : String
}

And then on the main scheam we can pass this to the email field, you can add ! to make it more obvious of the field we expect =>

const schema = buildSchema(`
    type Friend {
        id: ID
        firstName:String
        lastName:String
        gender:String
        email:[Email]!
    }
  type Email {
  email : String
}
    type Query{
        friend:Friend
    }
`)


So on the index.js, we need to speciy the data type we are expecting, the email as an array in the resolver, it could return something froma database but we have to hard code it for now by adding new emails as an array field otherwise it's not going to work out:=>

const root = {friend:()=>{
    return {
        "id":352223,
       "firstName":"Jesus",
        "lastName":"Christ",
        "gender":"feamale",
        "email":[
            {email:"me@gmail.com"},
            {email:"you@gmail.com"}
        ]
    }
}};


As you can see from above we are returning  multiple emails. 

On the query we need to specify multiple email fields as well =>

  email{
      email
    }



So now this query =>

{
  friend {
    id
    firstName
    lastName
    email{
      email
    }
  }
}


Returns this =>

{
  "data": {
    "friend": {
      "id": "352223",
      "firstName": "Jesus",
      "lastName": "Christ",
      "email": [
        {
          "email": "me@gmail.com"
        },
        {
          "email": "you@gmail.com"
        }
      ]
    }
  }
}


QUERY AND MUTATION TYPES
-----------------------

The query type is responsilbe for defining what type of data should be returned when we make the query so in the above query, we are querying for a Friend type AND then we have mutations , which is basically graphQL way of chnaging or creating new data , we can build teh mutation so users can input new data in graphQL:

    input FriendInput{
        id: ID
        firstName:String
        lastName:String
        gender:String
        email:String
    }

  This is the input type fried which basiaklly defines what the input takes, so now we need to create the a mutation type so we can use the input type to create new friends in graphQL or whatever database is connected :=>

     type Mutation {
        createFriend(input:FriendInput):Friend
    }

  This will mutate the friend input to make sure that we have all the fields before creating anew friend, so if all the fields are valid, we will retyurn the results

  We can create a temporaly db to hold the friend data :=>

  
const friendDatabase = {};

Then we can create a class to hold whatever data we have in the schema =>

class Friend {
    constructor(id, { firstName, lastName, gender, email}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.email = email;
    }
}

This is like using an internal database to hold the data on the express server while we are not connected to nay database externally s we need to create an input that will be adding the new user to teh db and returns it as well =>

  createFriend: ({input}) => {
        let id = require('crypto').randomBytes(10).toString('hex');
        friendDatabase[id] = input;
        return new Friend(id, input);
    }

  =>

  const root = { 
    friend: () => {
        return {
            "id": 5658489489,
            "firstName": "Evans",
            "lastName": "Ansong",
            "gender": "Male",
            "emails": "me@me.com"
        }
    },
    createFriend: ({input}) => {
        let id = require('crypto').randomBytes(10).toString('hex');
        friendDatabase[id] = input;
        return new Friend(id, input);
    }
};

RESOLVERS AND IT'S ROLE
-----------------------
Are functions that responds to queries and mutaions , it gives us the result of teh query

We can make resolvers seprately from teh entry file :

resolvers.js:


const friendDatabase = {};

class Friend {
    constructor(id, { firstName, lastName, gender, email}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.email = email;
    }
}

const resolvers = { 
    friend: () => {
        return {
            "id": 5658489489,
            "firstName": "Evans",
            "lastName": "Ansong",
            "gender": "Male",
            "emails": "me@me.com"
        }
    },

    createFriend: ({input}) => {
        let id = require('crypto').randomBytes(10).toString('hex');
        friendDatabase[id] = input;
        return new Friend(id, input);
    }
};


Since we have a functions that is creating anew friend, we can also create a functions to get friends from the DB =>

   getFriend: ({ id }) => {
        return new Friend(id, friendDatabase[id]);
    },


So now with this in place we have to we need ot modify the query type to get freinds and return it =>

    type Query {
        getFriend(id: ID): Friend
    }

  so now we can import and use teh reolvers in the graphQL 


  SCALAR TYPES
  ------------
  When we define a dtaa type, we need to define what type of input field it's going to take , wether it's a string, int or boolean, for exanple if we decide to add age to teh schema , it will be an int type since age is a number :

       age:Int
      isFriend:Boolean
These are some of teh main types, we can also create a custom type 


LIST OF TYPES INSIDE ANOTHER
-----------------------------

For example if we want multiple genders a schma field, we can create the type and insert it =>


    enum Gender {
        MALE
        FEMALE
        OTHER
    }

So in the friend schema, we can insert gender with an array and pass Gender to it to use the multiple enum field 

We can also have contacts whichc takes multiple data fields =>

    type Contact {
        firstName: String
        lastName: String
    }
so on the friend schema, we can pass this to it =>

   type Friend {
        id: ID
        firstName: String
        lastName: String
        gender: Gender
        email: String
        age:Int
        isFriend:Boolean
        contacts: [Contact]
    }
And we need to make sure we do the same thing for the mutation as well =>


    input FriendInput {
        id: ID
        firstName: String
        lastName: String
        gender: Gender
        email: String
        age:Int
        isFriend:Boolean
        contacts: [ContactInput]
    }

  Since the contacts field takes contactInput, we have to create it =>

     input ContactInput {
        firstName: String
        lastName: String
    }

So we need to add conatcts to the resolver class ,

class Friend {
    constructor(id, { firstName, lastName, gender, email,contacts}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.email = email;
        this.contacts = contacts
    }
}

And when we run this query :

mutation {
  createFriend(input:{
      firstName: "Evans",
      lastName: "Ansong",
      gender:MALE,
      contacts:[
      {firstName:"kim",lastName:"Ung"},
      {firstName:"Eva",lastName:"Dim"}
    ]
  }){
    id
    contacts{
      firstName
    }
  }
}


It will return => 

{
  "data": {
    "createFriend": {
      "id": "ec1008debd0b1f106ef3",
      "contacts": [
        {
          "firstName": "kim"
        },
        {
          "firstName": "Eva"
        }
      ]
    }
  }
}


To show a friend was created successfully 

USING GQL TOOLS
---------------
[https://www.npmjs.com/package/graphql-tools]

So after installing, we need to refactor the schema a bit 

by : import { makeExecutableSchema } from 'graphql-tools';

and : import { resolvers } from './resolvers';

Then instead of refering to teh schema as schema, we can name it:

const typeDefs 

to hold the data and below it , we can use the  makeExecutableSchema

to exec the schema and passs the resolvers to it and then we export teh schema only 

And we can make teh necessary changes to the resolvers 
 to create a resolver map =>

 class Friend {
    constructor(id, { firstName, lastName, gender, age, language, email, contacts }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.language = language;
        this.email = email;
        this.contacts = contacts;
    }
}

const friendDatabase = {};

// resolver map
export const resolvers = {
    Query: {
        getFriend: ({ id }) => {
            return new Friend(id, friendDatabase[id]);
        },
    },
    Mutation: {
        createFriend: ({ input }) => {
            let id = require('crypto').randomBytes(10).toString('hex');
            friendDatabase[id] = input;
            return new Friend(id, input);
        },
    },
};


Since we have used the graphql-tools to attach the reolver to the chema we wouldn't need it anymore on teh index file , just import teh scham and use it =>

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));


No we have all that it takes to add the db to GQL 


INSTALLING MONGODB FOR GRAPHQL
SET UP MONGO WITH GRAPHQL

After setting up mongo, we can add a SQLite - a lighter version of SQL

we need to install it : npm i sqlite3 sequelize lodash casual

after installing w ecan craete a new type for the db 

Assuming we have aliens vistinig the site from another planet. 

 type Alien {
        id: ID
        firstName: String
        lastName: String
        planet:Strinig
    }

so need to connect to the database 
----------------------------------

import Sequelize from 'sequelize';
import _ from 'lodash';
import casual from 'casual';



// SQL
const sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: './alien.sqlite',
});

const Aliens = sequelize.define('aliens', {
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    planetName: { type: Sequelize.STRING },
});


export { Friends, Aliens };


ADD NEW ITEMS WITH MUTATIONS
----------------------------
We need to make sure we add the items to make it conformt to the data we defined in the resolvers, so the friend must have all teh fields. 

and we can add a new friend with mutation in graphiql :

mutation {
  createFriend(input: 
    {firstName: "Evans",
      lastName: "Ansong",
      gender: MALE, 
      age:24,
      email:"jim@mail.com",
       contacts: [{firstName: "kim", lastName: "Ung"},{firstName: "Eva", lastName: "Dim"}]}
  ) {
    id
    firstName
    age
  }
}

and when we run this, we will get :


{
  "data": {
    "createFriend": {
      "id": "625f564bcbad3a5f7b6d63a1",
      "firstName": "Evans",
      "age": 24
    }
  }
}

Which means we have added teh data to the db with mutations in an easy way

UPDATE ITMES WITH MUTAIONS 
--------------------------
To do this we need ot modify the resolver, which is the function to com with the database.

So in this case update an item in the database. so we need to add the update friend resolver :

So we nadd a new itme to the resolver to update a friend in the db - 

   updateFriend: (root, { input }) => {
            return new Promise((resolve, object)=>{
                //get the id from graphQL pass it to mongo to update a friend in the db 
                Friends.findByIdAndUpdate({_id:input.id},input,{new:true},(err,friend)=>{
                    if(err) console.log(err)
                    else resolve(friend)
                })
            })

        }

so now we can define the type in teh schema in the mutation:

updateFriend(input: FriendInput): Friend
 so we run the query :

we created a new friend in mongo ;
_id
:
625f5b0beac56b367dc67d6f
firstName
:
"Ian"
lastName
:
"An"
gender
:
"FEMALE"
age
:
34
email
:
"ianan@mail.com"
contacts
:
Array
0
:
Object
firstName
:
"Nono"
lastName
:
"fitcher"
1
:
Object
firstName
:
"Diva"
lastName
:
"Dif"
__v
:
0

now we want to update the age with mutations:

mutation {
  updateFriend(input: 
    {
      id:"625f5b0beac56b367dc67d6f"
      age: 55
    }) {
    id
    age
  }
}

returns =>

{
  "data": {
    "updateFriend": {
      "id": "625f5b0beac56b367dc67d6f",
      "age": 55
    }
  }
}

And when we check mongo we can see the doc updated :

_id
:
625f5b0beac56b367dc67d6f
firstName
:
"Ian"
lastName
:
"An"
gender
:
"FEMALE"
age
:
55
email
:
"ianan@mail.com"
contacts
:
Array
__v
:
0



DELETING ITMES WITH MUTAIONS 
--------------------------

first we add the reoslver =>

 deleteFriend: (root, { id }) => {
            return new Promise(( resolve, object) => {
                Friends.remove({ _id: id }, (err) => {
                    if (err) reject(err)
                    else resolve('Successfully deleted friend')
                })
            })
        }
  and then we can define it in the schema mutation types =>

     deleteFriend(id: ID!): String

  ID! means i truly need an id otehrwise it's not going to work

  and when we run teh query =>

  mutation {
  deleteFriend(id:"625f5b0beac56b367dc67d6f"
)

returns teh message:

{
  "data": {
    "deleteFriend": "Successfully deleted friend"
  }
}

we have deleted the user from the db.


SIMPLE QUERY WITH PERSISTEANCE 
------------------------------

we make teh resolver to query friends and alians =>

 getOneFriend: (root, { id }) => {
            return new Promise(( resolve, object) => {
                Friends.findById(id, (err, friend) => {
                    if (err) reject(err)
                    else resolve(friend)
                })
            })
        },
        ///query to find all aliens, func of sqlize to find all items in the sqlite
        getAliens: () => {
            return Aliens.findAll();
        }
    },
  and the in the scheam we need to add the type:


      type Query {
        getOneFriend(id: ID): Friend
        getAliens: [Alien]
    }

So now when we start the server we will get a bunch of data inserted into teh db

when we run teh query to alines db we will get =>

query {
 getAliens{
  firstName
  lastName
  planet
}
}


QUERYING IN DEPTH
-----------------
create =>

mutation{
  createFriend(id:{
    firstName:"nii"
    lastName:"hoo"
    gender:MALE
    language:"english"
    age:32
    email:"him@mail.com"
    
  }){
    id
    firstName
    lastName
  }
}

query=>
--

query{
  getOneFriend(id:"625f669a2244411a1c4c9b86"){
    firstName
    lastName
  }
}

returns =>
{
  "data": {
    "getOneFriend": {
      "firstName": "nii",
      "lastName": "hoo"
    }
  }
}

You can make two request in one query for data :

query{
 friend: getOneFriend(id:"625f669a2244411a1c4c9b86"){
    firstName
    lastName
  }
  
  Alians:getAliens{
    firstName
    planet
  }
}

returns =>

{
  "data": {
    "friend": {
      "firstName": "nii",
      "lastName": "hoo"
    },
    "Alians": [
      {
        "firstName": "Pearlie",
        "planet": "molestias"
      },
      {
        "firstName": "Montana",
        "planet": "animi"
      },
      {
        "firstName": "Ellie",
        "planet": "dolor"
      },
      {
        "firstName": "Itzel",
        "planet": "doloremque"
      },
      {
        "firstName": "Georgiana",
        "planet": "magnam"
      },
      {
        "firstName": "Carol",
        "planet": "sit"
      },
      {
        "firstName": "Franco",
        "planet": "est"
      },
      {
        "firstName": "Fabiola",
        "planet": "quidem"
      },
      {
        "firstName": "Jerrold",
        "planet": "fugiat"
      },
      {
        "firstName": "Eulah",
        "planet": "quia"
      }
    ]
  }
}

Both the aliens and the friends data


QUERYING DATA WITH FRAGMENTS 
----------------------------

Fragments allows us to make multiple queries and specify what kind of data we wantt o return form both queries  =>

query{
 one: getOneFriend(id:"625f669a2244411a1c4c9b86"){
   ...friendFragment
  }
  
 two:getOneFriend(id:"625f669a2244411a1c4c9b86"){
     ...friendFragment
  }
}

fragment friendFragment on Friend{
  firstName
    lastName
    age
   gender
}

returns =>

{
  "data": {
    "one": {
      "firstName": "nii",
      "lastName": "hoo",
      "age": 32,
      "gender": "MALE"
    },
    "two": {
      "firstName": "nii",
      "lastName": "hoo",
      "age": 32,
      "gender": "MALE"
    }
  }
}