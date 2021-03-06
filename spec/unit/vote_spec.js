const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Comment = require("../../src/db/models").Comment;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

const request = require("request");

describe("Vote", () => {

    beforeEach((done) => {

        this.user;
        this.topic;
        this.post;
        this.vote;

        sequelize.sync({force: true}).then((res) => {
            User.create({
                email: "starman@tesla.com",
                password: "123456"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                    title: "Expeditions to Alpha Centauri",
                    description: "A compilation of reports from recent visits to the start system",
                    posts: [{
                        title: "My first visit to Proxima Centauri b",
                        body: "I saw some rocks",
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
                        console.log(err)
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

    });

    describe("#create()", () => {

        it("should create an upvote on a post for a user", (done) => {

            Vote.create({
                value: 1,
                postId: this.post.id,
                userId: this.user.id
            })
            .then((vote) => {
                expect(vote.value).toBe(1);
                expect(vote.postId).toBe(this.post.id);
                expect(vote.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });

        });

        it("should create a downvote on a post for a user", (done) => {

            Vote.create({
                value: -1,
                postId: this.post.id,
                userId: this.user.id
            })
            .then((vote) => {
                expect(vote.value).toBe(-1);
                expect(vote.postId).toBe(this.post.id);
                expect(vote.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });

        });

        it("should not create a vote with a value greater or less than -1 or 1", (done) => {

            Vote.create({
                value: 3,
                postId: this.post.id,
                userId: this.user.id
            })
            .then((vote) => {
                console.log("an error has occured and a value not -1 or 1 has been passed");
                done();
            })
            .catch((err) => {
                expect(err).not.toBeNull();
                done();
            })

        });

        it("should not create a vote without assigned post or user", (done) => {

            Vote.create({
                value: 1
            })
            .then((vote) => {
                console.log("Wrongfully create vote withou user being signed in");
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Vote.userId cannot be null");
                expect(err.message).toContain("Vote.postId cannot be null");
                done();
            });

        });

    });

    describe("#setUser()", () => {

        it("should associate a vote and a user together", (done) => {

            Vote.create({
                value: -1,
                postId: this.post.id,
                userId: this.user.id
            })
            .then((vote) => {
                this.vote = vote;

                expect(vote.userId).toBe(this.user.id);

                User.create({
                    email: "bob@example.com",
                    password: "password"
                })
                .then((newUser) => {
                    this.vote.setUser(newUser)
                    .then((vote) => {
                        expect(vote.userId).toBe(newUser.id);
                        done();
                    })
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
            })

        });

    });

    describe("#getUser()", () => {

        it("should return the associated user", (done) => {
            Vote.create({
                value: 1,
                userId: this.user.id,
                postId: this.post.id
            })
            .then((vote) => {
                vote.getUser()
                .then((user) => {
                    expect(user.id).toBe(this.user.id);
                    done();
                })
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

    });

    describe("#setPost()", () => {

        it("should associate a post and a vote together", (done) => {
            Vote.create({
                value: -1,
                postId: this.post.id,
                userId: this.user.id
            })
            .then((vote) => {
                this.vote = vote;

                Post.create({
                    title: "Dress code on Proxima b",
                    body: "Spacesuit, space helmet, space boots, and space gloves",
                    topicId: this.topic.id,
                    userId: this.user.id
                })
                .then((newPost) => {
                    expect(this.vote.postId).toBe(this.post.id);

                    this.vote.setPost(newPost)
                    .then((vote) => {
                        expect(vote.postId).toBe(newPost.id);
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

    describe("#getPost()", () => {

        it("should return the associated post", (done) => {
            Vote.create({
                value: 1,
                userId: this.user.id,
                postId: this.post.id
            })
            .then((vote) => {
                this.comment.getPost()
                .then((post) => {
                    expect(post.title).toBe("My first visit to Proxima Centauri b");
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

    });

    describe("#getPoints", () => {

        it("should return the total points for a post", (done) => {

            Post.findById(this.post.id, {
                include: {
                    model: Vote,
                    as: "votes"
                }
            })
            .then((post) => {
                expect(post.getPoints()).toBe(1);
                done();
            });
   
        });

    });

    describe("#hasUpvoteFor()", () => {

        it("should check for an upvote for a specific user on a post", (done) => {
            Vote.create({
                value: 1,
                postId: this.post.id,
                userId: this.user.id
            })
            .then((vote) => {
                Post.findById(vote.postId, {
                    include: {
                        model: Vote,
                        as: "votes"
                    }
                })
                .then((post) => {
                    expect(post.hasUpvoteFor(this.user.id)).toBe(true);
                    done();
                });
            });
        });



    });

    describe("#hasDownvoteFor()", () => {

        it("should check for a downvote for a specific user on a post", (done) => {
            Vote.create({
                value: -1,
                postId: this.post.id,
                userId: this.user.id
            })
            .then((vote) => {
                Post.findById(vote.postId, {
                    include: {
                        model: Vote,
                        as: "votes"
                    }
                })
                .then((post) => {
                    expect(post.hasDownvoteFor(this.user.id)).toBe(true)
                    done();
                });
            });
        });



    });




});