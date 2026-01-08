import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import moment from 'moment';
import Swiper from 'react-native-swiper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import classesData from '../data/classes.json';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

// Get available months from data
const availableMonths = classesData.months.map(m => m.month);

// Helper function to get month data by month string
const getMonthData = (monthString) => {
  return classesData.months.find(m => m.month === monthString);
};

// Helper function to get classes for a specific date from a specific month's schedule
const getClassesForDate = (date, schedule) => {
  const dateString = moment(date).format('YYYY-MM-DD');
  const daySchedule = schedule.find(s => s.date === dateString);
  return daySchedule ? daySchedule.classes : [];
};

// Class Card Component
const ClassCard = ({ classItem }) => {
  return (
    <View style={[styles.classCard, { borderLeftColor: classItem.color }]}>
      <View style={styles.classTimeContainer}>
        <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
        <Text style={styles.classTime}>
          {classItem.startTime} - {classItem.endTime}
        </Text>
      </View>
      <Text style={styles.classSubject}>{classItem.subject}</Text>
      <Text style={styles.classCode}>{classItem.code}</Text>
      <View style={styles.classDetails}>
        <View style={styles.classDetailRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color="#6B7280" />
          <Text style={styles.classDetailText}>{classItem.room}</Text>
        </View>
        <View style={styles.classDetailRow}>
          <MaterialCommunityIcons name="account-outline" size={14} color="#6B7280" />
          <Text style={styles.classDetailText}>{classItem.teacher}</Text>
        </View>
      </View>
    </View>
  );
};

// Empty State Component
const EmptyState = () => (
  <View style={styles.emptyState}>
    <MaterialCommunityIcons name="calendar-blank-outline" size={64} color="#D1D5DB" />
    <Text style={styles.emptyStateTitle}>No Classes</Text>
    <Text style={styles.emptyStateText}>You have no classes scheduled for this day</Text>
  </View>
);

export default function Example() {
  const swiper = useRef();
  const contentSwiper = useRef();
  const [week, setWeek] = useState(0);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

  // Get current month data based on selection
  const currentMonthString = availableMonths[selectedMonthIndex];
  const currentMonthData = getMonthData(currentMonthString);
  const currentMonth = moment(currentMonthString, 'YYYY-MM');
  const monthStart = currentMonth.clone().startOf('month');
  const monthEnd = currentMonth.clone().endOf('month');

  // Helper function to check if date is within current month
  const isDateInMonth = (date) => {
    const m = moment(date);
    return m.isSameOrAfter(monthStart, 'day') && m.isSameOrBefore(monthEnd, 'day');
  };

  // Initialize to first day of the month from data
  const [value, setValue] = useState(monthStart.toDate());

  // Handle month change
  const handlePrevMonth = () => {
    if (selectedMonthIndex > 0) {
      const newIndex = selectedMonthIndex - 1;
      setSelectedMonthIndex(newIndex);
      const newMonth = moment(availableMonths[newIndex], 'YYYY-MM');
      setValue(newMonth.startOf('month').toDate());
      setWeek(0);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex < availableMonths.length - 1) {
      const newIndex = selectedMonthIndex + 1;
      setSelectedMonthIndex(newIndex);
      const newMonth = moment(availableMonths[newIndex], 'YYYY-MM');
      setValue(newMonth.startOf('month').toDate());
      setWeek(0);
    }
  };

  /**
   * Create an array of weekdays for previous, current, and next weeks.
   * Only includes dates within the current month.
   */
  const weeks = React.useMemo(() => {
    const start = monthStart.clone().add(week, 'weeks').startOf('week');

    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');
        const inMonth = isDateInMonth(date);

        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
          inMonth,
        };
      });
    });
  }, [week, selectedMonthIndex]);

  /**
   * Create an array of days for yesterday, today, and tomorrow.
   */
  const days = React.useMemo(() => {
    return [
      moment(value).subtract(1, 'day').toDate(),
      value,
      moment(value).add(1, 'day').toDate(),
    ];
  }, [value]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        <View style={styles.header}>
          <View style={styles.monthSelector}>
            <TouchableOpacity 
              onPress={handlePrevMonth}
              style={[styles.monthNavBtn, selectedMonthIndex === 0 && styles.monthNavBtnDisabled]}
              disabled={selectedMonthIndex === 0}
            >
              <MaterialCommunityIcons 
                name="chevron-left" 
                size={24} 
                color={selectedMonthIndex === 0 ? '#D1D5DB' : '#111'} 
              />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{currentMonth.format('MMMM YYYY')}</Text>
            <TouchableOpacity 
              onPress={handleNextMonth}
              style={[styles.monthNavBtn, selectedMonthIndex === availableMonths.length - 1 && styles.monthNavBtnDisabled]}
              disabled={selectedMonthIndex === availableMonths.length - 1}
            >
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color={selectedMonthIndex === availableMonths.length - 1 ? '#D1D5DB' : '#111'} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={ind => {
              if (ind === 1) {
                return;
              }

              const index = ind - 1;
              const newDate = moment(value).add(index, 'week');
              
              // Check if the new week would be within the month
              const newWeekStart = newDate.clone().startOf('week');
              const newWeekEnd = newDate.clone().endOf('week');
              const hasMonthDays = newWeekStart.isSameOrBefore(monthEnd) && newWeekEnd.isSameOrAfter(monthStart);
              
              if (!hasMonthDays) {
                swiper.current.scrollTo(1, false);
                return;
              }

              // Clamp the selected date to be within the month
              let clampedDate = newDate;
              if (!isDateInMonth(newDate)) {
                clampedDate = index > 0 ? monthEnd.clone() : monthStart.clone();
              }
              
              setValue(clampedDate.toDate());

              setTimeout(() => {
                setWeek(week + index);
                swiper.current.scrollTo(1, false);
              }, 10);
            }}>
            {weeks.map((dates, index) => (
              <View style={styles.itemRow} key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  const isDisabled = !item.inMonth;
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => {
                        if (item.inMonth) {
                          setValue(item.date);
                        }
                      }}>
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: '#4F46E5',
                            borderColor: '#4F46E5',
                          },
                          isDisabled && styles.itemDisabled,
                        ]}>
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && { color: '#fff' },
                            isDisabled && styles.itemTextDisabled,
                          ]}>
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.itemDate,
                            isActive && { color: '#fff' },
                            isDisabled && styles.itemTextDisabled,
                          ]}>
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        <Swiper
          index={1}
          ref={contentSwiper}
          loop={false}
          showsPagination={false}
          onIndexChanged={ind => {
            if (ind === 1) {
              return;
            }

            setTimeout(() => {
              const nextValue = moment(value).add(ind - 1, 'days');

              // Check if the next date is within the month
              if (!isDateInMonth(nextValue)) {
                contentSwiper.current.scrollTo(1, false);
                return;
              }

              // Adjust week picker if needed
              if (moment(value).week() !== nextValue.week()) {
                setWeek(
                  moment(value).isBefore(nextValue) ? week + 1 : week - 1,
                );
              }

              setValue(nextValue.toDate());
              contentSwiper.current.scrollTo(1, false);
            }, 10);
          }}>
          {days.map((day, index) => {
            const dayClasses = getClassesForDate(day, currentMonthData?.schedule || []);
            return (
              <View
                key={index}
                style={{ flex: 1, }}>
                <Text style={styles.subtitle}>
                  {day.toLocaleDateString('en-US', { dateStyle: 'full' })}
                </Text>
                <View style={styles.scheduleContainer}>
                  {dayClasses.length > 0 ? (
                    <ScrollView 
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.classesListContent}
                    >
                      {dayClasses.map((classItem) => (
                        <ClassCard key={classItem.id} classItem={classItem} />
                      ))}
                    </ScrollView>
                  ) : (
                    <EmptyState />
                  )}
                </View>
              </View>
            );
          })}
        </Swiper>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,

  },
  header: {
    marginBottom: 8,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  monthNavBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  monthNavBtnDisabled: {
    backgroundColor: '#F9FAFB',
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
  },
  /** Item */
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e3e3e3',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  itemDisabled: {
    opacity: 0.3,
    backgroundColor: '#f5f5f5',
  },
  itemTextDisabled: {
    color: '#c0c0c0',
  },
  /** Schedule Container */
  scheduleContainer: {
    flex: 1,
  },
  classesListContent: {
    paddingHorizontal: 3,
  },
  /** Class Card */
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  classTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  classTime: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  classSubject: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  classCode: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
    fontWeight: '500',
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  classDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classDetailText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  /** Empty State */
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});