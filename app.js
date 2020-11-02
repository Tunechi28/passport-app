const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

//passport bconfig
require("./config/passport")(passport);

//EJS
app.use(express.static("public"));
app.use(expressLayouts);
app.set("view engine", "ejs");

//body parser

app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: false }));

//express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//passport middlewaree
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global var
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//routers
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

mongoose.connect("mongodb://localhost/passportapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to mongoose"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
