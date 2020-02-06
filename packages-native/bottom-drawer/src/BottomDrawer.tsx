import { createElement, ReactNode, useRef, useCallback, useMemo, useState, useEffect } from "react";
import BottomSheet from "reanimated-bottom-sheet";
import { View, Dimensions } from "react-native";
import { BottomDrawerProps } from "../typings/BottomDrawerProps";
import { BottomDrawerStyle, defaultBottomDrawerStyle } from "./ui/Styles";
import { flattenStyles } from "@native-mobile-resources/util-widgets";
import { ValueStatus } from "mendix";
import Animated from "react-native-reanimated";
import Big from "big.js";

/*
Known issues:
- Android pixel 3 100 percent snap point not tracked 
*/

export function BottomDrawer(props: BottomDrawerProps<BottomDrawerStyle>): ReactNode {
    const styles = flattenStyles(defaultBottomDrawerStyle, props.style);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const currentSnapPointIndexRef = useRef(props.currentSnapPointIndex);
    currentSnapPointIndexRef.current = props.currentSnapPointIndex;
    const currentHeaderPosition = useMemo(() => new Animated.Value(-1), []);
    const [snappedToIndex, setSnappedToIndex] = useState(0);

    const renderHeader = useCallback(() => props.headerContent, [props.headerContent]);
    const renderContent = useCallback(() => props.mainContent, [props.mainContent]);

    const [snapPoints, snapPointsInDp] = useMemo(() => {
        const snapPoints = props.snapPoints.map(snapPoint =>
            snapPoint.distanceUnit === "percentage" ? snapPoint.distance + "%" : snapPoint.distance
        );

        const snapPointsInDp = snapPoints.map(snapPoint => {
            if (typeof snapPoint === "string") {
                // convert percentages into dp
                return BottomSheet.renumber(snapPoint);
            }

            return snapPoint;
        });

        return [snapPoints, snapPointsInDp];
    }, [props.snapPoints]);

    const test = useCallback((snapPoint: number, index: number) => {
        console.warn("snap point", snapPoint);
        console.warn("snap point index", index);
        console.warn(snappedToIndex);
        if (index !== snappedToIndex) {
            setSnappedToIndex(index);
            currentSnapPointIndexRef.current.setValue(new Big(index));
        }
    }, []);

    const renderHeaderPositionListeners = useCallback(() => {
        const conditions = snapPointsInDp.map((snapPoint, index) => {
            return Animated.cond(
                Animated.eq(currentHeaderPosition, Dimensions.get("window").height - snapPoint),
                Animated.call([], () => {
                    console.warn("calling");
                    test(snapPoint, index);
                })
            );
        });

        return <Animated.Code exec={Animated.block(conditions)} />;
    }, [snapPointsInDp]);

    useEffect(() => {
        if (currentSnapPointIndexRef.current.status === ValueStatus.Available) {
            console.warn("useEffect update snap point");
            console.warn("bottomSheetRef.current", !!bottomSheetRef.current);
            console.warn("currentSnapPointIndexRef.current.value", currentSnapPointIndexRef.current.value);

            const value = Number(currentSnapPointIndexRef.current.value?.toFixed(0));

            if (value !== snappedToIndex) {
                setSnappedToIndex(value);
                bottomSheetRef.current?.snapTo(Number(currentSnapPointIndexRef.current.value?.toFixed(0)));
            }
        }
    }, [currentSnapPointIndexRef.current]);

    return (
        <View style={styles.container}>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                renderHeader={renderHeader}
                renderContent={renderContent}
                headerPosition={currentHeaderPosition}
            />
            {renderHeaderPositionListeners()}
        </View>
    );
}