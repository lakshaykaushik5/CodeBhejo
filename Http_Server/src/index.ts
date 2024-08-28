import express from "express";
import { PrismaClient } from "@prisma/client";
import { WatchError } from "redis";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.post("/:id", async (req, res) => {
  try {
    const address = req.params.id;
    const route = await prisma.route_data.findFirst({
      where: {
        address: address,
      },
    });

    console.log(route, "@@@@");

    if (route && route !== undefined) {
      res.send({
        data: {
          status: 200,
          data: route.msg,
        },
      });
    } else {
      res.send({
        data: {
          status: 200,
          Data: "New Route",
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      data: {
        status: 400,
        message: "Something went wrong",
      },
    });
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server Started at port ::::${port}`);
});
