import { StoreHeader } from "../components/StoreHeader";
import { StoreInfo } from "../components/StoreInfo";
import { StoreAddress } from "../components/StoreAddress";
import { StoreDescription } from "../components/StoreDescription";
import { StoreOwnerInfo } from "../components/StoreOwnerInfo";

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
