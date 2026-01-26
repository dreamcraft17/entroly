import { redirect } from "next/navigation";

export default function RegisterPage() {
    const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.entro.ly";
    redirect(`${ssoUrl}/register?redirect=https://entro.ly/dashboard`);
}
