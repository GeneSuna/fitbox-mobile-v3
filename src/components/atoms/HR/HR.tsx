import { config } from "@/theme/_config";
import { StyleSheet, View } from "react-native";

type HRProps = {
    color?: string;
    thickness?: number;
    margin?: number;
};

const HR = (props: HRProps) => {
    const { color, thickness, margin } = props;

    return (
        <View
            style={{
                borderColor: color || config.borders.colors.gray,
                borderWidth: thickness || StyleSheet.hairlineWidth,
                marginVertical: margin ? config.metrics.rg : config.metrics.xs,
            }}
        />
    );
};

export default HR;
