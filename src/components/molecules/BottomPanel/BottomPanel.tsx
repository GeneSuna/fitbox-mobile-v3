import { HR, Row, Text } from "@/components/atoms";
import { config } from "@/theme/_config";
import {
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

type BottomPanelProps = {
    visible: boolean;
    onClose: () => void;
    backButton?: any;
    rightTitle?: any;
    title?: string;
    noMask?: boolean;
    style?: any;
    children?: any;
    maxHeight?: string | number;
};

const BottomPanel = (props: BottomPanelProps) => {
    const {
        visible,
        onClose,
        backButton,
        rightTitle,
        title,
        maxHeight = "70%",
        noMask,
        style,
        children,
    } = props;

    let modalStyle = {
        backgroundColor: "white",
        maxHeight: maxHeight,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        ...style,
    };

    const isAndroid = Platform.OS === "android";
    return (
        <Modal
            animationType={isAndroid ? "fade" : "none"}
            transparent={true}
            visible={visible}
        >
            <SafeAreaView
                style={{
                    ...styles.modalContainer,
                    backgroundColor: noMask
                        ? "transaparent"
                        : "rgba(0,0,0,0.3)",
                }}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
                <View style={modalStyle}>
                    {title && (
                        <>
                            <Row
                                spacing="space-between"
                                style={{ padding: config.metrics.lg }}
                            >
                                <Row align={"center"}>
                                    {backButton && (
                                        <TouchableOpacity
                                            onPress={onClose}
                                            style={{
                                                marginRight: config.metrics.md,
                                            }}
                                        >
                                            <Icon
                                                name={"arrow-left"}
                                                size={config.fonts.metrics.md}
                                            />
                                        </TouchableOpacity>
                                    )}
                                    <Text
                                        size={"lg"}
                                        style={{ fontFamily: "Alata-Regular" }}
                                    >
                                        {title}
                                    </Text>
                                </Row>
                                {rightTitle}
                            </Row>
                            <HR />
                        </>
                    )}
                    {children}
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default BottomPanel;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
});
