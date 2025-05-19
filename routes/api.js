'use strict';
require('dotenv').config();
let mongoose = require('mongoose');

module.exports = function (app) {

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


  const issueSchema = new mongoose.Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: { type: Date, required: true },
    updated_on: { type: Date, required: true },
    created_by: { type: String, required: true },
    assigned_to: String,
    open: { type: Boolean, required: true },
    status_text: String
  });

  const IssueModel = mongoose.model("Issue", issueSchema);

  const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    issues: [issueSchema]
  });

  const ProjectModel = mongoose.model("ProjectModel", projectSchema)

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      ProjectModel.findOne({ name: project }, function (err, projectFound) {
        if (err) {
          return console.log(err);
        } else if (!projectFound) {
          return res.json("could not find the project");
        }
        let filteredIssues = projectFound.issues.filter(issue => {
          return Object.keys(req.query).every(key => {
            if (key === 'open') {
              return String(issue[key]) === String(req.query[key] === 'true');
            }
            return String(issue[key]) === String(req.query[key]);
          });
        });
        return res.json(filteredIssues);
      });


    })

    .post(function (req, res) {
      let project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json({ error: 'required field(s) missing' })
      }
      let issue = new IssueModel({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        open: true,
        status_text: req.body.status_text || ""
      });
      ProjectModel.findOne({ name: project }, function (err, projectFound) {
        if (err) {
          return console.log(err);
        }
        else if (!projectFound) {
          let newProject = new ProjectModel({ name: project, issues: [issue] });
          newProject.save(function (err, savedProject) {
            if (err) {
              return console.log(err);
            }
            return res.json(savedProject.issues[savedProject.issues.length - 1]);
          });

        }
        else {
          projectFound.issues.push(issue);
          projectFound.save(function (err, updatedProject) {
            if (err) {
              return console.log(err);
            }
            return res.json(updatedProject.issues[updatedProject.issues.length - 1]);
          });
        }
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
      let updateData = {};
      Object.keys(req.body).forEach(key => {
        if (req.body[key] != "") {
          updateData[key] = req.body[key];
        }
      });
      if (Object.keys(updateData).length == 1) {
        return res.json({ error: 'no update field(s) sent', '_id': req.body._id });
      } else if (Object.keys(updateData).length < 1) {
        return res.json({ error: 'missing _id' });
      }
      updateData["updated_on"] = new Date().toISOString();

      ProjectModel.findOne({ name: project }, function (err, projectFound) {
        if (err) {
          return console.log(err);
        }
        else if (!projectFound) {
          return res.json("could not find the project");
        }
        else {
          let issue = projectFound.issues.id(req.body._id);
          if (!issue) {
            return res.json({ error: 'could not update', '_id': req.body._id });
          }
          Object.keys(updateData).forEach(key => {
            issue[key] = updateData[key];
          });


          projectFound.save(function (err, updatedProject) {
            if (err) {
              return res.json({ error: 'could not update', '_id': req.body._id });
            }
            return res.json({ result: 'successfully updated', '_id': req.body._id });
          });


          // ProjectModel.issues.findOneByIdAndUpdate(
          //   req.body._id,
          //   updateData,
          //   { new: true },
          //   (err, updatedIssue) => {
          //     if (err || !updatedIssue) {
          //       return res.json({ error: 'could not update', '_id': req.body._id });
          //     } else if (updatedIssue) {
          //       return res.json({ result: 'successfully updated', '_id': req.body._id });
          //     }
          //   });




        }
      });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      if (!req.body._id) {
        return res.json({ error: 'missing _id' })
      }

      ProjectModel.findOne({ name: project }, function (err, projectFound) {
        if (err) {
          return console.log(err);
        }
        else if (!projectFound) {
          return res.json("could not find the project");
        }
        else {
          let issue = projectFound.issues.id(req.body._id);
          if (!issue) {
            return res.json({ error: 'could not delete', '_id': req.body._id });
          }
          issue.remove();

          projectFound.save(function (err) {
            if (err) {
              return res.json({ error: 'could not delete', '_id': req.body._id });
            }

            return res.json({ result: 'successfully deleted', '_id': req.body._id });
          });

        }

      });
    });

};
