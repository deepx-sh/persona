export class ApiError extends Error{
    public statusCode: number;
    public success: boolean;
    public errors: unknown[];
    public data: null;

    constructor(
        statusCode: number,
        message= "Something went wrong",
        errors: unknown[] = [],
        stack=""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors
        this.data = null;

        if (stack) {
            this.stack=stack
        } else {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}