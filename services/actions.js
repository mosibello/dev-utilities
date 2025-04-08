// import { loginPageUrl } from "@/lib/constants";
// import { createClient } from "@/supabase/client";
// const supabase = createClient();

// export async function POST__signOut() {
//   const { error } = await supabase.auth.signOut();
//   if (!error && typeof window !== "undefined") {
//     window.location.href = loginPageUrl;
//   }
//   return error;
// }

// export async function POST__uploadFile(file, bucketName, filePath) {
//   const { data, error } = await supabase.storage
//     .from(bucketName)
//     .upload(filePath, file);
//   return { data, error };
// }

// export async function POST__insertPhotos(arr) {
//   const { data, error } = await supabase.from("photos").insert(arr).select();
//   return { data, error };
// }

// export async function POST__likePhoto(type, userId, photoId) {
//   if (type === `deleteLike`) {
//     const { data: deleteData, error: deleteError } = await supabase
//       .from("likes")
//       .delete()
//       .eq("user", userId)
//       .eq("photo", photoId);
//     return {
//       data: deleteData || `Deleted like successfully`,
//       error: deleteError,
//     };
//   } else {
//     const { data: insertData, error: insertError } = await supabase
//       .from("likes")
//       .insert({ user: userId, photo: photoId });
//     return {
//       data: insertData || `Inserted like successfully`,
//       error: insertError,
//     };
//   }
// }
