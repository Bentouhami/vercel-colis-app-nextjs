import {NextRequest, NextResponse} from 'next/server';
import {addressSchema} from "@/utils/validationSchema";
import {errorHandler} from "@/utils/handelErrors";
import {capitalizeFirstLetter, toLowerCase} from "@/utils/stringUtils";
import {createAddress, getAllAddresses, isAddressAlreadyExist} from "@/services/backend-services/AddressService";


/**
 * @method GET
 * @route.ts /api/v1/addresses
 * @desc Get all addresses
 * @access public
 */
export async function GET() {
    try {
        // on récupère toutes les adresses de la base de données via la fonction findMany de prisma
        const addresses = await getAllAddresses();

        // si aucune adresse n'est trouvée, on renvoie une erreur
        if (!addresses) {
            return errorHandler("No addresses found", 404);
        }

        // on renvoie la liste des adresses
        return NextResponse.json(addresses, {status: 200});

        // si une erreur survient, on renvoie une erreur
    } catch (error) {
        return errorHandler("Internal server error", 500);
    }
}

/**
 * @method POST
 * @route.ts /api/v1/addresses
 * @desc Create a new address
 * @access public
 */
export async function POST(request: NextRequest) {
    try {
        // récupérer le body de la requête et le transformer en adresse DTO
        const body = (await request.json());

        // valider le body avec le schema de l'adresse
        const validated = addressSchema.safeParse(body);

        // si la validation est réussie, on peut créer une adresse sinon on renvoie une erreur
        if (!validated.success) {
            return NextResponse.json({error: validated.error.errors[0].message}, {status: 400});
        }

        // formatted address data
        const formattedAddress = {
            street: toLowerCase(body.street),
            number: body.number,
            city: capitalizeFirstLetter(body.city),
            zipCode: body.zipCode,
            country: capitalizeFirstLetter(body.country)
        }
        // Vérifier si l'adresse existe déjà dans la base de données

        const existingAddress = await isAddressAlreadyExist(formattedAddress);


        // Si l'adresse existe, renvoyer une erreur 200 avec l'adresse existante
        if (existingAddress) {
            return NextResponse.json(
                {
                    error: "Address found exists",
                    address: existingAddress
                },
                {status: 200});
        }

        // const newAddress = await prisma.address.create({
        //     data: formattedAddress
        // })

        const newAddress = await createAddress(formattedAddress);
        // on renvoie la liste des adresses
        return NextResponse.json({message: "Address created successfully", address: newAddress}, {status: 201});

    } catch (error) {
        // si une erreur survient, on renvoie une erreur
        return errorHandler("Internal server error", 500);
    }

}




