import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { cn } from '../lib/utils';

const NotificationIcon = ({ type }: { type: string }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };
  
  const Icon = icons[type as keyof typeof icons] || Info;
  return <Icon className="w-5 h-5" />;
};

const NotificationItem = ({ notification }: { notification: any }) => {
  const { removeNotification } = useNotificationStore();
  
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: 'spring', duration: 0.5 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md',
        typeStyles[notification.type as keyof typeof typeStyles]
      )}
    >
      <NotificationIcon type={notification.type} />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-relaxed">
          {notification.message}
        </p>
      </div>
      
      <button
        onClick={() => removeNotification(notification.id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const NotificationContainer = () => {
  const { notifications } = useNotificationStore();
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
