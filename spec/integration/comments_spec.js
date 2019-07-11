const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {

    beforeEach((done) => {

        this.user;
        this.topic;
        this.post;
        this.comment;

        sequelize.sync({force: true}).then((res) => {
            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                    title: "Expeditions to Alpha Centauri",
                    description: "A complilation of reports from recent visits to the star system",
                    posts: [{
                        title: "My first visit to Proxima Centauri b",
                        body: "I saw some rocks.",
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
                    this.post = this.topic.posts[0];

                    Comment.create({
                        body: "ay caramba!!!!",
                        userId: this.user.id,
                        postId: this.post.id
                    })
                    .then((comment) => {
                        this.comment = comment;
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    })
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

    });

    // Admin performing CRUD --------------------------------------------------------------------------------- 

    describe("Admin user performing CRUD operations", () => {

        beforeEach((done) => {
            const options = {
                url: 'http://localhost:3000/auth/fake',
                form: {
                    role: "admin",
                    userId: this.user.id
                }
            };

            request.get(options, (err, res, body) => {
                done();
            });
        });

        describe("/topics/:topicId/posts/:postid/comments/:commentId/destroy", () => {

            it("should allow an admin user to delete another users post", (done) => {

                Comment.findAll()
                .then((comments) => {
                    const commentLength = comments.length;
                    const uri = `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`;

                    request.post(uri, (err, res, body) => {
                        expect(err).toBeNull();
                        Comment.findAll()
                        .then((comments) => {
                            expect(comments.length).toBe(commentLength - 1);
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        })
                    })
                })

            })

        });

    });


    // Signed in user perfoming CRUD --------------------------------------------------------------------------

    describe("signed in user performing CRUD actions for Comment", () => {

        beforeEach((done) => {
            const options = {
                url: "http://localhost:3000/auth/fake",
                form: {
                    role: "member",
                    userId: this.user.id
                }
            };

            request.get(options, (err, res, body) => {
                done();
            });
        });

        describe("Post /topics/:topicId/posts/:postId/comments/create", () => {

            it("should create a new comment and redirect", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
                    form: {
                        body: "This comment is amazing!"
                    }
                };

                request.post(options, (err, res, body) => {
                    Comment.findOne({where: {body: "This comment is amazing!"}})
                    .then((comment) => {
                        expect(comment).not.toBeNull();
                        expect(comment.body).toBe("This comment is amazing!");
                        expect(comment.id).not.toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });

        });

        describe("Post /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

            it("should delete the comment with the associated ID", (done) => {
                Comment.findAll()
                .then((comments) => {
                    const commentCountBeforeDelete = comments.length;
                    const uri = `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`;

                    expect(commentCountBeforeDelete).toBe(1);

                    request.post(uri, (err, res, body) => {
                        expect(res.statusCode).toBe(302);
                        Comment.findAll()
                        .then((comments) => {
                            expect(err).toBeNull()
                            expect(comments.length).toBe(0);
                            done();
                        });
                    });

                });
            });

            it("should not allow other users to delete others posts", (done) => {
                // add new user
                // make that user attempt delete command on another's post

                this.secondUser;

                User.create({
                    email: "secondUser@yahoo.com",
                    password: "awesome"
                })
                .then((user) => {
                    this.secondUser = user;

                    Comment.findAll()
                    .then((comments) => {

                        let commentLength = comments.length
                        const uri = `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`;
                        const options = {
                            url: "http://localhost:3000/auth/fake",
                            form: {
                                role: "memeber",
                                userId: this.secondUser.id
                            }
                        };

                        request.get(options, (err, res, body) => {

                            request.post(uri, (err, res, body) => {
    
                                Comment.findAll()
                                .then((comments) => {
                                    expect(comments.length).toBe(commentLength);
                                    done();
                                });
    
                            });

                        });

                    })
                });

            })

        });

    });


    // Guest attempting CRUD actions ----------------------------------------------------------------------------

    describe("guest attempting to perform CRUD actions for Comment", () => {

        beforeEach((done) => {

            request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                    userId: 0
                }
            }, (err, res, body) => {
                done();
            });
        });

        describe("Post /topics/:topicId/posts/:postId/comments/create", () => {

            it("should not create a new comment", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
                    form: {
                        body: "This comment is amazing!"
                    }
                };

                request.post(options, (err, res, body) => {
                    Comment.findOne({where: {body: "This comment is amazing!"}})
                    .then((comment) => {
                        expect(comment).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });

        });

        describe("Post /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

            it("should not delete the comment with the associated ID", (done) => {
                Comment.findAll()
                .then((comments) => {
                    const commentCountBeforeDelete = comments.length;
                    const uri = `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`;

                    expect(commentCountBeforeDelete).toBe(1);

                    request.post(uri, (err, res, body) => {
                        Comment.findAll()
                        .then((comments) => {
                            expect(err).toBeNull();
                            expect(comments.length).toBe(commentCountBeforeDelete);
                            done();
                        });
                    });
                });
            });

        });

    });



});