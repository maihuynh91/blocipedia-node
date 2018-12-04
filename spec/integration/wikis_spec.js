const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const sequelize = require("../../src/db/models/index").sequelize;



describe("routes : wikis", () => {

    beforeEach((done) => {
        this.user;
        this.wiki;

        sequelize.sync({force: true}).then((res) => {
            User.create({
                username: "mai",
                email: "mai@example.com",
                password: "password"
            })
            .then((user) => {
                this.user = user;

                Wiki.create({
                    title: "Node JS",
                    body: "What is Node js?",
                    private: false,
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    }); /* END BEFORE EACH */

 // ADMIN USER: CREATE, READ, UPDATE, EDIT, DELETE
    
    describe(" admin user performing CRUD actions for Wiki", () => {

        beforeEach((done) => {
            User.create({
            email: "admin@example.com",
            password: "123456",
            role: 1 //for admin
            })
            .then((user) => {
            request.get({         // mock authentication
                url: "http://localhost:3000/auth/fake",
                form: {
                role: user.role,     // mock authenticate as admin user
                userId: user.id,
                email: user.email
                }
            },
                (err, res, body) => {
                done();
                });
            });
        });

    /* GET WIKI */
        describe("GET /wikis", () => {
            it("should respond with all wikis", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Wikis");
                expect(body).toContain("Node JS");
                done();
            });
            });    
        });

    /* CREATING NEW WIKI */ 

        describe("GET /wikis/new", () => {
            it("should render a new wiki form", (done) => {
                request.get(`${base}new`, (err, res, body
                    ) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Wiki");
                    done();
                });
            });
        });

    /*  CREATE */

        describe("POST /wikis/create", () => {

            const options = {
                url: `${base}create`,
                form: {
                    title: "blink-182 songs",
                    body: "What's your favorite blink-182 song?"
                }
            };

            it("should create a new wiki and redirect", (done) => {
                request.post(options, 
                    (err, res, body) => {
                    Wiki.findOne({where: {title: "blink-182 songs"}})
                        .then((wiki) => {
                            expect(res.statusCode).toBe(303);
                            expect(wiki.title).toBe("blink-182 songs");
                            expect(wiki.body).toBe("What's your favorite blink-182 song?");
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });   
                });
                });
            });
    //SHOW, DISPLAY INDIVIDUAL WIKI 
        describe("GET /wikis/:id", () => {
            it("should render a view with selected wiki", (done)=> {
                request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Node JS");
                    done();
                });
            });
        });

    // DESTROY
        describe("POST /wikis/:id/destroy", () => {
            it("should delete wiki with the associated id", (done) => {
                Wiki.all()
                .then((wikis) => {

                    const wikiCountBeforeDelete = wikis.length;

                    expect(wikiCountBeforeDelete).toBe(1); //because beforeEach we clear out all data, when we add one value, we expect it to be 1
                    request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                        Wiki.all()
                        .then((wikis) => {
                            expect(err).toBeNull();
                            expect(wikis.length).toBe(wikiCountBeforeDelete -1);
                            done();
                        })
                    });
                });
            });
        });

        //EDIT WIKI
        describe("GET /wikis/:id/edit", () => {
            it("should render a view with an edit wiki form", (done) => {
                request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Edit Wiki");
                    expect(body).toContain("Node JS");
                    done();
                });
            });
        });

        //UPDATE WIKI
        describe("POST /wikis/:id/update", () => {
            it("should update the wiki with the given values", (done) => {
                const options = {
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Node JS",
                        body: "What is Node js?"
                    }
                };
                request.post(options, 
                    (err, res, body) => {
                        expect(err).toBeNull();
                        
                        Wiki.findOne({
                            where: {id: this.wiki.id}
                        })
                        .then((wiki) => {
                            expect(wiki.title).toBe("Node JS");
                            done();
                        });
                    });       
                });
            });

    }); // END ADMIN = 1: READ, CREATE, UPDATE, EDIT, DESTROY



    });