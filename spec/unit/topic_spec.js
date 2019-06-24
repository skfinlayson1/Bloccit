const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

    beforeEach((done) => {
        this.topic;
        this.post;
        sequelize.sync({force:true}).then((res) => {
            Topic.create({
                title: "Hello",
                description: "hello world"
            })
            .then((topic) => {
                this.topic = topic;
    
                Post.create({
                    title: "Something about the world",
                    body: "it's a nice world",
                    topicId: this.topic.id
                })
                .then((post) => {
                    this.post = post;
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        })

    });

    describe("#create", () => {

        it("should create a new topic", (done) => {
            Topic.create({
                title: "Hi again",
                description: "hi"
            })
            .then((topic) => {
                expect(topic.title).toContain("Hi again");
                expect(topic.description).toContain("hi");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });


    });

    describe("#getPosts", () => {

        it("should confirm that the associated post is returned", (done) => {
            this.topic.getPosts()
            .then((post) => {
                expect(post[0].title).toBe("Something about the world");
                done();
            });
        });


    });


});