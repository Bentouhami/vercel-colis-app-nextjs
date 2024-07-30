import {NextResponse} from "next/server";

/**
 * @method errorHandler
 * @access private
 * @param {any} error
 * @returns {NextResponse}
 * @description Handles errors and returns a response with the error message and status code
 * @param error
 * @param status
 */
export function errorHandler(error: string, status: number) {
    return NextResponse.json({error: error}, {status: status});
}
