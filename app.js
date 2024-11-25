//@ts-nocheck
const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const flash = require("connect-flash");

const sequelize = require("./contexts/appContexts");

const puerto = 5000;
const app = express();

const homeRouter = require("./routers/homeRouter");
const authRouter = require("./routers/authRouter");

const errorController = require("./controllers/errorController");

app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

app.use(multer({ storage: fileStorage }).single("image"));

app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "anything", resave: true, saveUninitialized: false }));

app.use(flash());

app.use((req, res, next) => {
  if (!req.session) {
    return next();
  }
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  const errors = req.flash("errors");
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.errorMessages = errors;
  res.locals.hasErrorMessages = errors.length > 0;
  next();
});

app.use(authRouter);
app.use(homeRouter);
app.use(errorController.get404);

const Admin = require("./models/admin/admins");
const Configuration = require("./models/admin/configuration");
const CommerceType = require("./models/admin/commerceType");

const Category = require("./models/commerce/categorys");
const Commerce = require("./models/commerce/commerces");
const Product = require("./models/commerce/products");

const Customer = require("./models/customer/customer");
const Address = require("./models/customer/directions");
const Favorite = require("./models/customer/directions");
const Order = require("./models/customer/orders");

const Delivery = require("./models/delivery/delivery");
const OrderProduct = require("./models/OrderProduct/orderProduct");

//Customer - Address 1:n
Customer.hasMany(Address);
Address.belongsTo(Customer);

//Favorites - Customer - Commerce n:m
Customer.hasMany(Favorite);
Favorite.belongsTo(Customer);

Commerce.hasMany(Favorite);
Favorite.belongsTo(Commerce);

//Customer - Order 1:n
Customer.hasMany(Order);
Order.belongsTo(Customer);

//Address - Order 1:n
Address.hasMany(Order);
Order.belongsTo(Address);

//Commerce - Order 1:n
Commerce.hasMany(Order);
Order.belongsTo(Commerce);

//Commerce - Product 1:n
Commerce.hasMany(Product);
Product.belongsTo(Commerce);

//Commerce - Category 1:n
Commerce.hasMany(Category);
Category.belongsTo(Commerce);

//Category - Product 1:n
Category.hasMany(Product);
Product.belongsTo(Category);

//Delivery - Order 1:n
Delivery.hasMany(Order);
Order.belongsTo(Delivery);

//Order - Product n:m
Order.belongsToMany(Product, {
  through: OrderProduct,
  foreignKey: "orderId",
  as: "products",
});
Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: "productId",
  as: "orders",
});

Order.hasMany(OrderProduct);
Product.hasMany(OrderProduct);

OrderProduct.belongsTo(Order);
OrderProduct.belongsTo(Product);

//CommerceType - Commerce 1:n
CommerceType.hasMany(Commerce);
Commerce.belongsTo(CommerceType);

sequelize
  .sync()
  .then(() => {
    app.listen(puerto, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
