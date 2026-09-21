import { StoreHeader } from "@/components/stores/StoreHeader1";
import { StoreInfo } from "@/components/stores/StoreInfo";
import { StoreAddress } from "@/components/stores/StoreAddress";
import { StoreDescription } from "@/components/stores/StoreDescription";
import { StoreOwnerInfo } from "@/components/stores/StoreOwnerInfo";

const StorePage = () => {
  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      {/* Banner + Avatar + Actions */}
      <StoreHeader />

      {/* StoreInfo + StoreAddress — 6/6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StoreInfo />
        <StoreAddress />
      </div>

      {/* Full-width sections */}
      <StoreOwnerInfo />
      <StoreDescription />
    </div>
  );
};

export default StorePage;
