module.exports = {
    user: "fsdp_login", // Replace with your SQL Server login username
    password: "fsdp_login", // Replace with your SQL Server login password
    server: "localhost",
    database: "FSDPASSIGNMENT_DB",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };