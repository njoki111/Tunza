// CareBridge - Care Requests (Production Grade)
import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Clock4,
  XCircle,
  Inbox,
  Plus,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { CareRequest } from '@/types/caregiver';
import { router } from 'expo-router';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useRequests } from '@/hooks/useRequests'

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'] as const;

export default function RequestsScreen() {
  const [activeTab, setActiveTab] = React.useState<typeof TABS[number]>('All');

const { data: allRequests = [], isLoading } = useRequests()

const filteredRequests = useMemo(() => {
  if (activeTab === 'All') return allRequests
  if (activeTab === 'Upcoming') return allRequests.filter(r => r.status === 'confirmed' || r.status === 'pending')
  if (activeTab === 'Completed') return allRequests.filter(r => r.status === 'completed')
  if (activeTab === 'Cancelled') return allRequests.filter(r => r.status === 'cancelled')
  return allRequests
}, [activeTab, allRequests])

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 size={18} color={colors.success.DEFAULT} />;
      case 'pending':
        return <Clock4 size={18} color={colors.warning.DEFAULT} />;
      case 'completed':
        return <CheckCircle2 size={18} color={colors.primary[500]} />;
      case 'cancelled':
        return <XCircle size={18} color={colors.error.DEFAULT} />;
      default:
        return null;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'confirmed': return colors.success.DEFAULT;
      case 'pending': return colors.warning.DEFAULT;
      case 'completed': return colors.primary[500];
      case 'cancelled': return colors.error.DEFAULT;
      default: return colors.secondary[400];
    }
  }, []);

  const renderRequest = useCallback(({ item, index }: { item: CareRequest; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 50)}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <View style={styles.cardHeader}>
          <View style={styles.caregiverInfo}>
            <Image source={{ uri: item.caregiverAvatar }} style={styles.avatar} />
            <View>
              <Text style={styles.caregiverName}>{item.caregiverName}</Text>
              <Text style={styles.careType}>{item.careType}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            {getStatusIcon(item.status)}
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Calendar size={16} color={colors.secondary[500]} />
            <Text style={styles.detailText}>
              {new Date(item.startDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
              {item.startDate !== item.endDate && ` - ${new Date(item.endDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}`}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={16} color={colors.secondary[500]} />
            <Text style={styles.detailText}>{item.startTime} - {item.endTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={16} color={colors.secondary[500]} />
            <Text style={styles.detailText} numberOfLines={1}>{item.address}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${item.totalAmount}</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
            <ChevronRight size={16} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  ), [getStatusColor, getStatusIcon]);

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Inbox size={48} color={colors.secondary[300]} />
      </View>
      <Text style={styles.emptyTitle}>No requests found</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'All'
          ? 'Book your first caregiver to get started'
          : `No ${activeTab.toLowerCase()} requests yet`}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push('/caregivers')}
      >
        <Plus size={18} color={colors.white} />
        <Text style={styles.emptyButtonText}>Book Care</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View entering={FadeInUp} style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Requests</Text>
          <Text style={styles.headerSubtitle}>Manage your care appointments</Text>
        </View>
      </Animated.View>

      {/* Tabs */}
      <Animated.View entering={FadeInUp.delay(100)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Requests List */}
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequest}
        contentContainerStyle={[
          styles.listContent,
          filteredRequests.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={EmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary[50],
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.secondary[900],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.secondary[500],
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary[100],
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.secondary[100],
  },
  tabActive: {
    backgroundColor: colors.primary[600],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondary[600],
  },
  tabTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  caregiverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  caregiverName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary[900],
  },
  careType: {
    fontSize: 13,
    color: colors.secondary[500],
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondary[100],
    marginVertical: 12,
  },
  detailsContainer: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 14,
    color: colors.secondary[700],
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.secondary[100],
  },
  totalLabel: {
    fontSize: 12,
    color: colors.secondary[400],
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary[900],
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.secondary[800],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.secondary[500],
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary[600],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});
