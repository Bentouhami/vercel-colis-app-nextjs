// path: src/app/api/v1/users/[id]/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getUserProfileById,
  updateUserProfile,
} from "@/services/backend-services/Bk_UserService";
import { UpdateProfileRequestDto } from "@/services/dtos";
import { editProfileSchema } from "@/utils/validationSchema";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await props.params;

  if (req.method !== "GET") {
    return NextResponse.json("Not allowed method!");
  }

  try {
    const userId = parseInt(params.id, 10); // Ensure the ID is parsed as an integer

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID provided." },
        { status: 400 }
      );
    }

    // get profile by id
    const userProfile = await getUserProfileById(userId);

    if (!userProfile) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ profile: userProfile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await props.params;

  try {
    const userId = parseInt(params.id, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID provided." },
        { status: 400 }
      );
    }

    const body: UpdateProfileRequestDto = await req.json();

    // Validate the request body
    const validation = editProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedProfile = await updateUserProfile(userId, body);

    if (!updatedProfile) {
      return NextResponse.json(
        { error: "User not found or update failed." },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
