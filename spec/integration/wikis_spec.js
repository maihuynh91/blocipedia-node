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
//GUEST DISPLAY ONLY
    describe("guest user performing CRUD actions for Wiki", () => {

        beforeEach((done) => {
          request.get(
            {
              url: 'http://localhost:3000/auth/fake',
              form: {
                userId: 0
              }
            },
            (err, res, body) => {
              done();
            });
        });
    
        describe("GET /wikis", () => {
    
          it("should return a status code 200 and all wikis", (done) => {
            request.get(base, (err, res, body) => {
              expect(res.statusCode).toBe(200);
              expect(err).toBeNull();
              expect(body).toContain("Wikis");
              expect(body).toContain("Node JS");
              done();
            });
           });
         });
    
        });

 // ADMIN USER: CREATE, READ, UPDATE, EDIT, DELETE
    
 describe("admin user performing CRUD actions for Wiki", () => {

    beforeEach((done) => {
      User.create({
        username: "admin",
        email: "admin@example.com",
        password: "123456",
        role: "admin"
      })
      .then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            username: user.username,
            role: user.role,
            userId: user.id,
            email: user.email
          }
        },
        (err, res, body) => {
          done();
        }
        );
      });
    });//End of beforeEach

    describe("GET /wikis", () => {

      it("should return a status code 200 and all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("Node JS");
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {

      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });

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
          }
        );
      });
   });

   describe("GET /wikis/:id", () => {

     it("should render a view with the selected wiki", (done) => {
       request.get(`${base}${this.wiki.id}`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Node JS");
         done();
       });
     });
   });

   describe("POST /wikis/:id/destroy", () => {

     it("should delete the wiki with the associated ID", (done) => {
     Wiki.all()
     .then((wikis) => {
       const wikiCountBeforeDelete = wikis.length;
       expect(wikiCountBeforeDelete).toBe(1);
       request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
         Wiki.all()
         .then((wikis) => {
           expect(err).toBeNull();
           expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
           done();
         })
       });
     });
   });
 });

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

 describe("POST /wikis/:id/update", () => {

  it("should update the wiki with the given values", (done) => {
     const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Node JS",
          body: "What is Node js??"
        }
      };
      request.post(options,
        (err, res, body) => {
        expect(err).toBeNull();
        Wiki.findOne({
          where: { id: this.wiki.id }
        })
        .then((wiki) => {
          expect(wiki.title).toBe("Node JS");
          done();
        });
      });
  });
});

});

//END ADMIN

//START MEMBER: STANDARD
describe("standard user performing CRUD actions for Wiki", () => {

    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: this.user.id
        }
      },
        (err, res, body) => {
          done();
        });
    });

    describe("GET /wikis", () => {

      it("should return a status code 200 and all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("Node JS");
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {

      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });

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
          }
        );
      });
   });

   describe("GET /wikis/:id", () => {

     it("should render a view with the selected wiki", (done) => {
       request.get(`${base}${this.wiki.id}`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Node JS");
         done();
       });
     });
   });

   describe("POST /wikis/:id/destroy", () => {

     it("should delete the wiki with the associated ID", (done) => {
     Wiki.all()
     .then((wikis) => {
       const wikiCountBeforeDelete = wikis.length;
       expect(wikiCountBeforeDelete).toBe(1);
       request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
         Wiki.all()
         .then((wikis) => {
           expect(err).toBeNull();
           expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
           done();
         })
       });
     });
   });
 });

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

 describe("POST /wikis/:id/update", () => {

  it("should update the wiki with the given values", (done) => {
     const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Node JS",
          body: "What is Node js??"
        }
      };
      request.post(options,
        (err, res, body) => {
        expect(err).toBeNull();
        Wiki.findOne({
          where: { id: this.wiki.id }
        })
        .then((wiki) => {
          expect(wiki.title).toBe("Node JS");
          done();
        });
      });
  });
});

});
      
  })
