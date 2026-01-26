import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-[#F8F9FF]">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#FF0050]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-[#00F2EA]/5 rounded-full blur-[80px]" />
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
                        <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">Tentang Kami</Link>
                        <Link href="/privacy" className="text-sm font-medium text-gray-900">Privasi</Link>
                        <Link href="/login">
                            <Button variant="ghost" className="font-medium">Sign In</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm" className="font-medium">Get Started</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto my-32 bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">Kebijakan Privasi / Privacy Policy</h1>
                <p className="text-gray-500 text-sm mb-8">Terakhir Diperbarui: 25 Januari 2026 | Last Updated: January 25, 2026</p>

                <div className="bg-[#fff3cd]/50 border-l-4 border-[#ffc107] p-4 mb-8 rounded-r-lg">
                    <strong>🇮🇩 Untuk Pengguna Indonesia:</strong>
                    <p className="text-gray-700 mt-1">Kebijakan ini mematuhi UU ITE No. 19/2016, PP 71/2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik, dan Peraturan Menkominfo No. 20/2016 tentang Perlindungan Data Pribadi dalam Sistem Elektronik.</p>
                </div>

                <div className="prose prose-lg prose-headings:text-[#1A1A2E] prose-p:text-gray-600 prose-li:text-gray-600 max-w-none">
                    <p>PT ENTROPI GLOBAL MARTECH ("kami," "kita," atau "Perusahaan") mengoperasikan ENTRO.LY, platform dashboard bisnis untuk kreator TikTok. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi Anda saat menggunakan layanan kami.</p>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">1. Informasi yang Kami Kumpulkan</h2>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">1.1 Informasi dari TikTok</h3>
                    <p>Saat Anda menghubungkan akun TikTok Anda ke ENTRO.LY melalui fitur "Login dengan TikTok", kami mengumpulkan:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li><strong>Informasi Profil:</strong> Nama pengguna TikTok, nama tampilan, foto profil/avatar, ID pengguna unik (open_id), bio/deskripsi, dan status verifikasi</li>
                        <li><strong>Statistik Akun:</strong> Jumlah follower, total likes, total jumlah video</li>
                        <li><strong>Informasi Video:</strong> Judul video, deskripsi, hashtag, tanggal/waktu posting, gambar thumbnail</li>
                        <li><strong>Metrik Performa:</strong> Jumlah views video, likes, shares, komentar, waktu tonton (jika tersedia)</li>
                    </ul>

                    <div className="bg-[#f0f4ff] p-6 border-l-4 border-[#6F3FF5] my-6 rounded-r-lg not-prose">
                        <strong>Yang TIDAK Kami Kumpulkan dari TikTok:</strong>
                        <ul className="list-disc pl-8 mt-2 space-y-1 text-gray-600">
                            <li>Pesan pribadi atau pesan langsung</li>
                            <li>Video draft (kecuali Anda secara eksplisit mengunggahnya melalui fitur masa depan)</li>
                            <li>Password atau kredensial login TikTok Anda</li>
                            <li>Informasi rekening keuangan atau detail pembayaran</li>
                            <li>Data lokasi (kecuali Anda mengaktifkannya untuk fitur TikTok GO)</li>
                        </ul>
                    </div>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">1.2 Informasi yang Anda Berikan Langsung</h3>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Alamat email (untuk notifikasi akun)</li>
                        <li>Preferensi kontak dan pengaturan komunikasi</li>
                        <li>Masukan dan permintaan dukungan</li>
                    </ul>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">1.3 Informasi yang Dikumpulkan Secara Otomatis</h3>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Informasi perangkat (jenis browser, sistem operasi)</li>
                        <li>Alamat IP dan lokasi umum (tingkat kota/negara)</li>
                        <li>Data penggunaan (halaman yang dikunjungi, fitur yang digunakan, waktu yang dihabiskan di platform)</li>
                        <li>Cookies dan teknologi pelacakan serupa</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">2. Bagaimana Kami Menggunakan Informasi Anda</h2>

                    <p>Kami menggunakan informasi Anda untuk:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li><strong>Menyediakan Layanan Inti:</strong> Menampilkan dashboard kreator, grafik analitik, dan metrik performa Anda</li>
                        <li><strong>Membuat Portofolio:</strong> Membuat halaman showcase kreator profesional (dengan persetujuan Anda)</li>
                        <li><strong>Mengirim Notifikasi:</strong> Memberi tahu Anda tentang performa video baru, pencapaian, dan pembaruan platform</li>
                        <li><strong>Meningkatkan Layanan:</strong> Menganalisis pola penggunaan untuk meningkatkan fitur dan pengalaman pengguna</li>
                        <li><strong>Dukungan Pelanggan:</strong> Menanggapi pertanyaan Anda dan menyelesaikan masalah teknis</li>
                        <li><strong>Mematuhi Kewajiban Hukum:</strong> Memenuhi persyaratan regulasi dan menegakkan Syarat Layanan kami</li>
                    </ul>

                    <div className="bg-[#f0f4ff] p-6 border-l-4 border-[#6F3FF5] my-6 rounded-r-lg not-prose">
                        <strong>Yang TIDAK Kami Lakukan dengan Data Anda:</strong>
                        <ul className="list-disc pl-8 mt-2 space-y-1 text-gray-600">
                            <li>Kami tidak pernah menjual informasi pribadi Anda ke pihak ketiga</li>
                            <li>Kami tidak menggunakan data Anda untuk iklan tertarget di luar platform kami</li>
                            <li>Kami tidak membagikan metrik performa Anda dengan kreator lain tanpa izin</li>
                        </ul>
                    </div>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">3. Pembagian dan Pengungkapan Data</h2>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">3.1 Dengan Persetujuan Anda</h3>
                    <p>Kami dapat membagikan informasi Anda saat Anda secara eksplisit mengizinkan kami melakukannya, seperti saat Anda membuat portofolio kreator publik atau memilih fitur marketplace brand.</p>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">3.2 Penyedia Layanan</h3>
                    <p>Kami bekerja dengan penyedia layanan pihak ketiga tepercaya yang membantu kami mengoperasikan ENTRO.LY:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Penyedia cloud hosting (AWS, Google Cloud)</li>
                        <li>Layanan analitik (untuk peningkatan platform)</li>
                        <li>Tools dukungan pelanggan</li>
                        <li>Layanan notifikasi email</li>
                    </ul>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">3.3 Persyaratan Hukum Indonesia</h3>
                    <p>Kami dapat mengungkapkan informasi Anda jika diwajibkan oleh hukum Indonesia, perintah pengadilan, atau peraturan pemerintah, atau untuk melindungi hak, properti, atau keselamatan kami sesuai dengan:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>UU ITE No. 19 Tahun 2016</li>
                        <li>PP 71/2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik</li>
                        <li>Peraturan Menkominfo No. 20/2016</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">4. Keamanan Data</h2>

                    <p>Kami menerapkan langkah-langkah keamanan standar industri untuk melindungi informasi Anda:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li><strong>Enkripsi:</strong> Semua transmisi data menggunakan enkripsi HTTPS/TLS 1.3</li>
                        <li><strong>Keamanan Token:</strong> Token akses OAuth TikTok dienkripsi saat disimpan menggunakan enkripsi AES-256</li>
                        <li><strong>Kontrol Akses:</strong> Kebijakan akses internal yang ketat membatasi siapa yang dapat melihat data Anda</li>
                        <li><strong>Audit Berkala:</strong> Penilaian keamanan berkelanjutan dan pengujian kerentanan</li>
                        <li><strong>Rotasi Token:</strong> Token akses secara otomatis diperbarui setiap 24 jam</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">5. Penyimpanan Data di Indonesia</h2>

                    <div className="bg-[#fff3cd]/50 border-l-4 border-[#ffc107] p-4 mb-6 rounded-r-lg not-prose">
                        <strong>📍 Lokasi Server:</strong>
                        <p className="text-gray-700 mt-1">Sesuai dengan PP 71/2019, data pribadi pengguna Indonesia disimpan di server yang berlokasi di Indonesia atau di fasilitas cloud yang memenuhi persyaratan perlindungan data Indonesia.</p>
                    </div>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">6. Retensi Data</h2>

                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li><strong>Akun Aktif:</strong> Data Anda diperbarui setiap 24 jam selama akun Anda aktif</li>
                        <li><strong>Akun Tidak Aktif:</strong> Jika Anda tidak menggunakan ENTRO.LY selama 90 hari berturut-turut, kami dapat mengarsipkan data Anda</li>
                        <li><strong>Penghapusan Akun:</strong> Saat Anda memutuskan hubungan akun TikTok, kami menghapus data Anda dalam 90 hari</li>
                        <li><strong>Metrik Video:</strong> Untuk video TikTok yang dihapus, kami menyimpan metrik agregat selama 30 hari, kemudian menghapusnya secara permanen</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">7. Hak-Hak Anda</h2>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">7.1 Akses dan Portabilitas</h3>
                    <p>Anda dapat:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Melihat semua data Anda di dashboard ENTRO.LY Anda</li>
                        <li>Meminta salinan data Anda dalam format yang dapat dibaca mesin</li>
                        <li>Mengekspor laporan analitik Anda kapan saja</li>
                    </ul>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">7.2 Putuskan Hubungan Akun Anda</h3>
                    <p>Anda dapat mencabut akses ENTRO.LY ke akun TikTok Anda kapan saja dengan:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Pergi ke aplikasi TikTok → Pengaturan → Keamanan dan Login → Aplikasi dan Situs Web → ENTRO.LY → Hapus Akses</li>
                        <li>Atau menghubungi tim dukungan kami di info@entropimartech.com</li>
                    </ul>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">7.3 Hak Berdasarkan Hukum Indonesia</h3>
                    <p>Sesuai dengan Peraturan Menkominfo No. 20/2016, Anda memiliki hak untuk:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Mengakses data pribadi Anda</li>
                        <li>Memperbaiki data yang tidak akurat</li>
                        <li>Menghapus data pribadi Anda</li>
                        <li>Menolak pemrosesan data pribadi Anda</li>
                        <li>Memindahkan data Anda ke penyedia layanan lain</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">8. Privasi Anak</h2>
                    <p>ENTRO.LY tidak ditujukan untuk pengguna di bawah 18 tahun. Kami tidak dengan sengaja mengumpulkan informasi dari anak di bawah 18 tahun. Jika Anda yakin seorang anak telah memberikan kami informasi pribadi, segera hubungi kami di info@entropimartech.com.</p>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">9. Cookies dan Teknologi Pelacakan</h2>
                    <p>Kami menggunakan cookies dan teknologi serupa untuk:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Mengingat preferensi login Anda</li>
                        <li>Menganalisis lalu lintas website</li>
                        <li>Memahami bagaimana pengguna berinteraksi dengan platform</li>
                    </ul>
                    <p>Anda dapat mengontrol cookies melalui pengaturan browser Anda.</p>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">10. Perubahan pada Kebijakan Privasi</h2>
                    <p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan signifikan dengan:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Memposting kebijakan baru di halaman ini dengan tanggal "Terakhir Diperbarui" yang diperbarui</li>
                        <li>Mengirimkan notifikasi email kepada Anda (untuk perubahan material)</li>
                        <li>Menampilkan pemberitahuan dalam aplikasi saat Anda login</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">11. Hubungi Kami</h2>
                    <p>Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini atau praktik data kami, silakan hubungi kami:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li><strong>Email:</strong> <a href="mailto:info@entropimartech.com" className="text-[#6F3FF5] hover:underline">info@entropimartech.com</a></li>
                        <li><strong>Petugas Privasi:</strong> <a href="mailto:info@entropimartech.com" className="text-[#6F3FF5] hover:underline">info@entropimartech.com</a></li>
                        <li><strong>Perusahaan:</strong> PT ENTROPI GLOBAL MARTECH</li>
                        <li><strong>Alamat:</strong> Tangerang, Indonesia</li>
                    </ul>

                    <div className="bg-[#f0f4ff] p-6 border-l-4 border-[#6F3FF5] my-8 rounded-r-lg not-prose">
                        <strong>Praktik Data Khusus TikTok:</strong>
                        <p className="mt-2 text-gray-600">ENTRO.LY menggunakan API Developer TikTok sesuai dengan Syarat Layanan Developer TikTok dan Perjanjian Pembagian Data. Data TikTok Anda diproses semata-mata untuk menyediakan layanan ENTRO.LY kepada Anda. Kami menjaga kepatuhan terhadap kebijakan TikTok dan tidak menggunakan data TikTok Anda dengan cara yang akan melanggar aturan platform TikTok.</p>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link href="/">
                        <Button variant="outline" size="lg" className="rounded-full">Kembali ke Beranda</Button>
                    </Link>
                </div>
            </div>

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
