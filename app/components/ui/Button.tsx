import { ComponentType } from "react";
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

import { Text, TextProps } from "./Text";

export interface ButtonAccessoryProps {
  style?: StyleProp<any>;
  clasName?: string;
  pressableState: PressableStateCallbackType;
  disabled?: boolean;
}

export interface BaseButtonProps extends PressableProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"];
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"];
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"];
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>;
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>;
  /**
   * Children components.
   */
  children?: React.ReactNode;
  /**
   * disabled prop, accessed directly for declarative styling reasons.
   * https://reactnative.dev/docs/pressable#disabled
   */
  disabled?: boolean;
  /**
   * An optional style override for the disabled state
   */
  disabledStyle?: StyleProp<ViewStyle>;
}

const buttonVariants = cva(
  "group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none",
  {
    variants: {
      variant: {
        default: "bg-primary shadow-sm shadow-black/5",
        destructive:
          "bg-destructive active:bg-destructive/90 dark:bg-destructive/60 shadow-sm shadow-black/5",
        outline:
          "border-border bg-background active:bg-accent dark:bg-input/30 dark:border-input dark:active:bg-input/50 border shadow-sm shadow-black/5",
        secondary: "active:bg-secondary/80 bg-secondary shadow-sm shadow-black/5",
        ghost: "active:bg-accent dark:active:bg-accent/50",
        link: "",
      },
      size: {
        default: "h-10 px-4 py-2 sm:h-9",
        sm: "h-9 gap-1.5 rounded-md px-3 sm:h-8",
        lg: "h-11 rounded-md px-6 sm:h-10",
        icon: "h-10 w-10 sm:h-9 sm:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva("text-foreground font-medium text-sm", {
  variants: {
    variant: {
      default: "text-white",
      destructive: "text-white",
      outline: "group-active:text-accent-foreground",
      secondary: "text-secondary-foreground",
      ghost: "group-active:text-accent-foreground",
      link: "text-primary group-active:underline",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = BaseButtonProps & VariantProps<typeof buttonVariants>;

function Button(props: ButtonProps) {
  const {
    tx,
    text,
    txOptions,
    variant,
    size,
    children,
    RightAccessory,
    LeftAccessory,
    disabled,
    ...rest
  } = props;

  return (
    <Pressable
      role="button"
      {...rest}
      className={cn(disabled && "opacity-50", buttonVariants({ variant, size }), rest.className)}
      disabled={disabled}
    >
      {(state) => (
        <>
          {!!LeftAccessory && (
            <LeftAccessory clasName="ml-1" pressableState={state} disabled={disabled} />
          )}

          <Text
            tx={tx}
            text={text}
            txOptions={txOptions}
            variant="button"
            className={cn(
              "text-center",
              buttonTextVariants({ variant, size }),
              state.pressed && "opacity-80",
            )}
          >
            {children}
          </Text>

          {!!RightAccessory && (
            <RightAccessory clasName="mr-1" pressableState={state} disabled={disabled} />
          )}
        </>
      )}
    </Pressable>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
