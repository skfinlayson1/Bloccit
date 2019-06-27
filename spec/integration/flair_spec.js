const request = require("request");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;

describe("route : topics/flair", () => {

    beforeEach((done) => {

        this.topic;
        this.flair;

        sequelize.sync({force: true}).then((res) => {
            Topic.create({
                title: "Hopefully this flair works",
                description: "Guessing what Bloc means when they say 'flair'"
            })
            .then((topic) => {
                this.topic = topic;
    
                Flair.create({
                    name: "flashy",
                    color: "red",
                    topicId: this.topic.id
                })
                .then((flair) => {
                    this.flair = flair;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

    });

    describe("Get /topics/:topicId/flairs/new", () => {

        it("should render a view where we can create a new flair", (done) => {
            request.get(`${base}${this.topic.id}/flairs/new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Create Flair");
                done();
            });
        });

    });

    describe("Post /topics/:topicId/flairs/create", () => {

        it("should create a flair that is linked to 'topic'", (done) => {
            options = {
                url: `${base}${this.topic.id}/flairs/create`,
                form: {
                    name: "work please",
                    color: "blue"
                }
            };

            request.post(options, (err, res, body) => {
                Flair.findOne({where: {name: "work please"}})
                .then((flair) => {
                    expect(flair).not.toBeNull();
                    expect(flair.name).toBe("work please");
                    expect(flair.color).toBe("blue");
                    expect(flair.topicId).not.toBeNull();
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

    });

    // describe("Get /topics/:topicId/flairs/:id", () => {



    // });

    describe("Post /topics/:topicId/flairs/:id/destroy", () => {



    });

    describe("Get /topics/:topicId/flairs/:id/edit", () => {



    });

    describe("Post /topics/:topicId/flairs/:id/update", () => {



    });




});