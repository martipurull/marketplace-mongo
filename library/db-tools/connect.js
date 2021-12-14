import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
    user: 'postgres'
})

export const testDbConnection = async () => {
    try {
        await pool.query("SELECT NOW()")
        console.log("database connection SUCCESSFUL")
    } catch (error) {
        console.log("QUERY FAILED: ", error)
    }
}





export default pool