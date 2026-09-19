import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { ArrowLeft, ArrowRight, CheckCircle2, Store } from "lucide-react";

import type { RegisterShopRequest } from "../types/register-shop.type";
import { RegisterShopStepper } from "../components/RegisterShopStepper";
import { StepAccountInfo } from "../components/StepAccountInfo";
import { StepOwnerIdentity } from "../components/StepOwnerIdentity";
import { StepShopInfo } from "../components/StepShopInfo";
import { StepShopAddress } from "../components/StepShopAddress";
import { RegisterShopSuccessModal } from "../components/RegisterShopSuccessModal";
import { Button } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { useAuth } from "@/context/useAuth";

const INITIAL_FORM_DATA: RegisterShopRequest = {
  // Step 1
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",

  // Step 2
  fullName: "",
  identityNumber: "",
  dateOfBirth: "",
  gender: "Nam",
  nationality: "Việt Nam",
  address: "",
  expiryDate: "",

  // Step 3
  shopName: "",
  shopDescription: "",
  logo: "",
  banner: "",
  bankName: "",
  bankNumber: "",
  ownerName: "",

  // Step 4
  provinceId: 0,
  districtId: 0,
  wardCode: "",
  street: "",
};

const RegisterShopPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userInfo } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  const methods = useForm<RegisterShopRequest>({
    defaultValues: {
      ...INITIAL_FORM_DATA,
      email: userInfo?.email || "",
      phone: userInfo?.phone || "",
      fullName: userInfo?.name || "",
    },
    mode: "onTouched",
  });

  const {
    trigger,
    handleSubmit,
    control,
    setValue,
  } = methods;

  // Tự động điền thông tin nếu đã đăng nhập và userInfo tải xong
  useEffect(() => {
    if (userInfo) {
      if (userInfo.email) setValue("email", userInfo.email);
      if (userInfo.phone) setValue("phone", userInfo.phone);
      if (userInfo.name) setValue("fullName", userInfo.name);
    }
  }, [userInfo, setValue]);

  // Step validation using trigger
  const handleNextStep = async () => {
    let fieldsToValidate: Array<keyof RegisterShopRequest> = [];

    if (currentStep === 1) {
      fieldsToValidate = isAuthenticated
        ? ["email", "phone"]
        : ["email", "phone", "password", "confirmPassword"];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "fullName",
        "identityNumber",
        "dateOfBirth",
        "gender",
        "nationality",
        "address",
        "expiryDate",
      ];
    } else if (currentStep === 3) {
      fieldsToValidate = ["shopName", "bankName", "bankNumber", "ownerName"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmitForm = async (data: RegisterShopRequest) => {
    const payload = { ...data };
    if (isAuthenticated) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    console.log("Dữ liệu đăng ký Shop hoàn tất:", payload);
    setIsSubmitting(true);
    try {
      // Giả lập xử lý submit form
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Lỗi đăng ký Shop:", error);
      setIsSubmitting(false);
    }
  };

  const shopNameValue = useWatch({ control, name: "shopName" });

  // Kiểm tra nếu tài khoản hiện tại đã là SHOP
  if (isAuthenticated && userInfo?.role === "SHOP") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 transition-colors flex items-center justify-center">
        <Container className="max-w-md mx-auto text-center">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Bạn đã sở hữu gian hàng!
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Tài khoản <span className="font-semibold text-zinc-900 dark:text-zinc-200">{userInfo.email}</span> của bạn đã được đăng ký làm Người Bán trên CommerceBook.
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <Button
                variant="primary"
                onClick={() => navigate("/shop")}
                className="w-full"
              >
                Vào Kênh Người Bán
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Về Trang Chủ
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-5 px-4 sm:px-6 transition-colors">
        <Container className="max-w-4xl mx-auto">
          {/* Header Title Section */}
          <div className="mb-4 text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Đăng Ký Mở Gian Hàng Kênh Người Bán
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Hoàn tất 4 bước đơn giản để tiếp cận hàng triệu khách hàng và bắt đầu bán hàng trên hệ thống CommerceBook.
            </p>
          </div>

          {/* Stepper Header & Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
            <RegisterShopStepper
              currentStep={currentStep}
              onStepClick={(stepId) => {
                if (stepId < currentStep) {
                  setCurrentStep(stepId);
                }
              }}
            />

            {/* Form Step Body Container */}
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                {currentStep === 1 && <StepAccountInfo />}
                {currentStep === 2 && <StepOwnerIdentity />}
                {currentStep === 3 && <StepShopInfo />}
                {currentStep === 4 && <StepShopAddress />}
              </div>

              {/* Action Navigation Footer */}
              <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
                <div>
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Quay lại
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate(-1)}
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Hủy bỏ
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleNextStep}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Tiếp theo (Bước {currentStep + 1}/4)
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      icon={<CheckCircle2 className="w-4 h-4" />}
                      className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/20"
                    >
                      Hoàn Tất Đăng Ký Shop
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </Container>

        {/* Registration Success Modal */}
        <RegisterShopSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          shopName={shopNameValue || "Gian Hàng Mới"}
          onGoToDashboard={() => {
            setIsSuccessModalOpen(false);
            navigate("/");
          }}
        />
      </div>
    </FormProvider>
  );
};

export default RegisterShopPage;