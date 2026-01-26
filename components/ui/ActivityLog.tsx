"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityStatus = "pending" | "running" | "success" | "error" | "warning" | "info";

export interface Activity {
  id: string;
  message: string;
  status: ActivityStatus;
  timestamp: Date;
  details?: string;
}

interface ActivityLogProps {
  activities: Activity[];
  className?: string;
  maxHeight?: string;
  autoScroll?: boolean;
  showTimestamp?: boolean;
}

export default function ActivityLog({
  activities,
  className,
  maxHeight = "400px",
  autoScroll = true,
  showTimestamp = true,
}: ActivityLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activities, autoScroll]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "bg-gray-950 border border-gray-800 rounded-lg p-4 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900",
        className
      )}
      style={{ maxHeight }}
    >
      <AnimatePresence initial={false}>
        {activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            showTimestamp={showTimestamp}
            isLast={index === activities.length - 1}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ActivityItemProps {
  activity: Activity;
  showTimestamp: boolean;
  isLast: boolean;
}

function ActivityItem({ activity, showTimestamp, isLast }: ActivityItemProps) {
  const getIcon = () => {
    switch (activity.status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-cyan-500 animate-spin flex-shrink-0" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-600 flex-shrink-0" />;
    }
  };

  const getTextColor = () => {
    switch (activity.status) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "warning":
        return "text-amber-400";
      case "running":
        return "text-cyan-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className={cn("flex items-start gap-3 py-2", !isLast && "border-b border-gray-800/50")}
    >
      {getIcon()}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {showTimestamp && (
            <span className="text-xs text-gray-600">[{formatTime(activity.timestamp)}]</span>
          )}
          <span className={cn("font-medium", getTextColor())}>{activity.message}</span>
        </div>

        {activity.details && (
          <div className="mt-1 text-xs text-gray-500 pl-4 border-l-2 border-gray-800">
            {activity.details}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Hook para gerenciar activities
export function useActivityLog() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = (message: string, status: ActivityStatus = "info", details?: string) => {
    const activity: Activity = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      status,
      timestamp: new Date(),
      details,
    };
    setActivities((prev) => [...prev, activity]);
    return activity.id;
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, ...updates } : activity
      )
    );
  };

  const clearActivities = () => {
    setActivities([]);
  };

  return {
    activities,
    addActivity,
    updateActivity,
    clearActivities,
  };
}

function useState<T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const ref = useRef<T>(initialState);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const setState = (value: T | ((prev: T) => T)) => {
    const newValue = typeof value === "function" ? (value as Function)(ref.current) : value;
    ref.current = newValue;
    forceUpdate();
  };

  return [ref.current, setState];
}

function useReducer(reducer: (x: number) => number, initialState: number): [number, () => void] {
  const ref = useRef<number>(initialState);
  const forceUpdateRef = useRef<(() => void) | null>(null);

  if (!forceUpdateRef.current) {
    forceUpdateRef.current = () => {
      ref.current = reducer(ref.current);
    };
  }

  return [ref.current, forceUpdateRef.current];
}
