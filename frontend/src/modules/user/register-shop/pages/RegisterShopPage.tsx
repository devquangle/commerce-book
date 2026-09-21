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
import { useRegisterShop } from "../hooks/useRegisterShop";
import { registerShopService } from "../services/register-shop.service";
import { showErrorToast } from "@/libs/utils/toastUtil";

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
  const [isValidatingStep, setIsValidatingStep] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  const registerShopMutation = useRegisterShop(isAuthenticated);

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
    getValues,
    setError,
  } = methods;

  // Tự động điền thông tin nếu đã đăng nhập và userInfo tải xong
  useEffect(() => {
    if (userInfo) {
      if (userInfo.email) setValue("email", userInfo.email);
      if (userInfo.phone) setValue("phone", userInfo.phone);
      if (userInfo.name) setValue("fullName", userInfo.name);
    }
  }, [userInfo, setValue]);

  // Step validation using trigger and server-side availability checks
  const handleNextStep = async () => {
    let fieldsToValidate: Array<keyof RegisterShopRequest> = [];

    if (currentStep === 1) {
      // Bước 1: Chỉ kiểm tra thông tin tài khoản đăng nhập
      fieldsToValidate = isAuthenticated
        ? []
        : ["email", "password", "confirmPassword"];
    } else if (currentStep === 2) {
      // Bước 2: Kiểm tra thông tin định danh chủ sở hữu trích xuất từ eKYC
      fieldsToValidate = [
        "fullName",
        "identityNumber",
        "dateOfBirth",
        "gender",
        "nationality",
        "address",
        "expiryDate",
      ];

      const fullName = getValues("fullName");
      const identityNumber = getValues("identityNumber");
      const dateOfBirth = getValues("dateOfBirth");
      if (!fullName || !identityNumber || !dateOfBirth) {
        console.warn("⚠️ [RegisterShop Step 2] Chưa hoàn tất eKYC định danh chủ sở hữu");
        showErrorToast("Vui lòng hoàn tất xác thực eKYC giấy tờ trước khi sang bước tiếp theo!");
        return;
      }
    } else if (currentStep === 3) {
      // Bước 3: Kiểm tra thông tin gian hàng, số điện thoại liên hệ và ngân hàng
      fieldsToValidate = [
        "shopName",
        "phone",
        "bankName",
        "bankNumber",
        "ownerName",
      ];
    }

    console.log(`👉 [RegisterShop Step ${currentStep}] Đang kiểm tra các trường:`, fieldsToValidate);
    console.log(`👉 [RegisterShop Step ${currentStep}] Giá trị form hiện tại:`, getValues());

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) {
        console.warn(`⚠️ [RegisterShop Step ${currentStep}] Form validation thất bại:`, methods.formState.errors);
        return;
      }
    }

    // Bước 1: Kiểm tra tài khoản (email) trên server
    if (currentStep === 1) {
      setIsValidatingStep(true);
      try {
        if (isAuthenticated) {
          // TH1: Đã đăng nhập -> chỉ cần kiểm tra xem tài khoản đã có shop chưa
          const checkRes = await registerShopService.checkAccountAvailability(
            undefined,
            undefined,
            true
          );
          if (checkRes.alreadyHasShop) {
            showErrorToast("Tài khoản của bạn đã sở hữu một cửa hàng trên hệ thống!");
            setIsValidatingStep(false);
            return;
          }
        } else {
          // TH2: Khách vãng lai -> kiểm tra email đã được đăng ký hay chưa
          const email = getValues("email");
          console.log("👉 [RegisterShop Step 1] Kiểm tra tính khả dụng của email:", email);
          const checkRes = await registerShopService.checkAccountAvailability(
            email,
            undefined,
            false
          );
          console.log("👉 [RegisterShop Step 1] Kết quả checkAccountAvailability:", checkRes);

          if (checkRes.emailExists) {
            setError("email", {
              type: "manual",
              message: "Email này đã được sử dụng.",
            });
            showErrorToast("Email này đã được sử dụng.");
            setIsValidatingStep(false);
            return;
          }
        }
      } catch (err) {
        console.error("❌ [RegisterShop Step 1] Lỗi kiểm tra tài khoản:", err);
      } finally {
        setIsValidatingStep(false);
      }
    }

    // Bước 3: Kiểm tra tên shop và số điện thoại liên hệ trên server
    if (currentStep === 3) {
      const shopName = getValues("shopName");
      const phone = getValues("phone");

      setIsValidatingStep(true);
      try {
        // 1. Kiểm tra tên shop trùng lặp
        if (shopName) {
          console.log("👉 [RegisterShop Step 3] Kiểm tra tên shop:", shopName);
          const exists = await registerShopService.checkShopNameExists(shopName.trim());
          console.log("👉 [RegisterShop Step 3] Tên shop tồn tại?:", exists);
          if (exists) {
            setError("shopName", {
              type: "manual",
              message: "Tên gian hàng này đã tồn tại trên hệ thống. Vui lòng chọn tên khác.",
            });
            showErrorToast("Tên gian hàng đã tồn tại trên hệ thống!");
            setIsValidatingStep(false);
            return;
          }
        }

        // 2. Kiểm tra số điện thoại liên hệ trùng lặp
        if (phone) {
          console.log("👉 [RegisterShop Step 3] Kiểm tra tính khả dụng của số điện thoại:", phone);
          const checkRes = await registerShopService.checkAccountAvailability(
            undefined,
            phone,
            isAuthenticated
          );
          console.log("👉 [RegisterShop Step 3] Kết quả check phone availability:", checkRes);

          if (checkRes.phoneExists) {
            setError("phone", {
              type: "manual",
              message: "Số điện thoại này đã được sử dụng bởi một tài khoản khác.",
            });
            showErrorToast("Số điện thoại này đã được sử dụng. Vui lòng nhập số điện thoại khác!");
            setIsValidatingStep(false);
            return;
          }
        }
      } catch (err) {
        console.error("❌ [RegisterShop Step 3] Lỗi kiểm tra thông tin bước 3:", err);
      } finally {
        setIsValidatingStep(false);
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmitForm = async (data: RegisterShopRequest) => {
    console.log("👉 [RegisterShop SUBMIT] Form raw data:", data);

    // Đồng bộ kiểm tra tất cả các trường NotBlank / NotNull theo đúng Backend DTO
    const requiredChecks = [
      { field: "phone", val: data.phone?.trim(), msg: "Số điện thoại liên hệ không được để trống (Bước 3)" },
      { field: "fullName", val: data.fullName?.trim(), msg: "Họ và tên chủ sở hữu không được để trống (Bước 2)" },
      { field: "identityNumber", val: data.identityNumber?.trim(), msg: "Số CCCD/CMND không được để trống (Bước 2)" },
      { field: "dateOfBirth", val: data.dateOfBirth, msg: "Ngày sinh không được để trống (Bước 2)" },
      { field: "gender", val: data.gender?.trim(), msg: "Giới tính không được để trống (Bước 2)" },
      { field: "nationality", val: data.nationality?.trim(), msg: "Quốc tịch không được để trống (Bước 2)" },
      { field: "address", val: data.address?.trim(), msg: "Địa chỉ thường trú không được để trống (Bước 2)" },
      { field: "expiryDate", val: data.expiryDate, msg: "Ngày hết hạn CCCD không được để trống (Bước 2)" },
      { field: "shopName", val: data.shopName?.trim(), msg: "Tên cửa hàng không được để trống (Bước 3)" },
      { field: "bankName", val: data.bankName?.trim(), msg: "Tên ngân hàng thụ hưởng không được để trống (Bước 3)" },
      { field: "bankNumber", val: data.bankNumber?.trim(), msg: "Số tài khoản ngân hàng không được để trống (Bước 3)" },
      { field: "ownerName", val: data.ownerName?.trim(), msg: "Tên chủ tài khoản không được để trống (Bước 3)" },
      { field: "provinceId", val: Number(data.provinceId) > 0, msg: "Vui lòng chọn Tỉnh / Thành phố (Bước 4)" },
      { field: "districtId", val: Number(data.districtId) > 0, msg: "Vui lòng chọn Quận / Huyện (Bước 4)" },
      { field: "wardCode", val: data.wardCode?.trim(), msg: "Vui lòng chọn Phường / Xã (Bước 4)" },
      { field: "street", val: data.street?.trim(), msg: "Địa chỉ chi tiết không được để trống (Bước 4)" },
    ];

    const missingField = requiredChecks.find((item) => !item.val);
    if (missingField) {
      console.warn("⚠️ [RegisterShop SUBMIT] Thiếu trường bắt buộc:", missingField);
      showErrorToast(missingField.msg);
      return;
    }

    const payload = { ...data };
    if (isAuthenticated) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    payload.provinceId = Number(payload.provinceId);
    payload.districtId = Number(payload.districtId);

    console.log("👉 [RegisterShop SUBMIT] Payload chuẩn bị gửi lên backend:", payload);

    try {
      const res = await registerShopMutation.mutateAsync(payload);
      console.log("✅ [RegisterShop SUBMIT] Thành công, response:", res);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("❌ [RegisterShop SUBMIT ERROR] Lỗi đầy đủ:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosErr = error as { response?: { status?: number; data?: unknown } };
        console.error("❌ [RegisterShop SUBMIT ERROR] HTTP Status:", axiosErr.response?.status);
        console.error("❌ [RegisterShop SUBMIT ERROR] Response data từ Backend:", axiosErr.response?.data);
      }
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
                      isLoading={isValidatingStep}
                      disabled={isValidatingStep}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Tiếp theo (Bước {currentStep + 1}/4)
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={registerShopMutation.isPending}
                      disabled={registerShopMutation.isPending}
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
        />
      </div>
    </FormProvider>
  );
};

export default RegisterShopPage;