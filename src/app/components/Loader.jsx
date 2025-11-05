export default function Loader() {
    return (
    <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-800 rounded-full" role="status" aria-label="loading" />
    </div>
    );
    }