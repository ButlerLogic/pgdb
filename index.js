require('localenvironment')

const { EventEmitter } = require('events')
const { Pool } = require('pg')
const Utility = require('./utility')
const MustHave = require('musthave')
const mh = new MustHave()

class PostgresClient extends EventEmitter {
  constructor (cfg = {}) {
    super()

    let conn = {}

    // Make sure the DB host is identified.
    if (mh.hasAny(process.env, 'DB_HOST', 'PGHOST') || cfg.host) {
      conn.host = cfg.host || process.env.DB_HOST || process.env.PGHOST
    } else {
      conn.host = 'localhost:5432'
    }

    // If a port is specified, use it.
    if (conn.host.indexOf(':') >= 0) {
      let port = conn.host.split(':').pop()

      if (typeof port !== 'number') {
        port = parseInt(port, 10)
      }

      if (conn.port && parseInt(conn.port, 10) !== port) {
        this.emit('warning', `Port ${conn.port} was explicitly configured, which overrides the port identified in the host configuration string (port ${conn.port}). Port ${conn.port} will be used to connect to ${conn.host}.`)
      } else {
        conn.port = port
      }

      conn.host = conn.host.split(':')[0]
    }

    // Make sure the DB name is identified.
    if (mh.hasAny(process.env, 'DB', 'PGDATABASE') || cfg.database || cfg.db) {
      conn.database = cfg.db || cfg.database || process.env.DB || process.env.PGDATABASE
    } else {
      conn.database = 'postgres'
    }

    // Make sure the user is specified.
    if (mh.hasAny(process.env, 'DB_USER', 'PGUSER') || cfg.user) {
      conn.user = cfg.user || process.env.DB_USER || process.env.PGUSER
    } else {
      conn.user = 'postgres'
    }

    // Make sure the user password is specified.
    if (mh.hasAny(process.env, 'DB_PASSWORD', 'PGPASSWORD') || cfg.password) {
      conn.password = cfg.password || process.env.DB_PASSWORD || process.env.PGPASSWORD
    } else {
      conn.password = 'postgres'
    }

    conn.port = conn.port || 5432

    const me = this

    Object.defineProperties(this, {
      METADATA: Utility.privateconst({
        connection: new Pool(conn),
        host: conn.host,
        port: conn.port,
        user: conn.user,
        database: conn.database,
        pass: conn.password.replace(/./gi, '*')
      }),

      PRIVATE: Utility.privateconst({
        connected: null,
        createResultSet (rawResults) {
          let fields = rawResults.fields.map(field => field.name)

          return {
            recordcount: rawResults.rowCount,
            fields: rawResults.fields.slice(),
            command: rawResults.command,
            results: rawResults.rows.map(data => {
              let record = {}
              fields.forEach((field, index) => { record[field] = data[index] })

              return record
            })
          }
        },
        reachable () {
          if (me.PRIVATE.connected !== true) {
            me.emit('connected', `Now communicating with //${me.host}:${me.port}/${me.database}.`)
          }

          me.PRIVATE.connected = true
        },
        unreachable () {
          me.PRIVATE.connected = false
          me.emit('warning', `Cannot communicate with //${me.host}:${me.port}/${me.database}.`)
        },
        monitor: null
      })
    })

    cfg.autoconnect = cfg.hasOwnProperty('autoconnect') ? cfg.autoconnect : true

    // this.METADATA.connection.on('notice', (msg) => console.warn('notice:', msg))
    this.METADATA.connection.on('error', e => console.error(e.message))
  }

  get host () {
    return this.METADATA.host
  }

  get port () {
    return this.METADATA.port
  }

  get user () {
    return this.METADATA.user
  }

  get database () {
    return this.METADATA.database
  }

  get connectionString () {
    return `postgresql://${this.user}` + (this.METADATA.pass.length > 0 ? `:${this.METADATA.pass}` : '') + `@${this.METADATA.host}:${this.METADATA.port}/${this.METADATA.database}`
  }

  async disconnect () {
    await this.METADATA.connection.end().catch(e => {})
    this.PRIVATE.connected = false
  }

  async query (statement = 'SELECT \'No Query Statement\';', parameters = []) {
    const result = await this.METADATA.connection.query({ rowMode: 'array', text: statement }, parameters)
    // await this.METADATA.connection.end()

    return this.PRIVATE.createResultSet(result)
  }

  ping (next) {
    this.query('SELECT NOW();')
      .then(() => next(true))
      .catch(() => next(false))
  }

  monitor (interval = 15000) {
    if (this.PRIVATE.monitor === null) {
      this.PRIVATE.monitor = setInterval(() =>
        this.ping(reachable => !reachable ? this.PRIVATE.unreachable() : this.PRIVATE.reachable())
      , interval)

      this.ping(reachable => !reachable ? this.PRIVATE.unreachable() : this.PRIVATE.reachable())
    }
  }

  unmonitor () {
    if (this.PRIVATE.monitor !== null) {
      clearTimeout(this.PRIVATE.monitor)
      this.PRIVATE.monitor = null
    }
  }
}

module.exports = PostgresClient
