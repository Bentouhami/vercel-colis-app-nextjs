import {NextRequest, NextResponse} from 'next/server';
import {errorHandler} from '@/app/utils/handelErrors';
import {cookies} from 'next/headers';

/** logout route
 * @member GET
 * @route /api/v1/users/logout
 * @desc Logout a user
 * @access Public
 */

export async function GET(request: NextRequest) {
    try {
        // get auth token from header request and delete it
        cookies().delete("auth");
        return NextResponse.json(
            {message: "Logged out"},
            {status: 200}
        );

    } catch (error) {
        return errorHandler("Internal server error", 500);
    }

}