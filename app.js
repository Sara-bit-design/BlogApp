var express   = require("express"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
 app          = express(),
 bodyparser   = require("body-parser"),
 mongoose  = require("mongoose");

mongoose.connect("mongodb://localhost:27017/restful_blog_app" , {useNewUrlParser: true});

app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title: String,
	body : String,
	image: String,
	created : {type:Date, default : Date.now}
});

var Blog = mongoose.model("Blog" , blogSchema);

//Blog.create({
	//title : "Test Blog",
	//image : "https://www.telegraph.co.uk/content/dam/Travel/2018/July/Scotland-campingGettyImages-526564828.jpg",
	//body : "HELLO THIS IS A BLOG POST"
//});

//HOME
app.get("/" , function(req,res){
	res.redirect("/blogs");
});

//INDEX
app.get("/blogs", function(req,res){
	Blog.find({}, function(err,blogs){
		if(err){
			console.log("ERROR");
		} else {
			res.render("index", {blogs:blogs});
		}
	});
	
});

//NEW
app.get("/blogs/new" , function(req,res){
	res.render("new");
});

//CREATE
app.post("/blogs", function(req,res){
	console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	console.log("---------------------");
	console.log(req.body);
	Blog.create(req.body.blog , function(err,newBlog){
		if(err){
			res.render("new");
		} else{
			res.redirect("/blogs");
		}
	});
});

//SHOW
app.get("/blogs/:id" , function(req, res){
	Blog.findById(req.params.id , function(err, foundBlog){
		if(err){
			console.log(err);
		} else {
			res.render("show" , {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit" , function(req , res){
	Blog.findById(req.params.id , function(err, foundBlog) {
		if(err) {
			console.log(err);
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id" , function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , updatedBlog){
		if(err){
			console.log(err);
		} else {
			res.redirect("/blogs/"+ req.params.id );
		}
	});
});

//DESTROY ROUTE
app.delete("/blogs/:id" , function(req,res){
	Blog.findByIdAndRemove(req.params.id , function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	});

});






app.listen(3000, function(req,res){
	console.log("Server is running");
});