require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// استدعاء المسارات
const categoryRoutes = require("./routes/categories");
const itemRoutes = require("./routes/items");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const statsRoutes = require("./routes/stats"); // ✅ استيراد مسار الإحصائيات

const app = express();
const server = http.createServer(app);

// إعداد Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      ,
      "http://localhost:3000",
      "https://server-digitalmenu.onrender.com",
      "https://dashboard-digitalmenu.onrender.com",
      "https://digitalmenu-fir6.onrender.com"
    ],
    methods: ["GET", "POST"]
  }
});

// Middleware للتوثيق
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    const jwt = require("jsonwebtoken");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      return next();
    } catch (err) {
      return next(new Error("توكن غير صالح"));
    }
  }
  next();
});

app.set("io", io);
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("🍽️ مرحباً بك في واجهة المنيو الإلكتروني API");
});

// توجيه المسارات
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes); // ✅ تفعيل مسار الإحصائيات

// بدء الخادم
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`);
  console.log(`🔌 Socket.io جاهز`);
});
