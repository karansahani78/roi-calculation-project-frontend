import { motion } from 'framer-motion';
import { Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareCardProps {
  shareableUrl?: string;
}

export const ShareCard = ({ shareableUrl }: ShareCardProps) => {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="glass-card p-6 glow-blue"
    >
      <div className="flex items-center gap-3">
        <div className="gradient-blue inline-flex rounded-xl p-2.5">
          <Share2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Share Results</h3>
          <p className="text-sm text-white/40">Send this analysis to anyone</p>
        </div>
      </div>
      <Button
        className="mt-4 w-full gap-2 rounded-xl bg-gradient-to-r from-[#4C6FFF] to-[#2D9CDB] text-white font-semibold hover:opacity-90 transition-opacity border-0"
        onClick={() => {
          const url = shareableUrl || window.location.href;
          navigator.clipboard.writeText(url).then(() => {
            toast({ title: 'Link copied!', description: 'Share this link with anyone to view your ROI analysis.' });
          }).catch(() => {
            toast({ title: 'Copy failed', description: 'Please copy the URL from your browser address bar.', variant: 'destructive' });
          });
        }}
      >
        <Copy className="h-4 w-4" /> Copy Link
      </Button>
    </motion.div>
  );
};
