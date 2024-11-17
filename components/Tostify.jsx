import { useEffect } from "react";
import { Image } from "react-native";
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";

const Tostify = ({ type, text, setHide, hide }) => {
  // const [hide, setHide] = useState(false);

  useEffect(() => {
    const toast = setTimeout(() => {
      setHide(false);
    }, 4000);

    return () => {
      clearTimeout(toast);
    };
  }, [hide]);
  
  return (
    <Animatable.View
      animation={hide.hide ? "slideInDown" : "slideInUp"}
      className={`flex-row items-center space-x-1 mx-4 absolute top-16 ${
        type === "success"
          ? "bg-[#003b1b76] border-[#004d26] shadow-[#005d26]"
          : "bg-[#3a0f157d] border-[#4d1118] shadow-[#4d1118]"
      }  p-3 rounded-xl border-2 shadow-2xl`}
    >
      <Image
        source={type === "success" ? icons.success : icons.error}
        resizeMode="contain"
        className="w-8 h-8 rounded-full"
      />
      <Animatable.Text
        animation={"fadeIn"}
        className="text-white font-psemibold text-lg flex-1"
      >
        {text}
      </Animatable.Text>
    </Animatable.View>
  );
};

export default Tostify;
