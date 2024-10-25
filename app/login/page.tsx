/**
 * /app/login/page.tsx
 * Supports login and registration
 * Source: https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app
 * Tailwing classes from: https://flowbite.com/blocks/marketing/login/
 */

import { login } from './actions'


export default function LoginPage() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6">
                        <div>
                            <button formAction={login} className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>    
  )
}