import { ComponentType, forwardRef, Ref, useImperativeHandle, useRef } from "react";
import {
  ImageStyle,
  StyleProp,
  // eslint-disable-next-line no-restricted-imports
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { translate } from "@/i18n/translate";
import { useAppTheme } from "@/theme/context";
import { cn } from "@/utils/cn";

import { Text, TextProps } from "./Text";

export interface TextFieldAccessoryProps {
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  status: TextFieldProps["status"];
  multiline: boolean;
  editable: boolean;
  className?: string;
}

export interface TextFieldProps extends Omit<TextInputProps, "ref"> {
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled";
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps["text"];
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps["tx"];
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps["txOptions"];
  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: TextProps;
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps["text"];
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps["tx"];
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps["txOptions"];
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps;
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps["text"];
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: TextProps["tx"];
  /**
   * Optional placeholder options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  placeholderTxOptions?: TextProps["txOptions"];
  /**
   * An optional component to render on the right side of the input.
   * Example: `RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  RightAccessory?: ComponentType<TextFieldAccessoryProps>;
  /**
   * An optional component to render on the left side of the input.
   * Example: `LeftAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  LeftAccessory?: ComponentType<TextFieldAccessoryProps>;
  rootClassName?: string;
  wrapperInputClassName?: string;
  labelTextClassName?: string;
  helperTextClassName?: string;
}

const Input = forwardRef(function TextField(props: TextFieldProps, ref: Ref<TextInput>) {
  const {
    labelTx,
    label,
    labelTxOptions,
    placeholderTx,
    placeholder,
    placeholderTxOptions,
    helper,
    helperTx,
    helperTxOptions,
    status,
    RightAccessory,
    LeftAccessory,
    rootClassName,
    wrapperInputClassName,
    labelTextClassName,
    helperTextClassName,
    ...TextInputProps
  } = props;
  const {
    theme: { colors, isDark },
  } = useAppTheme();

  const input = useRef<TextInput>(null);

  const disabled = TextInputProps.editable === false || status === "disabled";

  const placeholderContent = placeholderTx
    ? translate(placeholderTx, placeholderTxOptions)
    : placeholder;

  function focusInput() {
    if (disabled) return;

    input.current?.focus();
  }

  useImperativeHandle(ref, () => input.current as TextInput);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={focusInput}
      accessibilityState={{ disabled }}
      className={rootClassName}
    >
      {!!(label || labelTx) && (
        <Text
          variant="body2"
          text={label}
          tx={labelTx}
          txOptions={labelTxOptions}
          className={cn("mb-1 font-medium", labelTextClassName)}
        />
      )}

      <View
        className={cn(
          "flex-row items-start overflow-hidden rounded border border-neutral-200",
          wrapperInputClassName,
        )}
      >
        {!!LeftAccessory && (
          <LeftAccessory
            className="ml-2 h-10 items-center justify-center"
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}

        <TextInput
          ref={input}
          underlineColorAndroid="transparent"
          textAlignVertical="top"
          placeholder={placeholderContent}
          {...TextInputProps}
          placeholderTextColor={isDark ? colors["neutral-400"] : colors["neutral-500"]}
          editable={!disabled}
          className={cn(
            "mx-3 my-2 h-6 flex-1 self-stretch px-0 py-0 font-regular text-base leading-6 text-black dark:text-white",
            disabled && "text-neutral-500 dark:text-neutral-400",
            props.multiline && "h-auto min-h-[40px] py-2",
            TextInputProps?.className,
          )}
        />

        {!!RightAccessory && (
          <RightAccessory
            className="mr-2 h-10 items-center justify-center"
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}
      </View>

      {!!(helper || helperTx) && (
        <Text
          variant="caption"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          className={cn("mt-1", helperTextClassName)}
        />
      )}
    </TouchableOpacity>
  );
});

export { Input };
