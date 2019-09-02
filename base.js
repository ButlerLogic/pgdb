const utility = require('./endpoint')

class Endpoint {
  constructor (cfg = {}) {
    Object.defineProperties(this, {
      Model: NGN.const(cfg.model),
      Table: NGN.const(NGN.coalesce(cfg.table, 'UNNAMED_TABLE')),
      requiredFields: NGN.const(cfg.requiredFields),
      utility: NGN.const(utility)
    })
  }

  stringify (value) {
    if (NGN.coalesce(value) === null) {
      return 'NULL'
    }

    return `'${value}'`
  }

  asInteger (value) {
    if (NGN.coalesce(value) === null) {
      return 'NULL'
    }

    return `${parseInt(value, 10)}`
  }

  SQLINSERT () {
    return 'SELECT null as record'
  }

  SQLUPDATE () {
    return 'SELECT null as record'
  }

  create (req, res) {
    res.sendStatus(501)
    // utility.validBody(req, res, ...this.requiredFields, () => {
    //   let record = new this.Model(req.body)
    //
    //   if (!record.valid) {
    //     return utility.errorResponse(res)
    //   }

      // DB.query(this.SQLINSERT(record, req.user), utility.validResult(res, (result) => {
      //   record = new this.Model(result[0])
      //
      //   let representation = record.representation
      //
      //   representation.href = `${req.protocol}://${req.get('Host')}${req.path}/${record.id}`
      //
      //   res.status(201).json(representation)
      // }))
    // })
  }

  list (req, res) {
    res.sendStatus(501)
    // DB.query(`
    //   SELECT  *
    //   FROM    ${this.Table}
    //   WHERE   seqid IS NOT NULL
    //     ${req.query.history !== 'true' ? 'AND archive_dt IS NULL' : ''}
    //     ${req.query.after ? 'AND create_dt >= \'' + (new Date(Date.parse(req.query.after)).toISOString()) + '\'' : ''}
    //     ${req.query.before ? 'AND create_dt <= \'' + (new Date(Date.parse(req.query.before)).toISOString()) + '\'' : ''};
    // `, utility.validResult(res, (result) => {
    //     let representation = []
    //     let List = new NGN.DATA.Store({
    //       model: this.Model
    //     })
    //
    //     List.load(result)
    //
    //     for (let i = 0; i < List.recordCount; i++) {
    //       let record = List.records[i]
    //       representation.push(record.data)
    //       representation[representation.length - 1].href = `${req.protocol}://${req.get('Host')}${req.path}/${record.id}`
    //     }
    //
    //     res.status(200).json(representation)
    //   }))
  }

  read (req, res) {
    res.sendStatus(501)
    // utility.validId(req, res, (id) => {
      // DB.query(`
      //   SELECT  *
      //   FROM    ${this.Table}
      //   WHERE   seqid = ${id};
      // `, utility.validResult(res, (result) => {
      //   if (result.length === 0) {
      //     return utility.errorResponse(res, 404, 'Not Found')
      //   }
      //
      //   let record = new this.Model(result[0])
      //   let representation = record.representation
      //
      //   representation.href = `${req.protocol}://${req.get('Host')}${req.path}`
      //
      //   res.status(200).json(representation)
      // }))
    // })
  }

  update (req, res) {
    res.sendStatus(501)
    // utility.validId(req, res, (id) => {
    //   utility.validBody(req, res, () => {
    //     let record = new this.Model(req.body)
    //
    //     record.id = id
    //
    //     if (!record.valid) {
    //       return utility.errorResponse(res)
    //     }
    //
    //     DB.query(this.SQLUPDATE(record, req.user), utility.validResult(res, (result) => {
    //       if (result.length === 0) {
    //         return utility.errorResponse(res, 404, 'Not Found')
    //       }
    //
    //       record = new this.Model(result[0])
    //
    //       let representation = record.data
    //
    //       representation.href = `${req.protocol}://${req.get('Host')}${req.path}`
    //
    //       res.status(200).json(representation)
    //     }))
    //   })
    // })
  }

  delete (req, res) {
    res.sendStatus(501)
    // utility.validId(req, res, (id) => {
    //   DB.query(`
    //     DELETE
    //     FROM ${this.Table}
    //     WHERE seqid = ${id};
    //
    //     SELECT *
    //     FROM ${this.Table}
    //     WHERE seqid = ${id};
    //   `, utility.validResult(res, (result) => {
    //     if (result.length === 0) {
    //       return utility.errorResponse(res, 404, 'Not Found')
    //     }
    //
    //     let record = new this.Model(result[0])
    //     let representation = record.representation
    //
    //     representation.href = `${req.protocol}://${req.get('Host')}${req.path}`
    //
    //     res.status(200).json(representation)
    //   }))
    // })
  }
}

module.exports = Endpoint
