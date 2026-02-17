"use client";
import { supabase } from '@/lib/supabase';

export default function Home() {
    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/bookmark`,
                queryParams: {
                    prompt: 'select_account', 
                },
            },
        });

        if (error) {
            console.error("Error signing in with Google:", error.message);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-200 bg-[length:200%_200%] animate-[gradient-animation_15s_ease_infinite]">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl text-center">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Bookmark Care
                    </h1>
                    <p className="text-gray-600">
                        Add your favorite sites in our application.
                    </p>
                </div>
                <div className="space-y-4 pt-4">
                    <p className="text-sm text-gray-500">
                        Sign in to get started
                    </p>
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                    >
                        <img className="w-6 h-6 mr-3" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
                        <span>Sign in with Google</span>
                    </button>
                </div>
            </div>
            <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 transform px-4 py-2 bg-gray-800/70 rounded-full text-white text-xs shadow-lg backdrop-blur-sm">
                Created by lakshaychauhan129@gmail.com
            </footer>
        </div>
    );
}