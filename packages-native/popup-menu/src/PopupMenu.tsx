import { ComponentType, createElement, ReactElement, useCallback, useRef } from "react";
import { PopupMenuProps } from "../typings/PopupMenuProps";
import { PopupMenuStyle } from "./ui/Styles";
import { executeAction } from "@widgets-resources/piw-utils";
import {
    Platform,
    StyleSheet,
    TouchableHighlight,
    TouchableHighlightProps,
    TouchableNativeFeedback,
    TouchableNativeFeedbackProps,
    View
} from "react-native";
import { ActionValue } from "mendix";
import Menu, { MenuDivider, MenuItem } from "react-native-material-menu";

export function PopupMenu(props: PopupMenuProps<PopupMenuStyle>): ReactElement {
    const styles = StyleSheet.flatten(props.style);

    const menuRef = useRef<Menu>(null);
    const showMenu = useCallback(() => {
        menuRef.current?.show();
    }, [menuRef.current]);
    const handlePress = useCallback(
        (action?: ActionValue) => {
            menuRef.current?.hide();
            executeAction(action);
        },
        [menuRef.current]
    );

    const Touchable: ComponentType<TouchableNativeFeedbackProps | TouchableHighlightProps> =
        Platform.OS === "android" ? TouchableNativeFeedback : TouchableHighlight;

    let menuOptions: ReactElement[];
    if (props.renderMode === "basic") {
        menuOptions = props.basicItems.map((item, index) =>
            item.itemType === "divider" ? (
                <MenuDivider key={index} color={styles.basicItem?.dividerColor} />
            ) : (
                <MenuItem
                    key={index}
                    onPress={() => handlePress(item.action)}
                    underlayColor={styles.basicItem?.underlayColor}
                    textStyle={styles.basicItem?.textStyle}
                    ellipsizeMode={styles.basicItem?.ellipsizeMode as any}
                    style={styles.basicItem?.container as any}
                >
                    {item.caption}
                </MenuItem>
            )
        );
    } else {
        menuOptions = props.complexItems.map((item, index) => (
            <Touchable
                key={index}
                onPress={() => handlePress(item.action)}
                underlayColor={styles.complexItem?.underlayColor}
                {...(Platform.OS === "android"
                    ? {
                          background: TouchableNativeFeedback.SelectableBackground()
                      }
                    : {})}
            >
                <View style={styles.complexItem?.container}>{item.content}</View>
            </Touchable>
        ));
    }

    return (
        <Menu
            ref={menuRef}
            button={
                <Touchable onPress={showMenu} underlayColor={styles.buttonUnderlayColor}>
                    <View style={styles.buttonContainer}>{props.menuTriggerer}</View>
                </Touchable>
            }
        >
            {menuOptions}
        </Menu>
    );
}
