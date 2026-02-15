import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadRoiPdf } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface PdfDownloadCardProps {
  uuid?: string;
}

export const PdfDownloadCard = ({ uuid }: PdfDownloadCardProps) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!uuid) return;
    setDownloading(true);
    try {
      const blob = await downloadRoiPdf(uuid);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roi-report-${uuid}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Download started!', description: 'Your detailed ROI report is downloading.' });
    } catch (err) {
      toast({
        title: 'Download failed',
        description: err instanceof Error ? err.message : 'Could not download the report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="glass-card p-6 glow-purple"
    >
      <div className="flex items-center gap-3">
        <div className="gradient-purple inline-flex rounded-xl p-2.5">
          <FileDown className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Detailed Report</h3>
          <p className="text-sm text-white/40">Download your full ROI analysis</p>
        </div>
      </div>
      <Button
        className="mt-4 w-full gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] text-white font-semibold hover:opacity-90 transition-opacity border-0"
        disabled={!uuid || downloading}
        onClick={handleDownload}
      >
        {downloading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Generating PDF...
          </>
        ) : (
          <>
            <FileDown className="h-4 w-4" /> Download Detailed ROI Report (PDF)
          </>
        )}
      </Button>
      {!uuid && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-white/30">
          <AlertCircle className="h-3 w-3" /> Report unavailable — missing calculation ID
        </p>
      )}
    </motion.div>
  );
};
