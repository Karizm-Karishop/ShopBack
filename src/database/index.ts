import { DataSource } from 'typeorm';
import config from '../config/db';

export class DbConnection {
  private static _instance: DbConnection;
  private static dbConnection = new DataSource({
    type: 'postgres',
    logging: false,
    ssl: config.ssl,
    synchronize: true,
    host: config.host,
    port: Number(config.port as string),
    username: config.username,
    password: config.password,
    database: config.name,
    migrations: [__dirname + '/migrations/'],
    entities: [__dirname + '/models/*{.js,.ts}'],
  });

  private constructor() {}

  public static get instance(): DbConnection {
    if (!this._instance) this._instance = new DbConnection();

    return this._instance;
  }

  public static get connection(): DataSource {
    return this.dbConnection;
  }

  initializeDb = async () => {
    try {
      const connection = await DbConnection.dbConnection.initialize();
      console.log('db-connection', connection.options.database);
    } catch (error) {
      console.log('db-error', error);
    }
  };

  disconnectDb = async () => {
    try {
      await DbConnection.dbConnection.destroy();
    } catch (error) {
      console.log('Failed to disconnect from the database', error);
    }
  };
}

const dbConnection = DbConnection.connection;

export default dbConnection;
