const request = require("request");
const base = "http://localhost:3000/advertisement/";

const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisement", () => {

    beforeEach((done) => {
        this.advertisement;
        sequelize.sync({force: true}).then((res) => {

            Advertisement.create({
                title: "Buy this awesome thing",
                description: "It really is awesome!"
            })
            .then((advertisement) => {
                this.advertisement = advertisement;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });

        });
    });

    describe("Get /advertisement", () => {

        it("should return status code 200 and check the contents of the body", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain('Buy this awesome thing');
                done();
            });
        });


    });

    describe("Get /adertisement/new", () => {

        it("should return the status code and check for the presence of the form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("New Advertisement");
                done();
            });
        });


    });

    describe("Get /describe/:id", () => {

        it("should render a view with a specific advertisement", (done) => {
            request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Buy this awesome thing");
                done();
            });
        });


    });

    describe("Get /describe/:id/edit", () => {

        it("should return a page that edits a specific advertisement", (done) => {
            request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Buy this awesome thing");
                done();
            })
        })


    })

    describe("Post /advertisement/create", () => {

        const dataForTable = {
            url: `${base}create`,
            form: {
                title: 'Dog Food', 
                description: 'healthy dog food'
            }
        };

        it("should create a new entry for the table 'Advertisements' and check for it's existence", (done) => {

            request.post(dataForTable, (err, res, body) => {
                Advertisement.findOne({where: {title: "Dog Food"}})
                .then((advert) => {
                    expect(res.statusCode).toBe(303);
                    expect(advert.title).toBe("Dog Food");
                    expect(advert.description).toBe("healthy dog food");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });


    });

    describe("Post /describe/:id/update", () => {

        it("should update a advertisement with new values", (done) => {

            const dataForTable = {
                url: `${base}${this.advertisement.id}/update`,
                form: {
                    title: "New title for update",
                    description: "with a new description"
                }
            };
            
            request.post(dataForTable, (err, res, body) => {
                Advertisement.findOne({where: {id: this.advertisement.id}})
                .then((advertisement) => {
                    expect(err).toBeNull();
                    expect(advertisement.title).toContain("New title for update");
                    expect(advertisement.description).toContain("with a new description");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
            })
        })


    });

    describe("Post /describe/:id/destroy", () => {

        it("should delete the specified value from the table 'Advertisements'", (done) => {
            Advertisement.all()
            .then((advert) => {
                const length = advert.length;
                expect(length).toBe(1);

                request.post(`${base}${this.advertisement.id}/destroy`, (err, req, body) => {
                    Advertisement.all()
                    .then((advert) => {
                        expect(err).toBeNull()
                        expect(advert.length).toBe(length - 1);
                        done()
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });


    });



});