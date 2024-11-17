import * as DocumentPicker from "expo-document-picker";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
  I18nManager,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import CustomInput from "../components/CustomInput";
import LoadingChat from "../components/LoadingChat";
import TextChat from "../components/TextChat";
import Tostify from "../components/Tostify";
import * as FileSystem from "expo-file-system";
import {
  launchCameraAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Main = () => {
  const [hide, setHide] = useState({
    type: "error",
    hide: false,
    text: "",
  });

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const flatListRef = useRef(null);

  const onRefresh = () => {
    setRefreshing(true);
    setMessages([]);
    setText("");
    setLoading(false);
    setRefreshing(false);
  };

  const selectMedia = async () => {
    const permissionResult = await requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      setHide({
        ...hide,
        type: "error",
        hide: true,
        text: "Camera access is needed to take photos.",
      });
      return;
    }

    const result = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.All,
      quality: 0,
    });
    if (!result.canceled) {
      setFiles(result.assets[0]);
    } else {
      setHide({
        ...hide,
        type: "error",
        hide: true,
        text: "Canceled",
      });
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        quality: 0,
      });

      if (!result.canceled) {
        setFiles(result.assets[0]);
      } else {
        setHide({
          ...hide,
          type: "error",
          hide: true,
          text: "Canceled",
        });
      }
    } catch (error) {
      setHide({
        ...hide,
        type: "error",
        hide: true,
        text: `Document picker error: ${error}`,
      });
    }
  };

  // Handle form submission
  const fileToGenerativePart = async (path, mimeType) => {
    const base64Data = await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("uploaded");
    setHide({ ...hide, type: "success", hide: true, text: "Uploading..." });
    return {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };
  };

  const handleSubmit = async (text) => {
    const prompt = text;
    const imagePath = files?.uri;
    const mimeType = files?.mimeType;
    let imagePart;

    setLoading(true);
    if (text) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "user",
          parts: [
            {
              text: `${prompt}`,
            },
          ],
        },
      ]);

      try {
        const genAI = new GoogleGenerativeAI(
          "AIzaSyAw3fuaejoPbR6t3lEoI5TbxhOF1iVp_Gs"
        );
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash-8b",
        });

        const generationConfig = {
          temperature: 2,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        };

        if (files) {
          imagePart = await fileToGenerativePart(imagePath, mimeType);
        }

        const chat = model.startChat({
          history: messages,
        });

        let result = await chat.sendMessage(
          files
            ? [
                `read this file and choose the correct answer and return the correct answer only and choose one answer: ${text}`,
                imagePart,
              ]
            : prompt,
          generationConfig
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "model", parts: [{ text: result.response.text() }] },
        ]);

        // console.log(result.response.text());
        // console.log(result.response.candidates[0].content);
        // console.log(messages);
      } catch (err) {
        console.log(err);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "model",
            parts: [
              {
                text: "Something went wrong, Try again!",
              },
            ],
          },
        ]);
      } finally {
        setText("");
        setLoading(false);
      }
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", parts: [{ text: "Empty" }] },
        {
          role: "model",
          parts: [
            {
              text: "Fuck you, how can help you with nothing 😪 \n 😪 تبا لك, كيف سأساعدك بلا شئ",
            },
          ],
        },
      ]);
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    setHide({ ...hide, type: "success", hide: true, text: "Copy Text" });
  };

  const fetchCopiedText = async () => {
    Clipboard.getString().then((text) => {
      setText(text);
      handleSubmit(text);
      setHide({ ...hide, type: "success", hide: true, text: "Past & Send" });
    });
  };

  useEffect(() => {
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
    }
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="items-center justify-center w-full h-full gap-y-2 p-2">
        <View className="flex-1 w-full bg-black-100 rounded-2xl p-3 border-2 border-black-200 relative">
          <FlatList
            data={messages}
            ref={flatListRef}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <Animatable.View animation={"fadeIn"}>
                <TextChat
                  item={item}
                  onPressCopy={() => copyToClipboard(item.parts[0].text)}
                />
              </Animatable.View>
            )}
            ListHeaderComponent={() => (
              <View className="mb-4">
                <Text className="text-white font-pregular text-xl">
                  Chat AI For Exam <Icon name="school" size={20} color="#fff" />
                </Text>
              </View>
            )}
            ListEmptyComponent={() => (
              <View className="items-center justify-center flex-1">
                <Text className="text-white font-psemibold text-xl text-center">
                  How can I assist you today? 😪
                </Text>
              </View>
            )}
            ListFooterComponent={() => (
              <>
                {/* Loading... */}
                {loading && <LoadingChat />}
              </>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
        {files && (
          <Animatable.View
            animation={"fadeInLeft"}
            className="w-full bg-black-100 rounded-2xl p-3 border-2 border-black-200"
          >
            <View className="flex-row items-center gap-x-2">
              <Icon name="link" size={20} color="#ff9001" />
              <Text className="text-white flex-1" numberOfLines={1}>
                {files.name || files.fileName}
              </Text>
              <Text className="text-gray-500">{files.mimeType}</Text>
              <TouchableOpacity
                onPress={() => {
                  setFiles();
                  setfileData();
                  setfileMimType();
                }}
                activeOpacity={0.7}
                className="p-1 border border-secondary-100 rounded-full"
              >
                <Icon name="close" size={15} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
        {/* Inputs */}
        <View className="w-full">
          <CustomInput
            placeholder={"Message AI Assistant..."}
            onPressLeftIcon1={pickFile}
            onPressLeftIcon2={selectMedia}
            onPressRightIcon={() => handleSubmit(text)}
            onChangeText={(e) => setText(e)}
            value={text}
            loading={loading}
          />
        </View>
        {/* Past & Send Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={fetchCopiedText}
          className={`absolute ${files ? "bottom-36" : "bottom-24"} right-2 ${
            loading && "opacity-50"
          } ${
            I18nManager.isRTL
              ? "rounded-tr-lg rounded-br-lg"
              : "rounded-tl-lg rounded-bl-lg"
          } px-3 py-1 bg-secondary/50 shadow-xl shadow-orange-700`}
          disabled={loading}
        >
          <Text className="text-white font-pmedium">Past & Send</Text>
        </TouchableOpacity>
      </View>
      <StatusBar backgroundColor="#161622" style="light" />
      {hide.hide && (
        <Tostify
          hide={hide}
          setHide={setHide}
          type={hide.type}
          text={hide.text}
        />
      )}
    </SafeAreaView>
  );
};

export default Main;
