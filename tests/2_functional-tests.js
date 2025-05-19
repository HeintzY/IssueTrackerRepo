const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let test1_id1 = "";
let test2_id2 = "";

suite('Functional Tests', function () {
    suite("Write the following tests in tests/2_functional-tests.js:", function () {
        test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: "test1 issue_title",
                    issue_text: "test1 issue_text",
                    created_by: "test1 created_by",
                    assigned_to: "test1 assigned_to",
                    status_text: "test1 status_text"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, "test1 issue_title");
                    assert.equal(res.body.issue_text, "test1 issue_text");
                    assert.equal(res.body.created_by, "test1 created_by");
                    assert.equal(res.body.assigned_to, "test1 assigned_to");
                    assert.equal(res.body.status_text, "test1 status_text");
                    test1_id1 = res.body._id;
                    done();
                });

        });
        test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: "test2 issue_title",
                    issue_text: "test2 issue_text",
                    created_by: "test2 created_by"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, "test2 issue_title");
                    assert.equal(res.body.issue_text, "test2 issue_text");
                    assert.equal(res.body.created_by, "test2 created_by");
                    assert.equal(res.body.assigned_to, "");
                    assert.equal(res.body.status_text, "");
                    test2_id2 = res.body._id;
                    done();
                });

        });
        // test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
        //     chai.request(server)
        //         .post('/api/issues/test')
        //         .send({
        //             issue_title: "test3 issue_title"
        //         })
        //         .end(function (err, res) {
        //             assert.equal(res.status, 200);
        //             assert.equal(res.body, { error: 'required field(s) missing' });
        //             done();
        //         });

        // });
        test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'required field(s) missing');
                    //assert.equal(res.body, { error: 'required field(s) missing' });
                    done();
                });

        });









        test("View issues on a project: GET request to /api/issues/{project}", function (done) {
            chai.request(server)
                .get('/api/issues/test')
                .query({})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.property(res.body[0], '_id');
                    assert.property(res.body[0], 'issue_title');
                    assert.property(res.body[0], 'issue_text');
                    assert.property(res.body[0], 'created_on');
                    assert.property(res.body[0], 'updated_on');
                    assert.property(res.body[0], 'created_by');
                    assert.property(res.body[0], 'assigned_to');
                    assert.property(res.body[0], 'open');
                    assert.property(res.body[0], 'status_text');
                    assert.property(res.body[1], '_id');
                    assert.property(res.body[1], 'issue_title');
                    assert.property(res.body[1], 'issue_text');
                    assert.property(res.body[1], 'created_on');
                    assert.property(res.body[1], 'updated_on');
                    assert.property(res.body[1], 'created_by');
                    assert.property(res.body[1], 'assigned_to');
                    assert.property(res.body[1], 'open');
                    assert.property(res.body[1], 'status_text');
                    done();
                });

        });

        test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
            chai.request(server)
                .get('/api/issues/test')
                .query({
                    created_by: "test1 created_by"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    res.body.forEach(issue => {
                        assert.equal(issue.created_by, "test1 created_by");
                    });
                    done();
                });

        });
        test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
            chai.request(server)
                .get('/api/issues/test')
                .query({
                    created_by: "test1 created_by",
                    assigned_to: "test1 assigned_to"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    res.body.forEach(issue => {
                        assert.equal(issue.created_by, "test1 created_by");
                        assert.equal(issue.assigned_to, "test1 assigned_to");
                    });
                    done();
                });

        });










        test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: test1_id1,
                    issue_title: "test1 updated issue_title"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated');
                    assert.equal(res.body._id, test1_id1);
                    //assert.equal(res.body, { result: 'successfully updated', '_id': test1_id1 });
                    done();
                });
        });
        test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: test2_id2,
                    issue_title: "test2 updated issue_title",
                    issue_text: "test2 updated issue_text"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated');
                    assert.equal(res.body._id, test2_id2);
                    //assert.equal(res.body, { result: 'successfully updated', '_id': test2_id2 });
                    done();
                });
        });
        test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    //assert.equal(res.body, { error: 'missing _id' });
                    done();
                });
        });
        test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: test2_id2,
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'no update field(s) sent');
                    assert.equal(res.body._id, res.body._id);
                    //assert.equal(res.body, { error: 'no update field(s) sent', '_id': res.body._id });
                    done();
                });

        });
        test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: "bla",
                    issue_title: "bla updated issue_title"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not update');
                    assert.equal(res.body._id, "bla");
                    //assert.equal(res.body, { result: 'successfully deleted', '_id': test2_id2 });
                    done();
                });

        });






        test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: test1_id1
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully deleted');
                    assert.equal(res.body._id, test1_id1);
                    //assert.equal(res.body, { result: 'successfully deleted', '_id': test1_id1 });
                });
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: test2_id2
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully deleted');
                    assert.equal(res.body._id, test2_id2);
                    //assert.equal(res.body, { result: 'successfully deleted', '_id': test2_id2 });
                    done();
                });
        });
        test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: test2_id2
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not delete');
                    assert.equal(res.body._id, test2_id2);
                    //assert.equal(res.body, { result: 'successfully deleted', '_id': test2_id2 });
                    done();
                });
        });
        test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    //assert.equal(res.body, { error: 'missing _id' });
                    done();
                });

        });

    });

});
