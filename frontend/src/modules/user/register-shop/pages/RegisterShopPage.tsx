import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Store, ShieldAlert } from "lucide-react";

import { RegisterShopStepper } from "../components/RegisterShopStepper";
import { StepAccountInfo } from "../components/StepAccountInfo";
import { StepOwnerIdentity } from "../components/StepOwnerIdentity";
import { StepShopInfo } from "../components/StepShopInfo";
import { StepShopAddress } from "../components/StepShopAddress";
import { RegisterShopSuccessModal } from "../components/RegisterShopSuccessModal";
import { Button } from "@/components/common/Button";
import Container from "@/components/common/Container";
import type { RegisterShopRequest } from "../types/register-shop.type";

const INITIAL_FORM_DATA: RegisterShopRequest = {
  // Step 1
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",

  // Step 2
  fullName: "",
  cccd: "",
  dob: "",
  sex: "",
  issueDate: "",
  expiryDate: "",
  address: "",

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

const RegisterShopPage=() => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<RegisterShopRequest>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  // Partial update helper
  const handleUpdateFormData = (fields: Partial<RegisterShopRequest>) => {
    setFormData((prev) => ({ ...prev, ...fields }));

    // Clear errors for updated fields
    const updatedKeys = Object.keys(fields);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      updatedKeys.forEach((key) => {
        delete newErrors[key];
      });
      return newErrors;
    });
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.email.trim()) {
      errs.email = "Vui lòng nhập email chủ sở hữu";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Định dạng email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone.trim())) {
      errs.phone = "Số điện thoại không đúng định dạng Việt Nam (10 chữ số)";
    }

    if (!formData.password) {
      errs.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      errs.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = "Vui lòng nhập họ và tên chủ sở hữu";
    }

    if (!formData.cccd.trim()) {
      errs.cccd = "Vui lòng nhập số CCCD / CMND";
    } else if (!/^[0-9]{9,12}$/.test(formData.cccd.trim())) {
      errs.cccd = "Số CCCD/CMND gồm từ 9 đến 12 chữ số";
    }

    if (!formData.dob) {
      errs.dob = "Vui lòng chọn ngày sinh";
    }

    if (!formData.sex) {
      errs.sex = "Vui lòng chọn giới tính";
    }

    if (!formData.issueDate) {
      errs.issueDate = "Vui lòng chọn ngày cấp CCCD";
    }

    if (!formData.address.trim()) {
      errs.address = "Vui lòng nhập địa chỉ thường trú";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.shopName.trim()) {
      errs.shopName = "Vui lòng nhập tên Cửa hàng";
    }

    if (!formData.bankName) {
      errs.bankName = "Vui lòng chọn ngân hàng thụ hưởng";
    }

    if (!formData.bankNumber.trim()) {
      errs.bankNumber = "Vui lòng nhập số tài khoản ngân hàng";
    }

    if (!formData.ownerName.trim()) {
      errs.ownerName = "Vui lòng nhập tên chủ tài khoản ngân hàng";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 Validation
  const validateStep4 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.provinceId) {
      errs.provinceId = "Vui lòng chọn Tỉnh / Thành phố";
    }

    if (!formData.districtId) {
      errs.districtId = "Vui lòng chọn Quận / Huyện";
    }

    if (!formData.wardCode) {
      errs.wardCode = "Vui lòng chọn Phường / Xã";
    }

    if (!formData.street.trim()) {
      errs.street = "Vui lòng nhập số nhà, tên đường chi tiết";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Go Next
  const handleNextStep = () => {
    let isValid = false;

    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Go Back
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Shop Registration
  const handleSubmit = async () => {
    if (!validateStep4()) return;

    setIsSubmitting(true);
    try {
      // Simulate API registration call delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Lỗi đăng ký Shop:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 transition-colors">
      <Container className="max-w-4xl mx-auto">
        {/* Header Title Section */}
        <div className="mb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Store className="w-3.5 h-3.5" /> CommerceBook Seller Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Đăng Ký Mở Gian Hàng Kênh Người Bán
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Hoàn tất 4 bước đơn giản để tiếp cận hàng triệu khách hàng và bắt đầu bán hàng trên hệ thống CommerceBook.
          </p>
        </div>

        {/* Stepper Header */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
          <RegisterShopStepper
            currentStep={currentStep}
            onStepClick={(stepId) => {
              if (stepId < currentStep) {
                setCurrentStep(stepId);
              }
            }}
          />

          {/* Form Step Body Container */}
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {currentStep === 1 && (
              <StepAccountInfo
                data={formData}
                onChange={handleUpdateFormData}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <StepOwnerIdentity
                data={formData}
                onChange={handleUpdateFormData}
                errors={errors}
              />
            )}

            {currentStep === 3 && (
              <StepShopInfo
                data={formData}
                onChange={handleUpdateFormData}
                errors={errors}
              />
            )}

            {currentStep === 4 && (
              <StepShopAddress
                data={formData}
                onChange={handleUpdateFormData}
                errors={errors}
              />
            )}
          </div>

          {/* Global error banner if validation fails */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-6 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc trước khi chuyển bước.</span>
            </div>
          )}

          {/* Action Navigation Footer */}
          <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
            <div>
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Quay lại
                </Button>
              ) : (
                <Button
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
                  variant="primary"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Tiếp theo (Bước {currentStep + 1}/4)
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/20"
                >
                  Hoàn Tất Đăng Ký Shop
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Registration Success Modal */}
      <RegisterShopSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        shopName={formData.shopName || "Gian Hàng Mới"}
        onGoToDashboard={() => {
          setIsSuccessModalOpen(false);
          navigate("/");
        }}
      />
    </div>
  );
};

export default RegisterShopPage;