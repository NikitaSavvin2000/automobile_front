import { getPlatformLink } from "../../utils/platform";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function UpdateRequiredModal({ data }: { data?: any }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (data) setIsOpen(true);
  }, [data]);

  if (!data || !isOpen) return null;
  if (!data.links || !data.message) return null;

  const link = getPlatformLink(data.links);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative bg-background rounded-2xl p-6 w-[90%] max-w-sm text-center">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-lg mb-6">{data.message}</p>
        <a
          href={link}
          className="block w-full py-3 rounded-xl bg-primary text-primary-foreground"
        >
          Обновить
        </a>
      </div>
    </div>
  );
}
