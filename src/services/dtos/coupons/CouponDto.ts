// path: src/services/dtos/coupons/CouponDto.ts


// -------------------- Coupon DTOs --------------------
export interface CouponDto {
    id?: number;
    couponCode: string;
    discountAmount: number;
    discountPercentage: number;
    numberOfUses: number;
    startDate: Date;
    expirationDate?: Date;
    termsAndConditions?: string;
}

// DTO for creating a new coupon
export type CreateCouponDto = Omit<CouponDto, "id">;

// DTO for updating an existing coupon
export interface UpdateCouponDto extends Partial<CreateCouponDto> {
    id: number;
}