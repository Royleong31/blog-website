//    Constant Declarations
const _ = require('lodash');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta.t amet, consectetur adipiscing elit. Integer a venenatis risus. Duis ac aliquam dui. Mauris vulputate odio magna. Mauris fermentum vehicula justo vel convallis. Etiam sed porta erat. Vivamus porttitor libero nec leo auctor sodales. Sed nec erat ut diam commodo dapibus nec nec enim. Integer gravida bibendum elit, a ultricies dolor molestie id. Vestibulum ac commodo est. Duis suscipit vel ligula in pretium. Cras in purus vitae massa efficitur luctus at sit amet dolor.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. ";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat.";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let posts = [];

//    Database 
mongoose.connect('mongodb+srv://admin-roy:Royl3ong@cluster0.woyal.mongodb.net/blogDB?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model('Post', postSchema);

//    Get functions

app.get('/', function (req, res) {
  
  Post.find({}, function(err, foundPosts) {
    if (!err) {
      
      res.render('home', {
        homeStartingContent: homeStartingContent,
        posts: foundPosts
      });
    }
  });
  
});

app.get('/about', (req, res) => {
  res.render('about', {
    aboutContent: aboutContent
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    contactContent: contactContent
  });
});

app.get('/compose', (req, res) => {
  res.render('compose', {});
});

app.get('/posts/:postName', (req, res) => {
  // let postName = _.lowerCase(req.params.postName);
  let postName = req.params.postName;
  
  Post.findOne({title: postName}, function(err, foundPost) {
    if (!err) {
      
      if (!foundPost) {
        res.redirect('/');
      } 
      
      else {  
        res.render('post', {
          title: foundPost.title,
          body: foundPost.content
        });
      }
    }
  });
  
  
  for (i of posts) {
    let lowerCasePostName = _.lowerCase(i.title);
    if (lowerCasePostName === postName) {
      res.render('post', {
        title: i.title,
        body: i.body
      });
    } 
  }
  
});


//    Post Functions

app.post('/compose', (req, res) => {
  const newTitle = req.body.newTitle;
  const newBody = req.body.newBody;
  const postData = new Post ({
    title: newTitle,
    content: newBody
  });
  
  postData.save();
  res.redirect('/');
});

app.post('/delete', function(req, res) {
  const postTitle = req.body.postTitle;
  
  Post.findOneAndDelete({title: postTitle}, function(err, deletedPost) {
    if (!err) {
      console.log('Successfully deleted ' + deletedPost.title);
      res.redirect('/');
    }  
  });
});



//    Listen to port

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function() {
  console.log('Server running');
});
