import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Delete Your Account",
    description: "How to delete your Bahix account and what data gets removed.",
};

export default function DeleteAccountPage() {
    return (
        <div className="min-h-screen bg-[#f7f7f5] text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight">Delete Your Bahix Account</h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Bahix by Bahix Team</p>

                <h2 className="mt-10 text-xl font-semibold">How to Delete Your Account</h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-700 dark:text-gray-300">
                    <li>Open the Bahix mobile app on your device.</li>
                    <li>Go to the Settings section (tap the ⚙️ icon in the top-right).</li>
                    <li>Tap Delete Account.</li>
                    <li>A warning modal will appear.</li>
                </ol>

                <blockquote className="mt-6 border-l-4 border-gray-300 pl-4 text-gray-700 italic dark:border-gray-700 dark:text-gray-300">
                    <p className="font-medium not-italic">Are you sure you want to delete your account?</p>
                    <p className="mt-2">
                        This action cannot be undone, and all your data will be permanently removed.
                    </p>
                    <p className="mt-2">
                        – If you tap Delete Account, your request will be sent to our server. You will
                        then be logged out and returned to the login screen.
                    </p>
                    <p className="mt-2">
                        – If you tap Cancel, no changes will be made and you will remain logged in.
                    </p>
                </blockquote>

                <h2 className="mt-10 text-xl font-semibold">What Gets Deleted</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
                    <li>User profile information (name, email, phone number, profile photo)</li>
                    <li>All dairy transaction records (milk collection, quality tests, inventory logs)</li>
                    <li>Sales data, invoices, and payment history</li>
                    <li>Customer and supplier details stored in the app</li>
                    <li>Any reports or exported files generated and stored on our backend</li>
                </ul>

                <h2 className="mt-10 text-xl font-semibold">Retention of Audit Logs</h2>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                    To comply with security and auditing requirements, anonymized server logs are
                    retained for up to 90 days. No personal or transaction data remains in those logs
                    after that period.
                </p>

                <h2 className="mt-10 text-xl font-semibold">Questions or Issues?</h2>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                    If you have any trouble deleting your account, please contact our support team:
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Email:{" "}
                    <a href="mailto:jatanyadav009@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">
                        shubhamkr354@gmail.com
                    </a>
                    <br />
                    Phone: +91-8210243998
                </p>

                <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
                    © 2025 Bahix Team. All rights reserved.
                </p>
            </article>
        </div>
    );
}
