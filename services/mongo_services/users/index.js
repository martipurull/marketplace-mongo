/** @format */
import express from "express";
import usersSchema from "./schema.js";
import createHttpError from "http-errors";

const UserRouter = express.Router();

// create users
// link user to their blogs

UserRouter.route("/")
  .get(async (req, res, next) => {
    try {
      const user = await usersSchema.find();
      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })

  .post(async (req, res, next) => {
    try {
      const newUser = await usersSchema(req.body).save();
      res.status(201).send(newUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

UserRouter.route("/:userId")
  .get(async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const user = await usersSchema.findById(userId);
      if (user) {
        res.status(201).send(user);
      } else {
        next(
          createHttpError(404, "user with this id:", userId, "is not found")
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const edituser = await usersSchema.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      console.log(edituser);
      if (edituser) {
        res.status(201).send(edituser);
      } else {
        next(
          createHttpError(404, "user with this id:", userId, "is not found")
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    console.log("hello");
    try {
      const userId = req.params.userId;
      const deleteauthor = await usersSchema.findByIdAndDelete(userId, {
        new: true,
      });
      console.log(deleteauthor);
      if (deleteauthor) {
        res.status(204).send(deleteauthor);
      } else {
        next(createHttpError(400, "SyntaxError"));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
export default UserRouter;
