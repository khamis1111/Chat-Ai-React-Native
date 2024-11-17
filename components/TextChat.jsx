import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { icons } from "../constants";
import Icon from "react-native-vector-icons/Ionicons";

const TextChat = ({ item, onPressCopy }) => {
  return (
    <View className="flex-row items-start space-x-3 my-4">
      <View className="border-2 border-secondary rounded-full w-10 h-10 p-2 items-center justify-center shadow-xl shadow-orange-700">
        {item.role === "user" ? (
          <>
            <Image
              source={icons.profile}
              resizeMode="contain"
              className="w-full h-full rounded-full"
            />
          </>
        ) : (
          <Text className="text-white font-psemibold">AI</Text>
        )}
      </View>
      <View className="flex-1 space-y-1">
        <Text className="text-white text-base font-psemibold mt-2">
          {item.parts[0].text}
        </Text>
        <TouchableOpacity onPress={onPressCopy} activeOpacity={0.7} className='w-6 h-6'>
          <Icon name="copy" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TextChat;
