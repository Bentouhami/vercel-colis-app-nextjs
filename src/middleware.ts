// if the token is null or invalid
import {NextRequest, NextResponse} from "next/server";

export const middleware = async (request: NextRequest) => {

    console.log("Middleware called");

    // get the token from the header request
    const cookie = request.cookies.get("auth");
    const authToken = cookie?.value as string;
    // check if the token is null or invalid

    if (!authToken) { // !authToken && request.method === "DELETE" for delete request only
        return NextResponse.json(
            {message: "No token provided,  access denied from middleware"},
            {status: 401}
        );
    }
}

// export the middleware function config for matcher routes
export const config = {
    matcher: [
        "/api/v1/users/profile/:path*",
    ]
}