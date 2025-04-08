import { redirect } from "next/navigation";
import { GET__getUser } from "@/services/queries-ssr";
import { loginPageUrl } from "@/lib/constants";

const Gate = async ({ reverse }) => {
  const { data, error } = await GET__getUser();
  if (reverse) {
    if (!error || data?.user) {
      redirect(`/`);
    }
  } else {
    if (error || !data?.user) {
      redirect(loginPageUrl);
    }
  }
  return <></>;
};

export default Gate;
