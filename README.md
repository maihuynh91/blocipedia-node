heroku run sequelize db:migrate


let name='Mai'
let user = {'email':'aa@aa.com','password':'aa','role':'admin'}
callback(null,user);

function callback(err,user){
    let users = {user:user};
    console.log(`callback:${JSON.stringify(users)}`);
}


callbackShortForm(null,user);

//this is called from the queryUser as a callback to controller
function callbackShortForm(err,user){
   // let users = {user};
    //used in view template
    console.log(`callbackShortForm:${JSON.stringify( {user})}`);
}

callbackDifferentKeyValue(null,user);
function  callbackDifferentKeyValue(err,userValue){
    let users = {userKey:userValue};
    console.log(`callbackDifferentKeyValue:${JSON.stringify(users.userKey)}`);

}