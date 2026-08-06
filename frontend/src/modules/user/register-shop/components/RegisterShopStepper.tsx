import React from "react";
import { UserCheck, ShieldCheck, Store, MapPin, Check } from "lucide-react";

export interface StepItem {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export interface RegisterShopStepperProps {
  currentStep: number;
  steps?: StepItem[];
  onStepClick?: (stepId: number) => void;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    id: 1,
    title: "Tài khoản",
    subtitle: "Thông tin đăng nhập",
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Định danh",
    subtitle: "Thông tin chủ shop",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Thông tin Shop",
    subtitle: "Tên shop & Ngân hàng",
    icon: <Store className="w-5 h-5" />,
  },
  {
    id: 4,
    title: "Địa chỉ Shop",
    subtitle: "Kho & Địa chỉ nhận hàng",
    icon: <MapPin className="w-5 h-5" />,
  },
];

export const RegisterShopStepper: React.FC<RegisterShopStepperProps> = ({
  currentStep,
  steps = DEFAULT_STEPS,
  onStepClick,
}) => {
  return (
    <div className="w-full py-4 mb-6">
      <div className="flex items-center justify-between relative max-w-4xl mx-auto">
        {/* Connecting progress bar line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0 hidden sm:block">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step Items */}
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={`relative z-10 flex flex-col items-center flex-1 transition-all cursor-pointer ${
                onStepClick && isCompleted ? "hover:opacity-80" : ""
              }`}
              onClick={() => {
                if (onStepClick && isCompleted) {
                  onStepClick(step.id);
                }
              }}
            >
              {/* Step Circle Icon */}
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                  isCompleted
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950/50"
                    : isActive
                    ? "bg-blue-600 text-white ring-4 ring-blue-500/20 scale-110"
                    : "bg-white dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  step.icon
                )}
              </div>

              {/* Step Title & Subtitle */}
              <div className="mt-2.5 text-center">
                <p
                  className={`text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : isCompleted
                      ? "text-zinc-900 dark:text-white"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  <span className="hidden sm:inline">Bước {step.id}: </span>
                  {step.title}
                </p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 hidden md:block mt-0.5">
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegisterShopStepper;
