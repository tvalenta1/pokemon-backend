import convict from "convict";

const schema = {
  JWT_ENCRYPTION_SECRET: {
    doc: "Secret for JWT key encryption.",
    format: String,
    // In real application the value for the encryption secret would be stored in some secret storage
    default: "SuperSecret",
    env: "JWT_ENCRYPTION_SECRET"
  },
  JWT_EXPIRY: {
    doc: "Expiry of the JWT token (in seconds).",
    format: "nat",
    default: 60 * 60, //One hour
    env: "JWT_EXPIRY"
  }
};

const config = convict(schema);

config.validate({ allowed: "strict" });

export default config.getProperties();
