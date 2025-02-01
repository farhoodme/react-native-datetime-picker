import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CalendarThemeProps, IDayObject } from '../types';
import { CALENDAR_HEIGHT } from '../enums';
import { addColorAlpha } from '../utils';
import { isEqual } from 'lodash';

export const daySize = 46;

interface Props extends Omit<IDayObject, 'day'> {
  isToday: boolean;
  isSelected: boolean;
  onSelectDate: (date: string) => void;
  theme: CalendarThemeProps;
  height?: number;
}

function EmptyDayPure({ height }: { height?: number }) {
  const style = styles(height || CALENDAR_HEIGHT);
  return <View style={style.dayCell} />;
}

export const EmptyDay = React.memo(EmptyDayPure);

function Day({
  date,
  text,
  disabled,
  isCurrentMonth,
  isToday,
  isSelected,
  inRange,
  leftCrop,
  rightCrop,
  onSelectDate,
  theme,
  height,
}: Props) {
  const onPress = React.useCallback(() => {
    onSelectDate(date);
  }, [onSelectDate, date]);

  const {
    calendarTextStyle,
    dayContainerStyle,
    selectedItemColor,
    selectedTextStyle,
    todayContainerStyle,
    todayTextStyle,
    selectedRangeBackgroundColor,
  } = theme;

  //const bothWays = inRange && leftCrop && rightCrop;
  const isCrop = inRange && (leftCrop || rightCrop) && !(leftCrop && rightCrop);

  const containerStyle = isCurrentMonth ? dayContainerStyle : { opacity: 0.3 };

  const todayItemStyle = isToday
    ? {
        borderWidth: 2,
        borderColor: selectedItemColor || '#0047FF',
        ...todayContainerStyle,
      }
    : null;

  const activeItemStyle = isSelected
    ? {
        borderColor: selectedItemColor || '#0047FF',
        backgroundColor: selectedItemColor || '#0047FF',
      }
    : null;

  const textStyle = isSelected
    ? { color: '#fff', ...selectedTextStyle }
    : isToday
    ? {
        ...calendarTextStyle,
        color: selectedItemColor || '#0047FF',
        ...todayTextStyle,
      }
    : calendarTextStyle;

  const rangeRootBackground =
    selectedRangeBackgroundColor ?? addColorAlpha(selectedItemColor, 0.15);

  const style = styles(height || CALENDAR_HEIGHT);

  return (
    <View style={style.dayCell}>
      {inRange && !isCrop ? (
        <View
          style={[style.rangeRoot, { backgroundColor: rangeRootBackground }]}
        />
      ) : null}

      {isCrop && leftCrop ? (
        <View
          style={[
            style.rangeRoot,
            {
              left: 0,
              backgroundColor: rangeRootBackground,
              borderTopLeftRadius: 100,
              borderBottomLeftRadius: 100,
            },
          ]}
        />
      ) : null}

      {isCrop && rightCrop ? (
        <View
          style={[
            style.rangeRoot,
            {
              right: 0,
              backgroundColor: rangeRootBackground,
              borderTopRightRadius: 100,
              borderBottomRightRadius: 100,
            },
          ]}
        />
      ) : null}

      <Pressable
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
        style={[
          style.dayContainer,
          containerStyle,
          todayItemStyle,
          activeItemStyle,
          disabled && style.disabledDay,
        ]}
        testID={date}
        accessibilityRole="button"
        accessibilityLabel={text}
      >
        <View style={[style.dayTextContainer]}>
          <Text style={[textStyle]}>{text}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = (height: number) =>
  StyleSheet.create({
    dayCell: {
      position: 'relative',
      width: '14.2%',
      height: height / 7,
    },
    dayContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 1.5,
      borderRadius: 100,
    },
    dayTextContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    disabledDay: {
      opacity: 0.3,
    },
    rangeRoot: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 2,
      bottom: 2,
    },
  });

const customComparator = (
  prevProps: Readonly<Props>,
  nextProps: Readonly<Props>
) => {
  return (
    prevProps.date === nextProps.date &&
    prevProps.text === nextProps.text &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.isCurrentMonth === nextProps.isCurrentMonth &&
    prevProps.isToday === nextProps.isToday &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.inRange === nextProps.inRange &&
    prevProps.leftCrop === nextProps.leftCrop &&
    prevProps.rightCrop === nextProps.rightCrop &&
    prevProps.onSelectDate === nextProps.onSelectDate &&
    prevProps.height === nextProps.height &&
    isEqual(prevProps.theme, nextProps.theme)
  );
};

export default React.memo(Day, customComparator);
