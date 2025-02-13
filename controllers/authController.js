const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
exports.upload = upload;

const prisma = new PrismaClient();

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        imageUrl,
      },
    });

    console.log("User:", user);

    res.status(200).json({
      errorCode: 0,
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error in create method", error);
    res.status(500).json({
      errorCode: 5,
      status: "error",
      message: "Error in creating user",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        errorCode: 1,
        status: "error",
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        errorCode: 2,
        status: "error",
        message: "Invalid password",
      });
    }

    res.status(200).json({
      errorCode: 0,
      status: "success",
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log("Error in create method", error);
    res.status(500).json({
      errorCode: 5,
      status: "error",
      message: "Error in creating user",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    console.log("Users:", users);

    res.status(200).json({
      errorCode: 0,
      status: "success",
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("Error in get method", error);
    res.status(500).json({
      errorCode: 5,
      status: "error",
      message: "Error in fetching users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        errorCode: 4,
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      errorCode: 0,
      status: "success",
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error in get method", error);
    res.status(500).json({
      errorCode: 5,
      status: "error",
      message: "Error in fetching users",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    console.log("User:", user);

    res.status(200).json({
      errorCode: 0,
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error in create method", error);
    res.status(500).json({
      errorCode: 5,
      status: "error",
      message: "Error in creating user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    await prisma.post.deleteMany({
      where: {
        authorId: id,
      },
    });

    res.status(200).json({
      errorCode: 0,
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Error in create method", error);
    res.status(500).json({
      errorCode: 5,
      error: error,
      status: "error",
      message: "Error in deleting user",
    });
  }
};

exports.createUser = createUser;
exports.login = login;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
