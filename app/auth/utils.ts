import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";


export async function handleOAuthCallback({req}: { req: any }) {
    const supabase = await createClient();
    const code = new URL(req.url).searchParams.get("code");

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            return { success: false, error };
        }
    }

    return { success: true };
}

export async function signOutUser() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { success: false, error };
    }

    return { success: true };
}

export async function withAuthentication({handler}: { handler: any }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return handler(user);
}