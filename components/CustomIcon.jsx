import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomIcon = ({
  onPress,
  ContainerStyle,
  isLoading,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
      className={`rounded-full flex items-center justify-center w-10 h-10 ${ContainerStyle} ${
        isLoading && "opacity-50"
      }`}
    >
      {icon && icon}
    </TouchableOpacity>
  );
};

export default CustomIcon;
