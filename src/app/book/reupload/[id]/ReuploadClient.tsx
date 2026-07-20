"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiUpload, FiCheck, FiCopy } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UPI_ID, CONSULTATION_FEE_OFFLINE } from "@/lib/constants";

export default function ReuploadClient({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const submit = async () => {
    if (!file) { toast.error("Please select your payment screenshot."); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("screenshot", file);
      if (upiTxnId) fd.append("upiTransactionId", upiTxnId);
      const res = await fetch(`/api/patient/appointments/${appointmentId}/upload-payment`, {
        method: "POST", body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Payment resubmitted! Doctor will review shortly.");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-hero-gradient pt-24 pb-20">
        <div className="container-pad max-w-md">
          <div className="bg-white rounded-4xl shadow-card p-6 md:p-8 border border-red-100">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors text-lg">←</Link>
              <div>
                <h1 className="text-xl font-bold text-green-900">Resubmit Payment</h1>
                <p className="text-red-500 text-xs mt-0.5">Your previous screenshot could not be verified</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-6">
              <p className="text-green-700 font-semibold text-sm mb-3">💳 UPI Payment</p>
              <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-green-200 mb-2">
                <div>
                  <p className="text-green-400 text-xs">UPI ID</p>
                  <p className="text-green-900 font-bold">{UPI_ID}</p>
                </div>
                <button onClick={copyUpi} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl text-xs font-medium">
                  {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-green-600 text-sm font-semibold">Amount: {CONSULTATION_FEE_OFFLINE}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-green-800 mb-2">New Payment Screenshot <span className="text-red-500">*</span></label>
              <label className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${
                file ? "border-green-500 bg-green-50" : "border-green-300 hover:border-green-400 hover:bg-green-50/50"
              }`}>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {file ? (
                  <><FiCheck className="w-8 h-8 text-green-600" /><p className="text-green-700 font-medium text-sm">{file.name}</p></>
                ) : (
                  <><FiUpload className="w-8 h-8 text-green-300" /><p className="text-green-600 font-medium text-sm">Tap to upload screenshot</p></>
                )}
              </label>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-green-800 mb-1.5">UPI Transaction ID <span className="text-green-400 font-normal text-xs">(optional)</span></label>
              <input type="text" value={upiTxnId} onChange={(e) => setUpiTxnId(e.target.value)} placeholder="e.g. 123456789012" className="input-field" />
            </div>

            <button onClick={submit} disabled={uploading || !file}
              className="btn-primary w-full justify-center disabled:opacity-60">
              {uploading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                : <><FiUpload className="w-4 h-4" /> Resubmit Payment</>}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
