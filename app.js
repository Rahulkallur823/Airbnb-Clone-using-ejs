if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require('express'); 
const app = express();
const port = process.env.PORT || 7777; // Using PORT environment variable or default to 7777
const path = require('path');
const methodOverride = require('method-override');
const flash = require("connect-flash");
// const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError.js');
const User = require("./models/user.js");
const ejsMate = require("ejs-mate");
const ejs = require('ejs'); 

const session = require('express-session');
const MongoStore = require('connect-mongo');

const reviewRouter = require('./routes/review.js');
const listingRouter = require('./routes/listing.js');
const userRouter = require("./routes/user.js");

// Middleware for loading environment variables
if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Mongo URL
const dburl = process.env.ATLASDB_URL;

// Connect to MongoDB
main()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });
async function main(){
  await mongoose.connect(dburl);
}
// Set view engine and views directory
app.engine("ejs", ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));



//mongoose sessions\

const store=MongoStore.create({
  mongoUrl:dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,

})
store.on("error",()=>{
  console.log("ERROR in mongo session store",err)
})
// Session configuration
app.use(session({
  store:store,
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(flash()); 

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Wildcard route handler
app.all("*", (req,res,next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
