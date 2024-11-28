//app.js
//@ts-nocheck

//#region Requires

//#region Packages Requires
const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const flash = require("connect-flash");
//#endregion

//#region Models Requires
const Admin = require("./models/admin/admins");
const Configuration = require("./models/admin/configuration");
const CommerceType = require("./models/admin/commerceTypes");

const Category = require("./models/commerce/categories");
const Commerce = require("./models/commerce/commerces");
const Product = require("./models/commerce/products");

const Customer = require("./models/customer/customer");
const Address = require("./models/customer/directions");
const Favorite = require("./models/customer/directions");
const Order = require("./models/customer/orders");

const Delivery = require("./models/delivery/delivery");
const OrderProduct = require("./models/OrderProduct/orderProduct");
//#endregion

//#region Contexts Requires
const sequelize = require("./contexts/appContexts");
//#endregion

//#region Routers Requires
const authRouter = require("./routers/authRouter");
const adminRouter = require("./routers/adminRouter");
const customerRouter = require("./routers/customerRouter");
const deliveryRouter = require("./routers/deliveryRouter");
const commerceRouter = require("./routers/commerceRouter");
//#endregion

//#region Controllers Requires
const errorController = require("./controllers/errorController");
//#endregion

//#region Seeds requires
const createAdminSeed = require("./seeds/adminSeed");
const createDefaultConfiguration = require("./seeds/configurationSeed");
//#endregion

//#region Helpers requires
const eq = require("./helpers/eq");
//#endregion

//#endregion

const app = express();

app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
      eq: eq
    }
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
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(session({ secret: "anything", resave: true, saveUninitialized: false }));

app.use(flash());

app.use((req, res, next) => {
  const errors = req.flash("errors");
  const oks = req.flash("success");
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.errorMessages = errors;
  res.locals.hasErrorMessages = errors.length > 0;
  res.locals.okMessages = oks;
  res.locals.hasOkMessages = oks.length > 0;
  res.locals.role = req.session.role;
  next();
});

app.use(adminRouter);
app.use(commerceRouter);
app.use(deliveryRouter);
app.use(customerRouter);
app.use(authRouter);
app.use(errorController.get404);

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
    createAdminSeed();
    createDefaultConfiguration();
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
