 //This code was unfinished and will be worked on at a later date. Modified from code sourced at https://moodle.ara.ac.nz/mod/equella/view.php?id=1343773
import mysql from 'mysql2'

export default class dbConnectivity {
  #connection

  constructor() {
    this.#connection = null
  }

  // setter method
  set connection(value) {
    this.#connection = value
  }

  // get method
  get connection() {
    return this.#connection
  }

  createConnection(config) {
    this.#connection = mysql.createConnection(config)
  }

  connect() {
    this.#connection.connect((err) => {
      if (err) throw err
    })

    return 'Connected to a MySQL server!'
  }

  disconnect() {
    this.#connection.end((err) => {
      if (err) throw err
    })

    return 'Disconnected from the MySQL server!'
  }

  executeSqlQuery(sqlQuery) {
    this.#connection.query(sqlQuery, (err) => {
      if (err) throw err
    })

    return `Query "${sqlQuery}" executed!`
  }

  createDB(dbName) {
    this.executeSqlQuery(`CREATE DATABASE IF NOT EXISTS ${dbName}`)
    return `Database ${dbName} created!`
  }

  insertRecords(sqlQuery, records) {
    this.#connection.query(sqlQuery, [records], (err) => {
      if (err) throw err
      // console.log(result.affectedRows)
    })
  }

  getAllRecords(sqlQuery) {
    this.#connection.query(sqlQuery, (err, results) => {
      if (err) throw err
      console.log(results)
    })
  }

  dropDB(dbName) {
    this.executeSqlQuery(`DROP DATABASE ${dbName}`)
    return `Database ${dbName} dropped!`
  }
}