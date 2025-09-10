import { ReactNode, forwardRef, ForwardedRef } from "react";
// eslint-disable-next-line no-restricted-imports
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { VariantProps, cva } from "class-variance-authority";
import { TOptions } from "i18next";

import { TxKeyPath } from "@/i18n";
import { translate } from "@/i18n/translate";
import { cn } from "@/utils/cn";

export interface TextProps extends RNTextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath;
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string;
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TOptions;
  /**
   * Children components.
   */
  children?: ReactNode;
}

const textVariants = cva("font-regular text-black dark:text-white", {
  variants: {
    variant: {
      h1: "font-bold text-4xl leading-11",
      h2: "font-bold text-3xl leading-9.5",
      h3: "font-bold text-2xl leading-8",
      h4: "font-bold text-xl leading-7",
      h5: "font-bold text-lg leading-6.5",
      subtitle1: "font-medium text-lg leading-6.5",
      subtitle2: "font-medium text-base leading-7",
      body1: "text-base leading-6",
      body2: "text-sm leading-5.5",
      button: "font-semibold text-sm leading-5.5",
      caption: "text-xs leading-5",
      header: "font-medium text-base leading-6",
    },
  },
  defaultVariants: {
    variant: "body1",
  },
});

const Text = forwardRef(function Text(
  props: TextProps & VariantProps<typeof textVariants>,
  ref: ForwardedRef<RNText>,
) {
  const { tx, className, variant, txOptions, text, children, ...rest } = props;

  const i18nText = tx && translate(tx, txOptions);
  const content = i18nText || text || children;

  return (
    <RNText className={cn(textVariants({ variant }), className)} {...rest} ref={ref}>
      {content}
    </RNText>
  );
});

export { Text };
