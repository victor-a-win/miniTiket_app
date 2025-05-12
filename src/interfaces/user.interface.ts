export interface IUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    roleName: string;
    profile_picture?: string; //This will now store the full Cloudinary URL
    referral_code: string;
    user_points: number;
    discount_coupons: string;
    expiry_points: string;
    token: string;
}