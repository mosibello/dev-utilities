export const organization = "utils";
export const supabaseStorageBucketURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;
export const rootURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_BASE_URL;
export const loginPageUrl = `${rootURL}/auth/login`;
