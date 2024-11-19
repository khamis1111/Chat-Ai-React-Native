import { View, Text, TextInput, Image } from "react-native";
import React from "react";
import { icons } from "../constants";
import CustomIcon from "./CustomIcon";
import Camera from "react-native-vector-icons/MaterialIcons";

const CustomInput = ({
  title,
  placeholder,
  value,
  onChangeText,
  showPassword,
  onPressLeftIcon1,
  onPressLeftIcon2,
  onPressRightIcon,
  loading,
}) => {
  return (
    <View className="gap-y-2">
      {title && <Text className="text-white font-pregular">{title}</Text>}
      <View className="w-full bg-black-100 h-14 rounded-2xl border-2 border-black-200 focus:border-secondary flex-row justify-between items-center px-1">
        <CustomIcon
          onPress={onPressLeftIcon2}
          isLoading={loading}
          ContainerStyle={"opacity-90"}
          icon={<Camera name="camera" size={25} color="#fff" />}
        />
        <CustomIcon
          onPress={onPressLeftIcon1}
          isLoading={loading}
          icon={
            <Image
              source={icons.upload}
              resizeMode="contain"
              className="w-6 h-6"
            />
          }
        />
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          onChangeText={onChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          className="h-full flex-1 mt-2 text-white font-psemibold"
          readOnly={loading}
          multiline={true}
          editable={true}
          scrollEnabled={true} // Allow scrolling for long text
        />
        <CustomIcon
          onPress={onPressRightIcon}
          isLoading={loading}
          icon={
            <Image
              source={icons.plus}
              resizeMode="contain"
              className="w-6 h-6"
            />
          }
        />
      </View>
    </View>
  );
};

export default CustomInput;
