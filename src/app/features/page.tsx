import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Share2, Users, Link2, Heart, Check, TrendingUp, BarChart2, Layout, Bell, MonitorPlay, ShieldCheck, DollarSign } from "lucide-react";
import Image from "next/image";

export default function FeaturesPage() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-[#F8F9FF]">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#FF0050]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#00F2EA]/5 rounded-full blur-[80px]" />
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
                        <Link href="/features" className="text-sm font-medium text-gray-900">Fitur</Link>
                        <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">Tentang Kami</Link>
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
            <section className="relative z-10 pt-32 pb-12 px-6 max-w-7xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-[#1A1A2E]">
                    Fitur Lengkap untuk <span className="gradient-text">Kreator Pro</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                    Jelajahi setiap tools canggih yang kami bangun khusus untuk membantu Anda mendominasi TikTok Shop dan affiliate marketing.
                </p>
            </section>

            {/* Main Features Grid */}
            <section className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
                <div className="grid gap-12">

                    {/* Feature Block 0: Link in Bio */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row-reverse gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6F3FF5] to-[#00F2EA] flex items-center justify-center">
                                <Link2 className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-[#1A1A2E]">Link-in-Bio Supercharged</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Maksimalkan satu-satunya link di profil TikTok Anda. Buat halaman landing mini yang menawan untuk mengarahkan traffic ke WhatsApp, Marketplace, Sosmed lain, atau produk afiliasi.
                            </p>
                            <ul className="space-y-2 mt-4">
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#6F3FF5]" /> Unlimited links & tombol animasi
                                </li>
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#6F3FF5]" /> Embed video TikTok & Youtube langsung
                                </li>
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#6F3FF5]" /> Kustomisasi tema tanpa batas
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-2xl p-6 w-full h-64 flex items-center justify-center border border-gray-100 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9ff] to-[#e0e7ff] opacity-50" />
                            {/* Pseudo UI for Link in Bio */}
                            <div className="relative w-48 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 space-y-3 transform group-hover:scale-105 transition-transform duration-500">
                                <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
                                <div className="space-y-2 pt-2">
                                    <div className="h-8 bg-black rounded-lg w-full opacity-10" />
                                    <div className="h-8 bg-black rounded-lg w-full opacity-10" />
                                    <div className="h-8 bg-black rounded-lg w-full opacity-10" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Block 1 */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF0050] to-[#6F3FF5] flex items-center justify-center">
                                <BarChart2 className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-[#1A1A2E]">Analitik Komprehensif</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Lihat melampaui angka dasar. Analisis kami memberikan insight mendalam tentang perilaku audiens, waktu terbaik posting, dan performa setiap video secara real-time.
                            </p>
                            <ul className="space-y-2 mt-4">
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#00F2EA]" /> Grafik tren pertumbuhan follower harian
                                </li>
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#00F2EA]" /> Analisis engagement rate per kategori konten
                                </li>
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#00F2EA]" /> Demografi audiens terperinci
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-2xl p-6 w-full h-64 flex items-center justify-center border border-gray-100">
                            <span className="text-gray-400 font-medium">Dashboard Preview UI</span>
                        </div>
                    </div>

                    {/* Feature Block 2 */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row-reverse gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F2EA] to-[#6F3FF5] flex items-center justify-center">
                                <Layout className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-[#1A1A2E]">Portofolio Otomatis</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Jangan buang waktu membuat media kit manual. ENTRO.LY secara otomatis menghasilkan halaman portofolio profesional yang selalu terupdate dengan statistik terbaru Anda.
                            </p>
                            <ul className="space-y-2 mt-4">
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#FF0050]" /> Terhubung langsung dengan data TikTok API
                                </li>
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#FF0050]" /> Desain responsif dan mobile-friendly
                                </li>
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#FF0050]" /> Bagikan link khusus ke brand dan agensi
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-2xl p-6 w-full h-64 flex items-center justify-center border border-gray-100">
                            <span className="text-gray-400 font-medium">Portfolio Preview UI</span>
                        </div>
                    </div>

                    {/* Feature Block 3 */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF0050] to-[#00F2EA] flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-[#1A1A2E]">Manajemen Komisi & Kasbon</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Fitur eksklusif untuk kreator MCN kami. Pantau penghasilan komisi Anda, ajukan pencairan lebih awal (Kasbon), dan kelola keuangan kreator Anda dengan transparan.
                            </p>
                            <ul className="space-y-2 mt-4">
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#6F3FF5]" /> Laporan estimasi pendapatan real-time
                                </li>
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#6F3FF5]" /> Pengajuan kasbon instan via dashboard
                                </li>
                                <li className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-5 h-5 text-[#6F3FF5]" /> Riwayat transaksi lengkap
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-2xl p-6 w-full h-64 flex items-center justify-center border border-gray-100">
                            <span className="text-gray-400 font-medium">Finance Preview UI</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* Extra Features Grid */}
            <section className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-8 text-[#1A1A2E]">Dan Masih Banyak Lagi...</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <MonitorPlay className="w-8 h-8 text-[#FF0050] mb-3" />
                        <h4 className="font-bold text-lg mb-2">Monitor Live Stream</h4>
                        <p className="text-gray-600 text-sm">Analisis performa sesi live streaming Anda untuk meningkatkan penjualan.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <ShieldCheck className="w-8 h-8 text-[#00F2EA] mb-3" />
                        <h4 className="font-bold text-lg mb-2">Keamanan Data</h4>
                        <p className="text-gray-600 text-sm">Data Anda dilindungi dengan enkripsi tingkat bank dan autentikasi OAuth aman.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <Bell className="w-8 h-8 text-[#6F3FF5] mb-3" />
                        <h4 className="font-bold text-lg mb-2">Smart Alerts</h4>
                        <p className="text-gray-600 text-sm">Notifikasi cerdas saat ada tren produk atau lonjakan performa video.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
                <div className="relative rounded-3xl bg-[#1A1A2E] overflow-hidden p-12 text-center text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#6F3FF5]/20 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00F2EA]/20 rounded-full blur-[80px]" />

                    <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Mulai Perjalanan Sukses Anda Hari Ini</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
                        Bergabung dengan komunitas kreator elit Indonesia dan akses semua fitur premium ini.
                    </p>
                    <div className="relative z-10">
                        <Link href="/register">
                            <Button size="lg" className="text-lg px-8 bg-white text-[#1A1A2E] hover:bg-gray-100">
                                Coba Gratis Sekarang
                            </Button>
                        </Link>
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
