export const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F4F7F6]">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0D3B54]"></div>
                <p className="mt-4 text-[#0D3B54] font-semibold text-lg">Loading...</p>
            </div>
        </div>
    )
}