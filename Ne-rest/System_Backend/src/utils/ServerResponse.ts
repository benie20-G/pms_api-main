import { Response } from "express"

// Standardizes API responses for success, error, unauthorized, etc.
class ServerResponse {
    status: number
    success: boolean
    message: string
    data: any

    // Constructor to initialize response properties
    constructor(success: boolean, message: string, data: any, status: number) {
        this.status = status
        this.success = success
        this.message = message
        this.data = data
    }

    // 201 Created response
    static created(res: Response, message: string, data?: any | null) {
        return res.status(201).json(new ServerResponse(true, message, data, 201))
    }

    // 200 Success response
    static success(res: Response, message: string, data?: any | null) {
        return res.status(200).json(new ServerResponse(true, message, data, 200))
    }

    // 400 Error response
    static error(res: Response, message: string, data?: any | null) {
        return res.status(400).json(new ServerResponse(false, message, data, 400))
    }

    // 401 Unauthenticated response
    static unauthenticated(res: Response, message: string, data?: any | null) {
        return res.status(401).json(new ServerResponse(false, message, data, 401))
    }

    // 403 Unauthorized response
    static unauthorized(res: Response, message: string, data?: any | null) {
        return res.status(403).json(new ServerResponse(false, message, data, 403))
    }

}

export default ServerResponse