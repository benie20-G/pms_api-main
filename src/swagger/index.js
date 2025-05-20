const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NE Parking Management System API',
            version: '1.0.0',
            description: 'API documentation for the NE Parking Management System'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 4000}`,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Error message'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'user@example.com'
                        },
                        firstName: {
                            type: 'string',
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            example: 'Doe'
                        },
                        role: {
                            type: 'string',
                            example: 'USER'
                        }
                    }
                },
                Parking: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        code: {
                            type: 'string',
                            example: 'PARK001'
                        },
                        name: {
                            type: 'string',
                            example: 'Downtown Parking'
                        },
                        totalSpaces: {
                            type: 'integer',
                            example: 100
                        },
                        availableSpaces: {
                            type: 'integer',
                            example: 50
                        },
                        location: {
                            type: 'string',
                            example: '123 Main St'
                        },
                        feePerHour: {
                            type: 'number',
                            example: 5.00
                        }
                    }
                },
                ParkingRequest: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174002'
                        },
                        status: {
                            type: 'string',
                            example: 'PENDING'
                        },
                        parkingId: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        vehicleId: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174001'
                        },
                        userId: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174003'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-03-15T10:30:00Z'
                        }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        paths: {
            '/api/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register a new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password', 'firstName', 'lastName'],
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email'
                                        },
                                        password: {
                                            type: 'string',
                                            format: 'password'
                                        },
                                        firstName: {
                                            type: 'string'
                                        },
                                        lastName: {
                                            type: 'string'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'User registered successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'User registered successfully. Please check your email for verification.'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'User already exists',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/verify': {
                post: {
                    tags: ['Auth'],
                    summary: 'Verify user email',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'token'],
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email'
                                        },
                                        token: {
                                            type: 'string'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Email verified successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Email verified successfully'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Invalid verification token',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'User not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email'
                                        },
                                        password: {
                                            type: 'string',
                                            format: 'password'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Login successful',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            token: {
                                                type: 'string',
                                                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                            },
                                            user: {
                                                $ref: '#/components/schemas/User'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Invalid credentials or unverified email',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'User not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/forgot-password': {
                post: {
                    tags: ['Auth'],
                    summary: 'Request password reset',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email'],
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Password reset instructions sent',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Password reset instructions sent to your email'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'User not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/reset-password': {
                post: {
                    tags: ['Auth'],
                    summary: 'Reset password',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'token', 'newPassword'],
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email'
                                        },
                                        token: {
                                            type: 'string'
                                        },
                                        newPassword: {
                                            type: 'string',
                                            format: 'password'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Password reset successful',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Password reset successfully'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Invalid reset token',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'User not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/parking': {
                post: {
                    tags: ['Parking'],
                    summary: 'Create a new parking location (Admin only)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['code', 'name', 'totalSpaces', 'location', 'feePerHour'],
                                    properties: {
                                        code: {
                                            type: 'string',
                                            example: 'PARK001'
                                        },
                                        name: {
                                            type: 'string',
                                            example: 'Downtown Parking'
                                        },
                                        totalSpaces: {
                                            type: 'integer',
                                            example: 100
                                        },
                                        location: {
                                            type: 'string',
                                            example: '123 Main St'
                                        },
                                        feePerHour: {
                                            type: 'number',
                                            example: 5.00
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'Parking location created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Parking'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '403': {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                get: {
                    tags: ['Parking'],
                    summary: 'Get all parking locations',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': {
                            description: 'List of parking locations',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Parking'
                                        }
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/parking/{code}': {
                get: {
                    tags: ['Parking'],
                    summary: 'Get parking location by code',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'code',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Parking location details',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Parking'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'Parking location not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                put: {
                    tags: ['Parking'],
                    summary: 'Update parking location (Admin only)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'code',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'totalSpaces', 'location', 'feePerHour'],
                                    properties: {
                                        name: {
                                            type: 'string',
                                            example: 'Downtown Parking'
                                        },
                                        totalSpaces: {
                                            type: 'integer',
                                            example: 100
                                        },
                                        location: {
                                            type: 'string',
                                            example: '123 Main St'
                                        },
                                        feePerHour: {
                                            type: 'number',
                                            example: 5.00
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Parking location updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Parking'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '403': {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'Parking location not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                delete: {
                    tags: ['Parking'],
                    summary: 'Delete parking location (Admin only)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'code',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Parking location deleted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Parking location deleted successfully'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '403': {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'Parking location not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/parking-requests': {
                post: {
                    tags: ['Parking Requests'],
                    summary: 'Create a new parking request',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['parkingId', 'vehicleId'],
                                    properties: {
                                        parkingId: {
                                            type: 'string',
                                            example: '123e4567-e89b-12d3-a456-426614174000'
                                        },
                                        vehicleId: {
                                            type: 'string',
                                            example: '123e4567-e89b-12d3-a456-426614174001'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'Parking request created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ParkingRequest'
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Invalid request or no available spaces',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/parking-requests/{id}/approve': {
                put: {
                    tags: ['Parking Requests'],
                    summary: 'Approve a parking request (Admin only)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Parking request approved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ParkingRequest'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '403': {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'Parking request not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/parking-requests/{id}/reject': {
                put: {
                    tags: ['Parking Requests'],
                    summary: 'Reject a parking request (Admin only)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Parking request rejected successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ParkingRequest'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '403': {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'Parking request not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/parking-requests/{id}/exit-request': {
                put: {
                    tags: ['Parking Requests'],
                    summary: 'Request to exit parking',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Exit request submitted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ParkingRequest'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'Parking request not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/parking-requests/{id}/exit-approve': {
                put: {
                    tags: ['Parking Requests'],
                    summary: 'Approve exit request (Admin only)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Exit request approved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ParkingRequest'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '403': {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'Parking request not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/parking-requests/{id}/payment': {
                put: {
                    tags: ['Parking Requests'],
                    summary: 'Process payment for parking',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Payment processed successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ParkingRequest'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'Parking request not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs; 