const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    console.log("post:", post);

    res.status(200).json({
      errorCode: 0,
      status: "success",
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log("Error in create method", error);
    res.status(500).json({
      errorCode: 5,
      status: "error",
      message: "Error in creating post",
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log("get_posts:", posts);

    res.status(200).json({
      errorCode: 0,
      status: "success",
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.log("Error in get method", error);
    res.status(500).json({
      errorCode: 5,
      status: "error",
      message: "Error in getting posts",
    });
  }
};

exports.createPost = createPost;
exports.getPosts = getPosts;
