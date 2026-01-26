import { redirect } from "next/navigation";

export default function LoginPage() {
    const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.entro.ly";
    redirect(`${ssoUrl}/login?redirect=https://entro.ly/dashboard`);
}
