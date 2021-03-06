const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/application");

module.exports ={

    
    getAllWikis(callback){
        return Wiki.all()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },

    
    addWiki(newWiki, callback){
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            userId:newWiki.userId,
            private: newWiki.private
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getWiki(id, callback){
        return Wiki.findById(id)
        .then((wiki) => {
            wiki.body = wiki.body.toString('utf8');
            callback(null, wiki);
        })
        .catch((err)=> {
            callback(err);
        })
    },

    deleteWiki(req, callback){

            return Wiki.findById(req.params.id)
            .then((wiki) => {
  
              const authorized = new Authorizer(req.user, wiki).destroy();
       
              if(authorized) {
                wiki.destroy()
                .then((res) => {
                  callback(null, wiki);
                });       
              } else {
                    req.flash("notice", "You are not authorized to do that.")
                    callback(401);
              }
            })
            .catch((err) => {
              callback(err);
            });
          },


    updateWiki(req, updatedWiki, callback){

      return Wiki.findById(req.params.id)
      .then((wiki) => {
        if(!wiki){
          return callback("Wiki Not Found");
        }
        const authorized = new Authorizer(req.user, wiki).update();
        
        if(authorized) {
          wiki.update(updatedWiki, {
            fields: Object.keys(updatedWiki)
          })
          .then(() => {
            callback(null, wiki);
          })
          .catch((err) => {
            callback(err);
          });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          callback("Forbidden");
        }
      })        
    },

    makePublic(id) {
      return Wiki.all()
          .then((wikis) => {
              wikis.forEach((wiki) => {
                  if (wiki.userId == id && wiki.private == true) {
                      wiki.update({
                          private: false
                      })
                  }
              })
          })
          .catch((err) => {
              console.log(err);
          })
  }
 




}