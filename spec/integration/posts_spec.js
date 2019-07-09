const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/"; //added back slash for convenience

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("routes : posts", () => {

    beforeEach((done) => {
        this.topic;
        this.post;
        this.user;

        sequelize.sync({force: true}).then((res) => {
            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                    title: "Winter Games",
                    description: "Post your winter Games stories",
                    posts: [{
                        title: "Snowball Fighting",
                        body: "So much snow!",
                        userId: this.user.id
                    }]
                }, {
                    include: {
                        model: Post,
                        as: "posts"
                    }
                })
                .then((topic) => {
                    this.topic = topic;
                    this.post = topic.posts[0];
                    done();
                })
            })
        });

    });

    describe("Get /topics/:topicId/posts/new", () => {

        it("should render a new post form", (done) => {
            request.get(`${base}${this.topic.id}/posts/new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Post");
                done();
            });
        });
        
    });

    describe("Post /topics/:topicId/posts/create", () => {

        it("should create a new post and redirect", (done) => {

            const options = {
                url: `${base}${this.topic.id}/posts/create`,
                form: {
                    title: "Watching snow melt",
                    body: "Without a doubt my favorite thing to do besides watching paint dry."
                }
            };

            request.post(options, (err, res, body) => {
                Post.findOne({where: {title: "Watching snow melt"}})
                .then((post) => {
                    expect(post).not.toBeNull();
                    expect(post.title).toBe("Watching snow melt");
                    expect(post.body).toBe("Without a doubt my favorite thing to do besides watching paint dry.");
                    expect(post.topicId).not.toBeNull();
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

        it("should not create a new post that fails validations", (done) => {
            const options = {
                url: `${base}${this.topic.id}/posts/create`,
                form: {
                    title: "a",
                    body: "b"
                }
            };

            request.post(options, (err, res, body) => {
                Post.findOne({where: {title: "a"}})
                .then((post) => {
                    expect(post).toBeNull();
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

    });

    describe("GET /topics/:topicId/posts/:id", () => {

        it("should render a view with the selected post", (done) => {
            request.get(`${base}${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Snowball Fighting");
                done();
            });
        });
   
    });

    describe("Post /topics/:topicId/posts/:id/destroy", () => {

        it("should delete the post with the associated ID", (done) => {
            expect(this.post.id).toBe(1); //add this
            request.post(`${base}${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
                Post.findById(1)
                .then((post) => {
                    expect(err).toBeNull();
                    expect(post).toBeNull();
                    done();
                })
            });

        });

    });

    describe("Get /topics/:topicId/posts/:id/edit", () => {

        it("should render a view with an edit post form", (done) => {
            request.get(`${base}${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Post");
                expect(body).toContain("Snowball Fighting");
                done();
            });
        });

    });

    describe("POST /topics/:topicId/posts/:id/update", () => {

        it("should return a status code 302", (done) => {
          request.post({
            url: `${base}${this.topic.id}/posts/${this.post.id}/update`,
            form: {
              title: "Snowman Building Competition",
              body: "I love watching them melt slowly."
            }
          }, (err, res, body) => {
            expect(res.statusCode).toBe(302);
            done();
          });
        });
   
        it("should update the post with the given values", (done) => {
            const options = {
              url: `${base}${this.topic.id}/posts/${this.post.id}/update`,
              form: {
                title: "Snowman Building Competition",
                body: "I really enjoy the funny hats on them."
              }
            };
            request.post(options,(err, res, body) => {
   
              expect(err).toBeNull();
   
              Post.findOne({
                where: {id: this.post.id}
              })
              .then((post) => {
                expect(post.title).toBe("Snowman Building Competition");
                done();
              });
            });
        });
   
      });


});





// New layout =================================================================================================



const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/"; //added back slash for convenience

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;


describe("routes : posts", () => {

    beforeEach((done) => {

        //Before each test sweet

    });

    // Context of Admin using CRUD actions on post ----------------------------------------------------------------

    describe("Admin user CRUD", () => {

        beforeEach((done) => {

            // Create admin user for CRUD actions

        });

        describe("/topics/:topicId/posts/create", () => {

            // Admin user attempting to create a post == (should be allowed)

        });

        describe("/topics/:topicId/posts/:postId/update", () => {

            // Admin user attempting to edit/update a post == (Admin should be allowed)

        });

        describe("/topics/:topicId/posts/:postId/delete", () => {

            // Admin user attempting to delete a post == (Admin should be allowed)

        });

    });

    // Member attempting CRUD actions ------------------------------------------------------------------------------

    describe("Member user attempting CRUD actions", () => {

        beforeEach((done) => {

            // Create Memeber user for CRUD actions

        });

        describe("/topics/:topicId/posts/create", () => {

            // Member user attempting to create a post == (should be allowed)

        });

        describe("/topics/:topicId/posts/:postId/update", () => {

            // Admin/Member user attempting to edit/update a post == (Member should only be allowed if it's their post)

        });

        describe("/topics/:topicId/posts/:postId/delete", () => {

            // Admin/Member user attempting to delete a post == (Member should only be allowed if it's their post)

        });


    });

    // Guest user CRUD actions --------------------------------------------------------------------------------

    describe("Guest user attempting CRUD actions", () => {

        beforeEach((done) => {

            // visit sight as Guest

        });

        describe("/topics/:topicId/posts/:postId/show", () => {

            // Guest attempting to view post == (should be allowed)

        });

    });



});