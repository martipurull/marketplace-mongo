import fs from 'fs-extra'
import path from 'path'
import pool from './connect.js'

const createTables = async () => {
    try {
        //we read the sql file (instructions to create tables)
        const filePath = path.join(process.cwd(), 'library/db-tools/tables.sql')
        //the sql file content is returned as a buffer once we read it
        const fileContentAsBuffer = await fs.readFile(filePath)
        //we convert the sql file buffer content into a string
        const fileContentAsString = fileContentAsBuffer.toString()
        //we execute que query in postgres (passing the string with the instructions to create tables)
        await pool.query(fileContentAsString)
        console.log('Default tables created!')
    } catch (error) {
        console.log('ERROR: tables not created due to ', error)
    }
}

//this is an anonymous function to actually create the tables when the createTables.js file is invoked
(async () => {
    await createTables()
})()