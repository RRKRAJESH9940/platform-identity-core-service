import mongoose from "mongoose";

const dbConnections = {
  platformOrcDB: null,
  platformIdentityDB: null,
};

const disconnectOnAppQuit = async () => {
  try {
    process.on("SIGINT", async () => {
      if (dbConnections.platformOrcDB) {
        await dbConnections.platformOrcDB.close();
      }
      console.log("platfrom ORC mongoose disconnected on app termination");
      if (dbConnections.platformIdentityDB) {
        await dbConnections.platformIdentityDB.close();
      }
      console.log("platfrom Identity mongoose disconnected on app termination");

      process.exit(0);
    });

    process.on("SIGUSR2", async () => {
      if (dbConnections.platformOrcDB) {
        await dbConnections.platformOrcDB.close();
      }
      console.log("platfrom ORC mongoose disconnected on app termination");
      if (dbConnections.platformIdentityDB) {
        await dbConnections.platformIdentityDB.close();
      }
      console.log("platfrom Identity mongoose disconnected on app termination");

      process.exit(0);
    });
  } catch (error) {
    console.log(
      "Error while trying to disconnect mongo while application closure"
    );
    console.error(error);
  }
};

export const connectDBs = async () => {
  try {
    
    const platformOrcDBConnectionString = `mongodb://${encodeURIComponent(
      process.env.PLATFORM_ORC_DB_USER
    )}:${encodeURIComponent(process.env.PLATFORM_ORC_DB_PWD)}@${process.env.PLATFORM_ORC_DB_HOST}:${
      process.env.PLATFORM_ORC_DB_PORT
    }/${process.env.PLATFORM_ORC_DB_NAME}?authSource=${process.env.PLATFORM_ORC_AUTH_SOURCE_DB}`;

    const platformOrcDBConn = mongoose.createConnection(
      platformOrcDBConnectionString,
      {}
    );

    // Using promise, so that the execution will wait till the connection gets successfully established
    await platformOrcDBConn.asPromise();
    console.log(
      `Platform Orc DB connected successfully : ${process.env.PLATFORM_ORC_DB_NAME} :: connectDBs()`
    );
    platformOrcDBConn.on("error", (err) => {
      console.error("platform Orc DB connection error:", err);
      throw err;
    });
    // initialising exportable connection variables
    dbConnections.platformOrcDB = platformOrcDBConn;

    const platformIdentityDBConnectionString = `mongodb://${encodeURIComponent(
      process.env.PLATFORM_IDENTITY_DB_USER
    )}:${encodeURIComponent(process.env.PLATFORM_IDENTITY_DB_PWD)}@${process.env.PLATFORM_IDENTITY_DB_HOST}:${
      process.env.PLATFORM_IDENTITY_DB_PORT
    }/${process.env.PLATFORM_IDENTITY_DB_NAME}?authSource=${process.env.PLATFORM_IDENTITY_AUTH_SOURCE_DB}`;

    const platformIdentityDBConn = mongoose.createConnection(
      platformIdentityDBConnectionString,
      {}
    );

    // Using promise, so that the execution will wait till the connection gets successfully established
    await platformIdentityDBConn.asPromise();
    console.log(
      `Platform Identity DB connected successfully : ${process.env.PLATFORM_ORC_DB_NAME} :: connectDBs()`
    );

    platformIdentityDBConn.on("error", (err) => {
      console.error("platform Identity DB connection error:", err);
      throw err;
    });
    // initialising exportable connection variables
    dbConnections.platformIdentityDB = platformIdentityDBConn;
    await disconnectOnAppQuit();
  } catch (error) {
    console.error("Error while connecting to DB :: connectDB()");
    console.error(error);
    throw Error(error);
  }
};

export const getPlatformOrcDBConnection = () => {
  if (!dbConnections.platformOrcDB) {
    throw new Error("platform Orc DB connection is not established.");
  }
  return dbConnections.platformOrcDB;
};

export const getPlatformIdentityDBConn = () => {
  if (!dbConnections.platformIdentityDB) {
    throw new Error("platlform Identity DB connection is not established.");
  }
  return dbConnections.platformIdentityDB;
};
