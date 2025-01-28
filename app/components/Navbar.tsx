import Link from "next/link"

export function Navbar () {
    return (
        <nav className="bg-black shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center ">
                    <h1 className="text-md  text-white">
                    A free tool by <Link href="http://bitpix.tech" ><span className="font-bold underline hover:text-gray-400"> Bitpix </span></Link>
                    </h1>
                </div>
            </div>
        </nav>
    )
}
