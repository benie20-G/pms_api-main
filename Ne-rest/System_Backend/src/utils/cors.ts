// List of allowed origins for CORS
const whitelist = [
    "http://localhost:4040",
];

// CORS options configuration
const options = {
    // Function to check if the request origin is in the whitelist
    origin: (origin: string, callback: Function) => {
        if (whitelist.indexOf(origin) !== -1) {
            // Allow the request if origin is in the whitelist
            callback(null, true);
        } else {
            // Block the request if origin is not allowed
            callback(new Error("Not allowed by CORS"));
        }
    },
    // Allowed HTTP methods
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    // Allowed headers in requests
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    // Allow credentials (cookies, authorization headers, etc.)
    credentials: true,
};

export default options;