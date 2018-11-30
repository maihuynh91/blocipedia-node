module.exports = {
   //takes the Express instance when called and mounts the middleware and the 
   //route needed for our fake authorization endpoint. 
    fakeIt(app){
        let role, id, email;

        function middleware(req, res, next){
            role =  req.body.role || role;
            id = req.body.id || id;
            email = req.body.email || email;

 //Passport loads the authenticated user in req.user           
            if(id && id !=0){
                req.user = {
                    "id": id,
                    "email": email,
                    "role": role
                };
            }
             else if (id == 0){
                delete req.user;
            }
             if(next){next()}      
        }

        function route(req, res){
            res.redirect("/")
        }

        app.use(middleware);
        app.get("/auth/fake", route)

    }
}