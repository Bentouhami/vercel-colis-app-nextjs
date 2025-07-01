// E:\fullstack_project\NextJs_Projects\newColiApp\src\utils\swagger.ts


import {createSwaggerSpec} from 'next-swagger-doc';

export const getApiDocs = () => {
    const spec = createSwaggerSpec({
        apiFolder: 'src/app/api/v1',
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'ColiApp API Documentation',
                version: '1.0.0',
                description: 'Documentation for the ColiApp API',
                contact: {
                    name: 'ColiApp Support',
                    email: 'support@coliapp.com',
                },
            },
            servers: [
                {
                    url: '/api/v1',
                    description: 'Documentation for ColisApp API v1 ',
                },
            ],
            tags: [
                {name: 'Users', description: 'User management endpoints'},
                {name: 'Cities', description: 'City management endpoints'},
                {name: 'Countries', description: 'Country management endpoints'},
                {name: 'Agencies', description: 'Agency management endpoints'},
                {name: 'Addresses', description: 'Address management endpoints'},
                {name: 'Simulations', description: 'Simulation management endpoints'},
                {name: 'Envois', description: 'Envois management endpoints'},
                {name: 'Payment', description: 'Payment management endpoints'},
            ],
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
                schemas: {
                    RoleDto: {
                        type: 'string',
                        enum: ['CLIENT', 'SUPER_ADMIN', 'DESTINATAIRE', 'AGENCY_ADMIN', 'ACCOUNTANT'],
                        description: 'User role',
                    },

                    // Address schemas (for Cities and Countries)
                    CountryDto: {
                        type: 'object',
                        properties: {
                            id: {type: 'integer', format: 'int32', description: 'Country ID'},
                            name: {type: 'string', description: 'Country name'},
                            iso2: {type: 'string', nullable: true, description: 'ISO2 code'},
                            iso3: {type: 'string', nullable: true, description: 'ISO3 code'},
                            phonecode: {type: 'string', nullable: true, description: 'Phone code'},
                            capital: {type: 'string', nullable: true, description: 'Capital city'},
                            currency: {type: 'string', nullable: true, description: 'Currency'},
                            latitude: {type: 'string', nullable: true, description: 'Latitude'},
                            longitude: {type: 'string', nullable: true, description: 'Longitude'},
                        },
                        required: ['id', 'name'],
                    },
                    CityDto: {
                        type: 'object',
                        properties: {
                            id: {type: 'integer', format: 'int32', description: 'City ID'},
                            name: {type: 'string', description: 'City name'},
                            country: {$ref: '#/components/schemas/CountryDto', description: 'Country'},
                        },
                        required: ['id', 'name', 'country'],
                    },

                    // User schemas
                    UserAddressDto: {
                        type: 'object',
                        properties: {
                            id: {type: 'integer', format: 'int32', description: 'Address ID', nullable: true},
                            street: {type: 'string', description: 'Street name'},
                            complement: {type: 'string', nullable: true, description: 'Address complement'},
                            streetNumber: {type: 'string', nullable: true, description: 'Street number'},
                            boxNumber: {type: 'string', nullable: true, description: 'Box number'},
                            cityId: {type: 'integer', format: 'int32', description: 'City ID', nullable: true},
                            city: {$ref: '#/components/schemas/CityDto', description: 'City'},
                        },
                        required: ['street', 'city'],
                    },

                    ProfileDto: {
                        type: 'object',
                        properties: {
                            id: {type: 'integer', format: 'int32', description: 'User ID'},
                            email: {type: 'string', format: 'email', description: 'User email'},
                            firstName: {type: 'string', description: 'User first name'},
                            lastName: {type: 'string', description: 'User last name'},
                            birthDate: {type: 'string', format: 'date-time', description: 'User birth date'},
                            name: {type: 'string', description: 'User full name'},
                            phoneNumber: {type: 'string', description: 'User phone number'},
                            userAddresses: {$ref: '#/components/schemas/UserAddressDto', description: 'User address'},
                            image: {type: 'string', nullable: true, description: 'User profile image'},
                            role: {$ref: '#/components/schemas/RoleDto', description: 'User role'},
                            isVerified: {type: 'boolean', description: 'Whether the user is verified'},
                        },
                        required: ['id', 'email', 'firstName', 'lastName', 'name', 'phoneNumber', 'role', 'isVerified'],
                    },

                    // Simulations schemas
                    CreateSimulationRequestDto: {
                        type: 'object',
                        properties: {
                            userId: {type: 'integer', nullable: true},
                            destinataireId: {type: 'integer', nullable: true},
                            departureAgencyId: {type: 'integer'},
                            arrivalAgencyId: {type: 'integer'},
                            parcels: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        height: {type: 'number'},
                                        width: {type: 'number'},
                                        length: {type: 'number'},
                                        weight: {type: 'number'}
                                    }
                                }
                            },
                            totalWeight: {type: 'number'},
                            totalVolume: {type: 'number'},
                            totalPrice: {type: 'number'},
                            departureDate: {type: 'string', format: 'date-time'},
                            arrivalDate: {type: 'string', format: 'date-time'},
                            simulationStatus: {
                                type: 'string',
                                enum: ['DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
                            },
                            envoiStatus: {
                                type: 'string',
                                enum: ['PENDING', 'SENT', 'DELIVERED', 'CANCELLED', 'RETURNED']
                            }
                        },
                        required: ['departureAgencyId', 'arrivalAgencyId', 'parcels', 'totalWeight', 'totalVolume', 'totalPrice', 'departureDate', 'arrivalDate', 'simulationStatus', 'envoiStatus']
                    },
                    SimulationResponseDto: {
                        type: 'object',
                        properties: {
                            id: {type: 'integer', example: 1},
                            userId: {type: 'integer', nullable: true},
                            destinataireId: {type: 'integer', nullable: true},
                            departureCountry: {type: 'string', nullable: true},
                            departureCity: {type: 'string', nullable: true},
                            departureAgency: {type: 'string', nullable: true},
                            destinationCountry: {type: 'string', nullable: true},
                            destinationCity: {type: 'string', nullable: true},
                            destinationAgency: {type: 'string', nullable: true},
                            totalWeight: {type: 'number', example: 25.5},
                            totalVolume: {type: 'number', example: 12000},
                            totalPrice: {type: 'number', example: 75.90},
                            departureDate: {type: 'string', format: 'date-time'},
                            arrivalDate: {type: 'string', format: 'date-time'},
                            simulationStatus: {
                                type: 'string',
                                enum: ['DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
                            },
                            envoiStatus: {
                                type: 'string',
                                enum: ['PENDING', 'SENT', 'DELIVERED', 'CANCELLED', 'RETURNED']
                            },
                            parcels: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        height: {type: 'number'},
                                        width: {type: 'number'},
                                        length: {type: 'number'},
                                        weight: {type: 'number'}
                                    }
                                }
                            }
                        },
                        required: ['id', 'parcels', 'totalWeight', 'totalVolume', 'totalPrice', 'departureDate', 'arrivalDate', 'simulationStatus', 'envoiStatus']
                    },
                    // Envois schemas
                    EnvoiDto: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 42 },
                            trackingNumber: { type: 'string', example: 'BE-BRU-MA-CAS-AB1234' },
                            userId: { type: 'integer' },
                            destinataireId: { type: 'integer' },
                            simulationStatus: {
                                type: 'string',
                                enum: ['DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
                            },
                            envoiStatus: {
                                type: 'string',
                                enum: ['PENDING', 'SENT', 'DELIVERED', 'CANCELLED', 'RETURNED']
                            },
                            paid: { type: 'boolean', example: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        },
                        required: ['id', 'trackingNumber', 'userId', 'simulationStatus', 'envoiStatus', 'paid', 'createdAt']
                    }
                }
            },
            paths: {
                '/simulations': {
                    post: {
                        tags: ['Simulations'],
                        summary: 'Créer une simulation d\'envoi',
                        description: 'Crée une nouvelle simulation avec les informations nécessaires.',
                        operationId: 'createSimulation',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/CreateSimulationRequestDto'
                                    }
                                }
                            }
                        },

                        responses: {
                            201: {
                                description: 'Simulation créée avec succès',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: {
                                                    type: 'string',
                                                    example: 'Simulation successfully created'
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            400: {
                                description: 'Requête invalide',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: {
                                                    type: 'string',
                                                    example: 'Invalid request'
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            500: {
                                description: 'Erreur serveur',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: {
                                                    type: 'string',
                                                    example: 'Failed to create simulation'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        security: [{BearerAuth: []}]
                    },
                    get: {
                        tags: ['Simulations'],
                        summary: 'Lire une simulation existante (via cookie)',
                        description: 'Récupère les données d’une simulation existante en utilisant les informations contenues dans le cookie.',
                        operationId: 'getSimulationByCookie',
                        responses: {
                            200: {
                                description: 'Simulation récupérée avec succès ou aucune simulation trouvée',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                data: {$ref: '#/components/schemas/SimulationResponseDto'},
                                                success: {type: 'boolean', example: true}
                                            }
                                        }
                                    }
                                }
                            },
                            404: {
                                description: 'Simulation introuvable',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: {type: 'string', example: 'Simulation not found'}
                                            }
                                        }
                                    }
                                }
                            },
                            500: {
                                description: 'Erreur serveur',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: {
                                                    type: 'string',
                                                    example: 'Erreur serveur, impossible de récupérer la simulation'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        security: [{BearerAuth: []}]
                    },

                    put: {
                        tags: ['Simulations'],
                        summary: 'Mettre à jour une simulation après paiement',
                        description: 'Met à jour le statut d’une simulation existante (via cookie) après que le paiement a été confirmé.',
                        operationId: 'updateSimulationAfterPayment',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {$ref: '#/components/schemas/SimulationResponseDto'}
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: 'Simulation mise à jour avec succès',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: {type: 'string', example: 'Simulation updated successfully'}
                                            }
                                        }
                                    }
                                }
                            },
                            400: {
                                description: 'Requête invalide',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: {type: 'string', example: 'Missing required fields'}
                                            }
                                        }
                                    }
                                }
                            },
                            401: {
                                description: 'Utilisateur non authentifié',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: {type: 'string', example: 'Unauthorized'}
                                            }
                                        }
                                    }
                                }
                            },
                            500: {
                                description: 'Erreur interne du serveur',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: {
                                                    type: 'string',
                                                    example: 'Internal server error in simulation update'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        security: [{BearerAuth: []}]
                    }
                },
                '/envois/user/{userId}': {
                    get: {
                        tags: ['Envois'],
                        summary: 'Récupérer tous les envois d’un utilisateur (avec pagination)',
                        parameters: [
                            {
                                name: 'userId',
                                in: 'path',
                                required: true,
                                description: 'ID de l’utilisateur',
                                schema: {
                                    type: 'integer',
                                    example: 1
                                }
                            },
                            {
                                name: 'page',
                                in: 'query',
                                required: false,
                                schema: {
                                    type: 'integer',
                                    default: 1
                                }
                            },
                            {
                                name: 'limit',
                                in: 'query',
                                required: false,
                                schema: {
                                    type: 'integer',
                                    default: 5
                                }
                            }
                        ],
                        responses: {
                            200: {
                                description: 'Liste paginée des envois',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'array',
                                                    items: { $ref: '#/components/schemas/EnvoiDto' }
                                                },
                                                total: { type: 'integer', example: 22 }
                                            }
                                        }
                                    }
                                }
                            },
                            400: {
                                description: 'Requête invalide',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string', example: 'Invalid user ID' }
                                            }
                                        }
                                    }
                                }
                            },
                            500: {
                                description: 'Erreur interne du serveur',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string', example: 'Internal server error.' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        security: [{ BearerAuth: [] }]
                    }
                },
                '/envois/{id}': {
                    get: {
                        tags: ['Envois'],
                        summary: 'Récupérer un envoi par ID',
                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                description: 'ID de l’envoi',
                                schema: {
                                    type: 'integer',
                                    example: 123
                                }
                            }
                        ],
                        responses: {
                            200: {
                                description: 'Détails de l’envoi récupérés avec succès',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/EnvoiDto' }
                                    }
                                }
                            },
                            400: {
                                description: 'ID invalide',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string', example: 'Invalid envoi ID provided.' }
                                            }
                                        }
                                    }
                                }
                            },
                            404: {
                                description: 'Envoi introuvable',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string', example: 'Envoi not found.' }
                                            }
                                        }
                                    }
                                }
                            },
                            500: {
                                description: 'Erreur serveur',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string', example: 'Internal server error.' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        security: [{ BearerAuth: [] }]
                    },

                    put: {
                        tags: ['Envois'],
                        summary: 'Mettre à jour un envoi (statut post-paiement)',
                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                description: 'ID de l’envoi à mettre à jour',
                                schema: {
                                    type: 'integer',
                                    example: 123
                                }
                            }
                        ],
                        responses: {
                            200: {
                                description: 'Envoi mis à jour avec succès',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/EnvoiDto' }
                                    }
                                }
                            },
                            400: {
                                description: 'ID invalide',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string', example: 'Invalid envoi ID provided.' }
                                            }
                                        }
                                    }
                                }
                            },
                            404: {
                                description: 'Envoi introuvable',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string', example: 'Envoi not found.' }
                                            }
                                        }
                                    }
                                }
                            },
                            500: {
                                description: 'Erreur serveur',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string', example: 'Internal server error.' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        security: [{ BearerAuth: [] }]
                    }
                }

            }
        }
    });

    return spec;
};
