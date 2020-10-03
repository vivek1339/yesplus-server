const express = require("express");
const http = require("http");

const hostname = "localhost";
const port = 5000;

var admin = require("firebase-admin");

var serviceAccount = require("./ServiceAccountKey.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://yesplus-webapp.firebaseio.com"
});

const db = admin.firestore();

const app = express();

const path = require("path");

var x=0;

const bodyParser = require('body-parser');
const { Http2ServerResponse } = require("http2");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


var cors = require("cors");
var cors_options = {
  origin : '*',

}
app.use(cors(cors_options));

/*const usersRouter = require('./users');
console.log("Accessing users");
app.use('/users', usersRouter);*/


app.post('/add_user',(req, res) => {
  //Call this function when sign up happens
const user_obj = req.body;
const user_data = {
  user_name: user_obj.name,
  user_email: user_obj.email,
  user_password: user_obj.password,
  user_branch: user_obj.branch,
  user_phno: user_obj.phno,
  user_type: 0,
  user_join_year: user_obj.joinyear,
};
console.log(user_data);
var temp = {
  "status" : 0 
}
return db
  .collection("user_data")
  .doc(user_data.user_email)
  .set(user_data)
  .then(() => {
    console.log("new user added");
    temp.status = 200;
    res.send(temp);
  })
  .catch(()=>{
    console.log("Unable to add user");
    temp.status = 404 ;
    res.send(temp);
  });
});

app.post('/login',(req, res) => {
  //function getuser(email) {
  //Call this to retrieve user password
  //console.log("here");
  const user_obj = req.body;
  const user_data = {
    user_email: user_obj.email,
    user_password: user_obj.password
  };
  console.log(user_data);

  db.collection("user_data")
    .doc(user_data.user_email)
    .get()
    .then(doc => {
      console.log(doc.data());  
      user_temp=doc.data();
      var user_1 = {
        "status" : 0,
        "userdata": {
          "email" : user_temp.user_email,
          "type"  : user_temp.user_type
        },
      };
      if(user_temp.user_password==user_data.user_password){
        user_1.status = 200 ;
      }
      else{
        user_1.status = 404 ;
      }
      res.send(user_1);
    })
    .catch((error) => {
      console.log(error);
      console.log("Couldn't get data");
      var user_1 = {
        "status" : 404,
        "userdata": null
      };
      res.send(user_1);
    });
});


// Write a function to display all the testimonials
// 
app.post('/add_testimonial',(req, res) => {
  const user_obj = req.body;
  const user_data = {
    user_name: user_obj.name,
    user_branch: user_obj.branch,
    user_join_year: user_obj.joinyear,
    user_experience: user_obj.experience,
    user_faculty:user_obj.faculty,
    user_batchno:user_obj.batchno
  };
  console.log(user_data);
  var temp = {
    "status" : 0
  }
  return db
    .collection("testimonial_data")
    .doc(user_data.user_name)
    .set(user_data)
    .then(() => {
      console.log("new testimonial added");
      temp.status = 200 ;
      res.send(temp);

      //res.send("Api is working");
    })
    .catch(()=>{
      console.log("Unable to add testimonial");
      temp.status = 404;
      res.send(temp);
    });    
});

app.get('/display_testimonial',(req,res)=>{
  var user_temp=[];
  var temp = {
    "status" : 0
  }
  return db
  .collection("testimonial_data")
  .get()
  .then(snap => {
      x=0;
      snap.forEach(doc => {
        console.log(doc.data());
        user_temp[x] = doc.data();
        x++;
         // console.log(doc.id);          
      });
      console.log(user_temp);
      res.send(user_temp);
  })
  .catch(()=>{
    console.log("Failed");
    temp.status = 404;
    res.send(temp);
  });
});



// Write a function to display all the testimonials
// event add+display 

// app.post('/add_event',(req, res) => {
//   const event_obj = req.body;
//   const event_data = {
//     event_name: event_obj.name,
//     event_theme: event_obj.eventtheme,
//     event_startdate: event_obj.startdate,
//     event_enddate: event_obj.enddate,
//     event_phno: event_obj.phno,
//  };
//   console.log(event_data);
//   db.collection("user_data")
//     .doc(event_obj.email)
//     .get()
//     .then(doc => {
//       console.log(doc.data());  
//       user_temp=doc.data();

//       if (user_temp.user_type  ==1){
//         return db 
//            .collection("event_data")    
//            .doc(event_data.event_name)
//            .set(event_data)
//            .then(() => {
//              console.log("new event added");
//              res.send("200");
//            })
//            .catch(()=>{
//              console.log("User is not admin");
//              res.send("403");
//            });
//           }
//        else{
//          res.send("404");
//        }

//     })
//     .catch(()=>{
//         console.log("Unable to add event");
//         res.send("404");
//     });

// });

app.post('/add_event',(req, res) => {
   const event_obj = req.body;
  const event_data = {
    event_name: event_obj.name,
    event_theme: event_obj.eventtheme,
    event_startdate: event_obj.startdate,
    event_enddate: event_obj.enddate,
    event_phno: event_obj.phno,
  };
  console.log(event_data);
  var temp = {
    "status" : 0
  }
  return db
    .collection("event_data")
    .doc(event_data.event_name)
    .set(event_data)
    .then(() => {
      console.log("new event added");
      temp.status = 200;
      res.send(temp);
    })
    .catch((e)=>{
      console.log(e);
      console.log("Unable to add event");
      temp.status = 404;
      res.send(temp);
    }); 
});


app.get('/display_event',(req,res)=>{
  var user_temp=[];
  var temp = {
    "status" : 0
  }
  return db
  .collection("event_data")
  .get()
  .then(snap => {
      x=0;
      snap.forEach(doc => {
        console.log(doc.data());
        user_temp[x] = doc.data();
        x++;
         // console.log(doc.id);          
      });
      console.log(user_temp);
      res.send(user_temp);
  })
  .catch(()=>{
 console.log("Failed");
 temp.status = 404;
    res.send(temp);
  });
});


app.use((req, res, next) => {
  console.log("got req for " + req.url);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>Express server</h1></body</html>");
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});