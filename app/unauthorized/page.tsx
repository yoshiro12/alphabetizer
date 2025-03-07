// app/unauthorized/page.tsx
export default function Unauthorized() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-4">You don't have permission to access this page.</p>
        <a href="/" className="mt-6 text-blue-500 hover:underline">
          Return to Home
        </a>
      </div>
    );
  }