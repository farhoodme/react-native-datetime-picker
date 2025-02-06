import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useCalendarContext } from '../CalendarContext';
import { getParsedDate, getMonths, isMonthDisabled } from '../utils';

const MonthSelector = () => {
  const { currentDate, onSelectMonth, theme, minDate, maxDate } = useCalendarContext();
  const { month } = getParsedDate(currentDate);

  return (
    <View style={styles.container} testID="month-selector">
      <View style={styles.monthsContainer}>
        {getMonths()?.map((item, index) => {
          const disabled = isMonthDisabled(index, currentDate, {
            minDate,
            maxDate,
          });
          const activeItemStyle =
            index === month
              ? {
                  borderColor: theme?.selectedItemColor || '#0047FF',
                  backgroundColor: theme?.selectedItemColor || '#0047FF',
                }
              : null;

          const textStyle =
            index === month
              ? { color: '#fff', ...theme?.selectedTextStyle }
              : theme?.calendarTextStyle;

          return (
            <Pressable
              key={index}
              style={styles.monthCell}
              onPress={() => (disabled ? null : onSelectMonth(index))}
              accessibilityRole="button"
              accessibilityLabel={item}
              disabled={disabled}
            >
              <View
                style={[
                  styles.month,
                  theme?.monthContainerStyle,
                  activeItemStyle,
                  disabled && styles.disabledMonth,
                ]}
              >
                <Text key={index} style={textStyle}>
                  {item}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthCell: {
    width: '33.3%',
  },
  month: {
    paddingVertical: 15,
    margin: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  disabledMonth: {
    opacity: 0.3,
  },
});

export default MonthSelector;
