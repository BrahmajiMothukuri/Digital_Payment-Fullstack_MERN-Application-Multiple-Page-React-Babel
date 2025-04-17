async function insertIntoDB(db, tableName, Data, res) {
    const columnNames = Object.keys(Data);
    const columnValues = Object.values(studentInfo);
    const columnNamesPlaceHolders = columnNames.map(() => '?').join(',');

    const insertQuery = `
    INSERT INTO ${tableName} (${columnNames.join(",")})
    VALUES (${columnNamesPlaceHolders})
    `;

    try {
        await new Promise((resolve, reject) => {
            db.run(insertQuery, columnValues, (error) => {
                if (error) {
                     throw new Error({status:"404"})                     
                } else {
                    console.log(`Account Created Successfully :- ${tableName}`);
                    res.send({status:"200"})
                    resolve();
                    return {status:"200"}
                }
            });
        });
    } catch (error) {
        res.send({status:"404"})
        return {status:"404"}
    }
}
module.exports={
    insertIntoDB
}