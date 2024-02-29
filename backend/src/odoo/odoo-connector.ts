import { createClient, createSecureClient } from 'xmlrpc';
import url from 'url';

export default class Odoo {
  config: any;
  host: string;
  port: string;
  db: string;
  username: string;
  password: string;
  secure: boolean;
  uid: number;
  url: string;

  constructor(config: any = {}) {
    this.config = config;
    const urlparts = new URL(config.url);
    this.host = urlparts.hostname;
    this.port = config.port || urlparts.port;
    this.db = config.db;
    this.username = config.username;
    this.password = config.password;
    this.secure = urlparts.protocol === 'https:';
    this.uid = 0;
  }

  //Returns an XML-RPC client based on whether the connection should be secure or not
  _getClient(path) {
    const createClientFn = this.secure ? createSecureClient : createClient;
    return createClientFn({
      host: this.host,
      port: this.port,
      path,
    });
  }

  // Wraps the XML-RPC method call in a Promise for easier asynchronous handling.
  _methodCall(client, method, params = []) {
    return new Promise((resolve, reject) => {
      client.methodCall(method, params, (err, value) => {
        if (err) {
          return reject(err);
        }
        return resolve(value);
      });
    });
  }

  // Creates a client for the common endpoint (/xmlrpc/2/common) and attempts to authenticate with the provided database, username, and password.
  // If authentication is successful, it sets the uid property for the instance.
  async connect() {
    const client = this._getClient('/xmlrpc/2/common');
    const params = [this.db, this.username, this.password, {}];

    const uid = await this._methodCall(client, 'authenticate', params).catch(
      console.error,
    );
    if (!uid) return Promise.reject('Authentication failed');
    return (this.uid = uid as any);
  }

  async execute_kw(model, method, params) {
    const client = this._getClient('/xmlrpc/2/object');
    const finalParams = [
      this.db,
      this.uid,
      this.password,
      model,
      method,
      ...params,
    ];
    try {
      const value = await this._methodCall(client, 'execute_kw', finalParams);
      return Promise.resolve(value);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
