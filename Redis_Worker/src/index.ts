import express from "express";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

const redis_worker_client = createClient();
redis_worker_client.on("error", (err) => {
  console.log("error on redis worker side", err);
});

const pushToDatabase = async (submission: string) => {
  const { key, msg } = JSON.parse(submission);
  const route = await prisma.table.findFirst({
    where: {
      address: key,
    },
  });

  if (route && route !== undefined) {
    const update_route = await prisma.table.update({
      where: {
        id: route.id,
      },
      data: {
        msg: msg,
      },
    });
  } else {
    const insert_route = await prisma.table.create({
      data: {
        address: key,
        msg: msg,
      },
    });
  }
};

const worker_redis = async () => {
  try {
    await redis_worker_client.connect();
    console.log("Worker Connected to Redis -->");

    while (true) {
      console.log("Listening .....................");
      const submission = await redis_worker_client.brPop("data", 0);
      if (submission) {
        await pushToDatabase(submission?.element);
      }
    }
  } catch (error) {
    console.log("Error processing while poping out", error);
  }
};

worker_redis();
