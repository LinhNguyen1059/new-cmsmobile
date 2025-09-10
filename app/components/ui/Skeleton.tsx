import { View } from "react-native";

import { cn } from "@/utils/cn";

function Skeleton({
  className,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View className={cn("bg-accent animate-pulse rounded-md", className)} {...props} />;
}

export { Skeleton };
