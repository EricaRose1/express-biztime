const request = require("supertest");

const app = require("../app");
const { createData } = require("../test-common");
const db = require("../db");

beforeEach(createData);

afterAll(async () => {
    await db.end()
});

describe("GET/", function () {
    test("Respond with array of companies", async function() {
        const resp = await request(app).get("/companies");
        expect(resp.body).toEqual({
            "companies": [
                {code: "apple", name: "Apple"},
                {code: "ibm", name: "IBM"},
            ]
        });
    })
});

describe("GET/apple", function() {
    test("Return company info", async function() {
        const resp = await request(app).get("/companies/apple");
        expect(resp.body).toEqual({
            "company": {
                code: "apple",
                name: "Apple",
                description: "maker of OSX.",
                invoices: [1, 2],
            }
        });
    });
    test("Return 404 for no Company", async function() {
        const resp = await request(app).get('/companies/blargh');
        expect(resp.status).toEqual(404);
    })
});

describe("Post /", function () {
    test('Add Company', async function() {
        const resp = await request(app)
        .post("/companies")
        .send({name: "Pst, Yummy", description: "eh.."});
    expect(resp.body).toEqual(
        {
            "company": {
                code: "pst, yummy",
                name: "Pst, Yummy",
                description: "eh.."
            }
        }
    );
    })

    test("Return 500", async function() {
        const resp = await request(app)
        .post("/companies")
        .send({name: "Apple", description: "Huh?"});
    expect(resp.status).toEqual(500);
    })
});

describe("PUT/", function () {
    test('Update Company', async function() {
        const resp = await request(app)
        .post("/companies/apple")
        .send({name: "AppleEdit", description: "updatedDescription"});
    expect(resp.body).toEqual(
        {
            "company": {
                code: "apple",
                name: "AppleEdit",
                description: "updatedDescription"
            }
        }
    );
    })

    test("Return 404 no Company", async function() {
        const resp = await request(app)
        .post("/companies/blargh")
        .send({name: "Blargh"});
    expect(resp.status).toEqual(404);
    })

    test("Return 500 missing info", async function() {
        const resp = await request(app)
        .post("/companies/apple")
        .send({});
    expect(resp.status).toEqual(500);
    })
});


describe("DELETE/", function () {
    test("Return 500 missing info", async function() {
        const resp = await request(app)
        .delete("/companies/apple")
    expect(resp.body).toEqual({"status": "deleted"});
    })

    test("Return 404 No company", async function() {
        const resp = await request(app)
        .delete("/companies/blargh")
    expect(resp.status).toEqual(404);
    });
});
