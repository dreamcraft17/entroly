"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Clock,
    ArrowLeft,
    ExternalLink,
    Banknote,
    Wallet,
    CheckCircle,
    Loader2,
    X,
    History,
    AlertCircle,
    FileText
} from "lucide-react";
import * as Icons from "lucide-react";

interface CommissionData {
    paidCommission: string;
    pendingCommission: string;
    updatedAt: string | null;
}

interface KasbonData {
    id: string;
    amount: string;
    status: "REQUESTED" | "PENDING" | "COMPLETED" | "REJECTED";
    note: string | null;
    adminNote: string | null;
    createdAt: string;
    updatedAt: string;
}

export default function CommissionPage() {
    const router = useRouter();
    const [commission, setCommission] = useState<CommissionData | null>(null);
    const [kasbons, setKasbons] = useState<KasbonData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showKasbonModal, setShowKasbonModal] = useState(false);
    const [kasbonAmount, setKasbonAmount] = useState("");
    const [kasbonNote, setKasbonNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [commissionRes, kasbonRes] = await Promise.all([
                fetch("/api/commission"),
                fetch("/api/kasbon")
            ]);

            if (commissionRes.ok) {
                const commissionData = await commissionRes.json();
                setCommission(commissionData);
            } else {
                setError("Failed to load commission data");
            }

            if (kasbonRes.ok) {
                const kasbonData = await kasbonRes.json();
                setKasbons(kasbonData);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: string | number) => {
        const numAmount = typeof amount === "string" ? parseInt(amount, 10) : amount;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numAmount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handleKasbonSubmit = async () => {
        if (!kasbonAmount || parseInt(kasbonAmount) <= 0) {
            setSubmitError("Masukkan jumlah yang valid");
            return;
        }

        setSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch("/api/kasbon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseInt(kasbonAmount),
                    note: kasbonNote || null
                })
            });

            if (response.ok) {
                setShowKasbonModal(false);
                setKasbonAmount("");
                setKasbonNote("");
                await fetchData();
            } else {
                const data = await response.json();
                setSubmitError(data.error || "Gagal mengajukan kasbon");
            }
        } catch (err) {
            console.error("Error submitting kasbon:", err);
            setSubmitError("Gagal mengajukan kasbon");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: KasbonData["status"]) => {
        const styles = {
            REQUESTED: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6", label: "Diajukan" },
            PENDING: { bg: "rgba(234, 179, 8, 0.2)", color: "#eab308", label: "Diproses" },
            COMPLETED: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e", label: "Selesai" },
            REJECTED: { bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444", label: "Ditolak" }
        };
        const style = styles[status];
        return (
            <span
                className="px-2 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: style.bg, color: style.color }}
            >
                {style.label}
            </span>
        );
    };

    const paidCommission = commission?.paidCommission || "0";
    const pendingCommission = commission?.pendingCommission || "0";
    const hasActiveRequest = kasbons.some(k => k.status === "REQUESTED" || k.status === "PENDING");

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg-base)" }}>
            {/* Header */}
            <header
                className="h-16 px-6 flex items-center justify-between backdrop-blur-xl sticky top-0 z-50 shadow-sm"
                style={{
                    borderBottom: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-bg-secondary)"
                }}
            >
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all"
                        style={{ color: "var(--color-text-secondary)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-bg-tertiary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>
                </div>
                <div className="flex items-center space-x-3">
                    <div
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl"
                        style={{
                            background: "linear-gradient(135deg, rgba(129, 41, 217, 0.1), rgba(236, 72, 153, 0.1))",
                            border: "1px solid var(--color-border)"
                        }}
                    >
                        <Icons.Sparkles className="w-4 h-4" style={{ color: "#8b5cf6" }} />
                        <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                            Entropi Creator
                        </span>
                    </div>
                    <a
                        href="https://rank.entro.ly"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all"
                        style={{ color: "var(--color-text-secondary)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-bg-tertiary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                        <Icons.Trophy className="w-4 h-4" />
                        <span className="text-sm font-medium">Leaderboard</span>
                        <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-6 py-12">
                {/* Page Title */}
                <div className="text-center mb-8">
                    <h1
                        className="text-3xl font-bold tracking-tight mb-2"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Commission Dashboard
                    </h1>
                    <p style={{ color: "var(--color-text-secondary)" }}>
                        Lihat komisi yang sudah cair dan pending kamu
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: "var(--color-text-secondary)" }} />
                        <p style={{ color: "var(--color-text-secondary)" }}>Loading commission data...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <Card
                        className="p-8 text-center"
                        style={{
                            backgroundColor: "var(--color-bg-secondary)",
                            border: "1px solid rgba(239, 68, 68, 0.3)"
                        }}
                    >
                        <Icons.AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "#ef4444" }} />
                        <p style={{ color: "var(--color-text-secondary)" }}>{error}</p>
                        <Button onClick={fetchData} className="mt-4">
                            Try Again
                        </Button>
                    </Card>
                )}

                {/* Commission Cards */}
                {!loading && !error && (
                    <>
                        {/* Commission Summary Card */}
                        <Card
                            className="relative overflow-hidden mb-6 shadow-xl"
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(0, 0, 0, 0.1)",
                                borderRadius: "1.5rem"
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2" style={{ overflow: "hidden" }}>

                                {/* Paid Section */}
                                <div
                                    className="p-6 flex flex-col items-center text-center overflow-hidden"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.02))",
                                        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                                        borderRight: "1px solid rgba(0, 0, 0, 0.05)"
                                    }}
                                >
                                    <div
                                        className="p-5 rounded-2xl mb-6 shadow-lg transform transition-transform group-hover:scale-110 duration-300"
                                        style={{
                                            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))",
                                            border: "1px solid rgba(34, 197, 94, 0.2)"
                                        }}
                                    >
                                        <Wallet className="w-10 h-10 drop-shadow-md" style={{ color: "#22c55e" }} />
                                    </div>

                                    <p className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: "var(--color-text-secondary)" }}>
                                        Paid Commission
                                    </p>

                                    <p className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight"
                                        style={{
                                            backgroundImage: "linear-gradient(135deg, #22c55e, #16a34a)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}>
                                        {formatCurrency(paidCommission)}
                                    </p>

                                    <div className="flex items-center text-sm font-medium px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20" style={{ color: "#16a34a" }}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        <span>Sudah dicairkan</span>
                                    </div>
                                </div>

                                {/* Pending Section */}
                                <div
                                    className="p-6 flex flex-col items-center text-center overflow-hidden"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(234, 179, 8, 0.08), rgba(234, 179, 8, 0.02))"
                                    }}
                                >
                                    <div
                                        className="p-5 rounded-2xl mb-6 shadow-lg transform transition-transform group-hover:scale-110 duration-300"
                                        style={{
                                            background: "linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.1))",
                                            border: "1px solid rgba(234, 179, 8, 0.2)"
                                        }}
                                    >
                                        <Clock className="w-10 h-10 drop-shadow-md" style={{ color: "#eab308" }} />
                                    </div>

                                    <p className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: "var(--color-text-secondary)" }}>
                                        Pending Commission
                                    </p>

                                    <p className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight"
                                        style={{
                                            backgroundImage: "linear-gradient(135deg, #eab308, #ca8a04)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}>
                                        {formatCurrency(pendingCommission)}
                                    </p>

                                    <div className="flex items-center text-sm mb-8 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20" style={{ color: "#ca8a04" }}>
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>Estimasi cair dalam 7 hari</span>
                                    </div>

                                    {/* Kasbon Button */}
                                    <Button
                                        onClick={() => setShowKasbonModal(true)}
                                        disabled={hasActiveRequest || parseInt(pendingCommission) === 0}
                                        className={`px-8 py-6 text-lg font-bold w-full md:w-auto shadow-lg transition-all duration-300 ${hasActiveRequest || parseInt(pendingCommission) === 0
                                            ? "opacity-50 cursor-not-allowed grayscale"
                                            : "btn-vibrant hover:scale-105"
                                            }`}
                                        style={{
                                            background: hasActiveRequest || parseInt(pendingCommission) === 0
                                                ? "rgba(100, 100, 100, 0.2)"
                                                : "linear-gradient(135deg, #22c55e, #16a34a)",
                                            color: hasActiveRequest || parseInt(pendingCommission) === 0 ? "var(--color-text-tertiary)" : "#ffffff",
                                        }}
                                    >
                                        <Banknote className="w-6 h-6 mr-3" />
                                        Kasbon
                                    </Button>

                                    <p className="text-xs mt-4 font-medium" style={{ color: "var(--color-text-tertiary)" }}>
                                        {hasActiveRequest
                                            ? "Kamu sudah memiliki pengajuan kasbon aktif"
                                            : parseInt(pendingCommission) === 0
                                                ? "Tidak ada komisi pending"
                                                : "Ajukan kasbon dari komisi pending kamu"}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Kasbon History */}
                        <Card
                            className="p-6 mt-6"
                            style={{
                                backgroundColor: "var(--color-bg-secondary)",
                                border: "1px solid var(--color-border)"
                            }}
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                                >
                                    <History className="w-5 h-5" style={{ color: "#8b5cf6" }} />
                                </div>
                                <h4 className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                                    Riwayat Kasbon
                                </h4>
                            </div>

                            {kasbons.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--color-text-tertiary)" }} />
                                    <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                                        Belum ada riwayat kasbon
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {kasbons.map((kasbon) => (
                                        <div
                                            key={kasbon.id}
                                            className="p-4 rounded-xl"
                                            style={{
                                                backgroundColor: "var(--color-bg-tertiary)",
                                                border: "1px solid var(--color-border)"
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                                                    {formatCurrency(kasbon.amount)}
                                                </span>
                                                {getStatusBadge(kasbon.status)}
                                            </div>
                                            <div className="flex items-center justify-between text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                                                <span>{formatDate(kasbon.createdAt)}</span>
                                                {kasbon.note && (
                                                    <span className="italic">"{kasbon.note}"</span>
                                                )}
                                            </div>
                                            {kasbon.adminNote && (
                                                <p className="mt-2 text-xs p-2 rounded" style={{ backgroundColor: "var(--color-bg-base)", color: "var(--color-text-secondary)" }}>
                                                    Admin: {kasbon.adminNote}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Info Card */}
                        <Card
                            className="p-6 mt-6"
                            style={{
                                backgroundColor: "var(--color-bg-secondary)",
                                border: "1px solid var(--color-border)"
                            }}
                        >
                            <div className="flex items-start space-x-3">
                                <div
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                                >
                                    <Icons.Info className="w-5 h-5" style={{ color: "#3b82f6" }} />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
                                        Tentang Kasbon
                                    </h4>
                                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                        Kasbon memungkinkan kamu untuk mengambil sebagian dari komisi pending sebelum tanggal pencairan resmi.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </>
                )}
            </main>

            {/* Kasbon Modal */}
            {showKasbonModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                >
                    <Card
                        className="w-full max-w-md p-6 relative"
                        style={{
                            backgroundColor: "var(--color-bg-secondary)",
                            border: "1px solid var(--color-border)"
                        }}
                    >
                        <button
                            onClick={() => {
                                setShowKasbonModal(false);
                                setSubmitError(null);
                            }}
                            className="absolute top-4 right-4 p-1 rounded-lg transition-all"
                            style={{ color: "var(--color-text-tertiary)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-bg-tertiary)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
                            Ajukan Kasbon
                        </h3>
                        <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                            Maksimal: {formatCurrency(pendingCommission)}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
                                    Jumlah (IDR)
                                </label>
                                <Input
                                    type="number"
                                    value={kasbonAmount}
                                    onChange={(e) => setKasbonAmount(e.target.value)}
                                    placeholder="Contoh: 500000"
                                    max={parseInt(pendingCommission)}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
                                    Catatan (opsional)
                                </label>
                                <Input
                                    type="text"
                                    value={kasbonNote}
                                    onChange={(e) => setKasbonNote(e.target.value)}
                                    placeholder="Alasan pengajuan kasbon"
                                    className="w-full"
                                />
                            </div>

                            {submitError && (
                                <div className="flex items-center space-x-2 p-3 rounded-lg" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
                                    <AlertCircle className="w-4 h-4" style={{ color: "#ef4444" }} />
                                    <span className="text-sm" style={{ color: "#ef4444" }}>{submitError}</span>
                                </div>
                            )}

                            <Button
                                onClick={handleKasbonSubmit}
                                disabled={submitting}
                                className="w-full py-6 font-semibold"
                                style={{
                                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                    color: "#ffffff"
                                }}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Mengajukan...
                                    </>
                                ) : (
                                    <>
                                        <Banknote className="w-5 h-5 mr-2" />
                                        Ajukan Kasbon
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
