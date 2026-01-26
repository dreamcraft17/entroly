import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Users, Globe, Building2, Award } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-[#F8F9FF]">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#6F3FF5]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-[#FF0050]/5 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="fixed w-full top-0 z-50 border-b border-white/50 bg-white/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
                                <Image src="/entropi_logo.ico" alt="Entropi" width={32} height={32} className="object-contain" />
                            </div>
                            <span className="text-xl font-bold gradient-text">ENTRO.LY 🇮🇩</span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Beranda</Link>
                        <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Fitur</Link>
                        <Link href="/about" className="text-sm font-medium text-gray-900">Tentang Kami</Link>
                        <Link href="/privacy" className="text-sm font-medium text-gray-600 hover:text-gray-900">Privasi</Link>
                        <Link href="/login">
                            <Button variant="ghost" className="font-medium">Sign In</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm" className="font-medium">Get Started</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-[#E0E7FF] text-[#6F3FF5] text-sm font-bold mb-4">
                    Our Mission
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-[#1A1A2E]">
                    Memberdayakan Kreator <br />
                    <span className="gradient-text">Ekonomi Digital Indonesia</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Kami percaya setiap kreator memiliki potensi untuk menjadi pengusaha sukses. ENTRO.LY hadir untuk menjembatani kreativitas dengan teknologi bisnis yang canggih.
                </p>
            </section>

            {/* Story Section */}
            <section className="relative z-10 px-6 py-12 max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl p-8 md:p-16 shadow-lg border border-gray-100 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">Siapa Kami?</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            PT Entropi Global Martech ("Entropi") adalah perusahaan teknologi pemasaran yang berbasis di Tangerang, Indonesia. Kami adalah mitra resmi TikTok Shop (TSP), TikTok Affiliate Partner (TAP), dan Creator Agent Partner (CAP).
                        </p>
                        <p className="text-gray-600 leading-relaxed text-lg mt-4">
                            Didirikan dengan visi untuk mendemokratisasi akses ke tools analitik profesional, kami telah membantu lebih dari 10.000 kreator Indonesia mengoptimalkan pendapatan dan jangkauan mereka di platform TikTok.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#E0F2FE] flex items-center justify-center shrink-0">
                                <Award className="w-6 h-6 text-[#00F2EA]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1A1A2E] text-lg">Mitra Resmi Terpercaya</h3>
                                <p className="text-gray-600">Diakui secara resmi oleh TikTok Shop Indonesia untuk standar kualitas dan performa tinggi.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#FAE8FF] flex items-center justify-center shrink-0">
                                <Users className="w-6 h-6 text-[#6F3FF5]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1A1A2E] text-lg">Komunitas Kreator</h3>
                                <p className="text-gray-600">Jaringan ribuan kreator yang saling mendukung dan tumbuh bersama dalam ekosistem Entroly.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#FFE4E6] flex items-center justify-center shrink-0">
                                <Building2 className="w-6 h-6 text-[#FF0050]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1A1A2E] text-lg">Berbasis di Tangerang</h3>
                                <p className="text-gray-600">Tim lokal yang memahami nuansa pasar dan budaya Indonesia sepenuhnya.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
                                <Globe className="w-6 h-6 text-[#10B981]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1A1A2E] text-lg">Standar Global</h3>
                                <p className="text-gray-600">Membawa teknologi kelas dunia yang disesuaikan untuk kebutuhan pasar lokal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats/Culture Section */}
            <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-[#1A1A2E] mb-12">Nilai Inti Kami</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6">
                        <div className="text-4xl mb-4">💡</div>
                        <h3 className="text-xl font-bold mb-2">Inovasi</h3>
                        <p className="text-gray-600">Selalu mencari cara baru yang lebih baik untuk memecahkan masalah kreator.</p>
                    </div>
                    <div className="p-6">
                        <div className="text-4xl mb-4">🤝</div>
                        <h3 className="text-xl font-bold mb-2">Integritas</h3>
                        <p className="text-gray-600">Transparansi dalam data dan kejujuran dalam kemitraan adalah fondasi kami.</p>
                    </div>
                    <div className="p-6">
                        <div className="text-4xl mb-4">🚀</div>
                        <h3 className="text-xl font-bold mb-2">Dampak</h3>
                        <p className="text-gray-600">Kami mengukur kesuksesan kami dari seberapa besar Anda bertumbuh.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-200/50 bg-white/50 backdrop-blur-xl">
                <div className="px-6 py-12 max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
                            <Image src="/entropi_logo.ico" alt="Entropi" width={32} height={32} className="object-contain" />
                        </div>
                        <span className="text-xl font-bold gradient-text">Entro.ly</span>
                    </div>
                    <div className="flex justify-center flex-wrap gap-6 mb-6 text-sm font-medium text-gray-600">
                        <Link href="/about" className="hover:text-gray-900">Tentang Kami</Link>
                        <Link href="/features" className="hover:text-gray-900">Fitur</Link>
                        <Link href="/privacy" className="hover:text-gray-900">Kebijakan Privasi</Link>
                        <Link href="/terms" className="hover:text-gray-900">Syarat & Ketentuan</Link>
                        <a href="mailto:info@entropimartech.com" className="hover:text-gray-900">Kontak</a>
                    </div>
                    <p className="text-gray-600">
                        Made with <Heart className="w-4 h-4 inline text-[#FF0050] fill-[#FF0050]" /> for Indonesian creators
                    </p>
                    <div className="text-xs text-gray-400 mt-4 space-y-1">
                        <p>© {new Date().getFullYear()} PT ENTROPI GLOBAL MARTECH. Hak Cipta Dilindungi.</p>
                        <p>Mitra Resmi TikTok Shop Indonesia | Terdaftar di Indonesia</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
