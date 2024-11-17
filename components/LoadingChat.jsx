import { View } from "react-native";
import * as Animatable from "react-native-animatable";

const LoadingChat = () => {
  const OpavityInOut = {
    0: {
      opacity: 1,
    },
    0.5: {
      opacity: 0.5,
    },
    1: {
      opacity: 1,
    },
  };
  return (
    <Animatable.View
      className="flex-row items-start space-x-3"
      animation={OpavityInOut}
      iterationCount={"infinite"}
      duration={1500}
    >
      <View className="rounded-full w-10 h-10 p-2 bg-gray-100/50" />
      <View className="flex-1 space-y-1">
        <View className="bg-gray-100/50 h-4 rounded-2xl mt-2" />
        <View className="bg-gray-100/50 h-4 rounded-2xl w-1/2" />
        <View className="border-2 border-black-200 rounded-full w-6 h-6 p-2 bg-gray-100/50" />
      </View>
    </Animatable.View>
  );
};

export default LoadingChat;
