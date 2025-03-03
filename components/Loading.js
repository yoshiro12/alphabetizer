import { Loader2 } from "lucide-react"; // Import a spinner icon

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-32">
      <Loader2 className="animate-spin text-primary w-8 h-8" />
      <span className="ml-2 text-gray-400">Loading...</span>
    </div>
  );
}
