var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    app = express()

    mongoose.connect("mongodb://localhost/DIU");
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(methodOverride("_method"));

    //declaring student schema
    var studentSchema = new mongoose.Schema({
    	id: String,
    	name: String,
    	dept: String
    })

    //model config based on studentSchema
    var Student = mongoose.model("Student",studentSchema);

    //home
    app.get("/",function(req,res){
    	res.redirect("/students");
    })

    //view
    app.get("/students",function(req,res){
      Student.find({},function(err,students){
        if(err){
          console.log(err);
        }else {
          res.render("index",{students:students});
        }
      })

    })

    //new student route
    app.get("/students/new", function(req,res) {
    	// body...
    	res.render("new");
    })

    //create student
    app.post("/students",function(req,res) {
    	// body...
      var id = req.body.id;
      var name = req.body.name;
      var dept = req.body.dept;
      var newStudent = {id:id, name:name, dept:dept};

      Student.create(newStudent,function(err, data){
        if (err) {
          res.render("new");
        }else {
          res.redirect("/students");
        }
      })
    })

    //view ROUTE
    app.get("/students/:id",function(req,res){
      Student.findById(req.params.id, function(err, foundStudent){
        if(err){
          res.render("/students");
        }else {
          res.render("show",{student:foundStudent});
        }
      })
    })

    //EDIT ROUTE
    app.get("/students/:id/edit",function(req,res){
      Student.findById(req.params.id, function(err, foundStudent){
        if(err){
          res.render("/students");
        }else {
          res.render("edit",{student:foundStudent});
        }
      })
    })

    //update route
    app.put("/students/:id", function(req,res){
      var id = req.body.id;
      var name = req.body.name;
      var dept = req.body.dept;
      var updateStudent = {id:id, name:name, dept:dept};

      Student.findByIdAndUpdate(req.params.id,updateStudent, function(err, updateStudent){
        if (err) {
          console.log(err);
        }else {
          res.redirect("/students")
        }
      })
    })


    //DELETE Route
  app.delete("/students/:id", function(req,res){
    //destroy the post
    Student.findByIdAndRemove(req.params.id,function(err) {
      if (err) {
      console.log(err);
    }else {
      res.redirect("/students");
    }
    })
  })


    app.listen(8080, function() {
      console.log("Server is running");
    })
