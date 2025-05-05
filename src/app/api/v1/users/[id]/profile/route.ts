// path: src/app/api/v1/users/[id]/profile/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {getUserProfileById} from "@/services/backend-services/Bk_UserService";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const params = await props.params;

    if (req.method !== 'GET') {
        return NextResponse.json("Not allowed method!")
    }

    try {
        const userId = parseInt(params.id, 10); // Ensure the ID is parsed as an integer

        if (isNaN(userId)) {
            return NextResponse.json(
                {error: 'Invalid user ID provided.'},
                {status: 400}
            );
        }

        // get profile by id
        const userProfile = await getUserProfileById(userId);


        if (!userProfile) {
            return NextResponse.json(
                {error: 'User not found.'},
                {status: 404}
            );
        }

        return NextResponse.json({profile: userProfile}, {status: 200});
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            {error: 'Internal server error.'},
            {status: 500}
        );
    }
}
