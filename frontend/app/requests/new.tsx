// CareBridge - New Care Request (Production Grade)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  ChevronDown,
  ArrowLeft,
  Shield,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

const CARE_TYPES = [
  'Daily Care',
  'Overnight Care',
  'Respite Care',
  'Post-Surgery Care',
  'Palliative Care',
  'Companion Care',
];

export default function NewRequestScreen() {
  const [selectedType, setSelectedType] = useState('Daily Care');
  const [patientName, setPatientName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.secondary[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Booking</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Trust Banner */}
        <Animated.View entering={FadeInUp} style={styles.trustBanner}>
          <Shield size={20} color={colors.success.DEFAULT} />
          <Text style={styles.trustText}>All caregivers are background checked</Text>
        </Animated.View>

        {/* Care Type Selection */}
        <Animated.View entering={FadeInUp.delay(50)} style={styles.section}>
          <Text style={styles.sectionTitle}>Type of Care</Text>
          <View style={styles.careTypesContainer}>
            {CARE_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.careTypeButton,
                  selectedType === type && styles.careTypeButtonActive
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[
                  styles.careTypeText,
                  selectedType === type && styles.careTypeTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Date & Time */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>

          <TouchableOpacity style={styles.inputCard}>
            <View style={styles.inputIcon}>
              <Calendar size={20} color={colors.primary[500]} />
            </View>
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Date</Text>
              <Text style={styles.inputValue}>Select date</Text>
            </View>
            <ChevronDown size={20} color={colors.secondary[400]} />
          </TouchableOpacity>

          <View style={styles.timeRow}>
            <TouchableOpacity style={[styles.inputCard, styles.timeCard]}>
              <View style={styles.inputIcon}>
                <Clock size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Start Time</Text>
                <Text style={styles.inputValue}>9:00 AM</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.inputCard, styles.timeCard]}>
              <View style={styles.inputIcon}>
                <Clock size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>End Time</Text>
                <Text style={styles.inputValue}>5:00 PM</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Patient Information */}
        <Animated.View entering={FadeInUp.delay(150)} style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>

          <View style={styles.textInputContainer}>
            <User size={20} color={colors.secondary[400]} style={styles.textInputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Patient's full name"
              placeholderTextColor={colors.secondary[400]}
              value={patientName}
              onChangeText={setPatientName}
            />
          </View>

          <View style={styles.textInputContainer}>
            <MapPin size={20} color={colors.secondary[400]} style={styles.textInputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Care address"
              placeholderTextColor={colors.secondary[400]}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.textAreaContainer}>
            <FileText size={20} color={colors.secondary[400]} style={styles.textAreaIcon} />
            <TextInput
              style={styles.textArea}
              placeholder="Additional notes (medical conditions, special requirements, etc.)"
              placeholderTextColor={colors.secondary[400]}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </Animated.View>

        {/* Pricing Summary */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.pricingCard}>
          <Text style={styles.pricingTitle}>Pricing Summary</Text>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Hourly Rate</Text>
            <Text style={styles.pricingValue}>$35.00</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Duration</Text>
            <Text style={styles.pricingValue}>8 hours</Text>
          </View>
          <View style={styles.pricingDivider} />
          <View style={styles.pricingRow}>
            <Text style={styles.pricingTotalLabel}>Total</Text>
            <Text style={styles.pricingTotal}>$280.00</Text>
          </View>
        </Animated.View>

        {/* Submit Button */}
        <Animated.View entering={FadeInUp.delay(250)}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary[100],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.secondary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary[900],
  },
  scrollContent: {
    padding: 20,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.success.light + '30',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  trustText: {
    fontSize: 13,
    color: colors.success.dark,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary[900],
    marginBottom: 16,
  },
  careTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  careTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  careTypeButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  careTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondary[600],
  },
  careTypeTextActive: {
    color: colors.white,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.secondary[200],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.secondary[500],
    marginBottom: 2,
  },
  inputValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary[900],
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCard: {
    flex: 1,
    marginBottom: 0,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.secondary[200],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  textInputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: colors.secondary[900],
  },
  textAreaContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderWidth: 1,
    borderColor: colors.secondary[200],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textArea: {
    flex: 1,
    height: 100,
    fontSize: 15,
    color: colors.secondary[900],
    lineHeight: 22,
  },
  pricingCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.secondary[200],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary[900],
    marginBottom: 16,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pricingLabel: {
    fontSize: 14,
    color: colors.secondary[600],
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary[800],
  },
  pricingDivider: {
    height: 1,
    backgroundColor: colors.secondary[200],
    marginVertical: 12,
  },
  pricingTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary[900],
  },
  pricingTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[600],
  },
  submitButton: {
    backgroundColor: colors.primary[600],
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
