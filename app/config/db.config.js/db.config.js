module.exports = {
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://neondb_owner:npg_Ag4BlE6ZyROh@ep-flat-frost-axf8kb8i-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};