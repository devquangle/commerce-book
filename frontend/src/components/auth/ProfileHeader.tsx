
interface ProfileHeaderProps {
  title?: string;
  subTitle?: string;
  layout?: "horizontal" | "vertical";
  hasCard?: boolean;
}

export const ProfileHeader = ({
  title = "Thông tin cá nhân",
  subTitle,
  layout = "horizontal",
  hasCard = false,
}: ProfileHeaderProps) => {
  return (
    <div 
      className={`flex ${
        layout === "vertical" ? "flex-col items-start gap-2" : "justify-between items-center"
      } ${hasCard ? "card-custom" : ""}`}
    >
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="body-text text-zinc-500 dark:text-zinc-400 mt-1">
          {subTitle}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
