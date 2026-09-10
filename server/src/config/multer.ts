import multer from "multer";

const storage = multer.memoryStorage()

export const csvUpload = multer({
    storage,
    limits: {
        fileSize:5*1014*1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV files are allowed"));
        }
    }
})