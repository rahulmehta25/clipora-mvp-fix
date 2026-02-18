import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { projectsApi } from '@/api/client';
import { useAppStore } from '@/store';

interface Project {
  id: string;
  name: string;
  status: 'Draft' | 'Processing' | 'Ready';
  video_count?: number;
  created_at?: string;
}

function ProjectCard({ project, onPress }: { project: Project; onPress: () => void }) {
  const statusVariant = {
    Ready: 'success',
    Processing: 'warning',
    Draft: 'default',
  }[project.status] as 'success' | 'warning' | 'default';

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.cardInner}>
        {/* Thumbnail */}
        <View style={styles.thumbnail}>
          <Ionicons name="videocam" size={28} color="#AEAEB2" />
          {project.status === 'Processing' && (
            <View style={styles.processingOverlay} />
          )}
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{project.name}</Text>
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="ellipsis-vertical" size={16} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardMeta}>
            <Badge variant={statusVariant}>{project.status}</Badge>
            <Text style={styles.dateText}>
              {project.video_count || 0} clips
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

export default function ProjectsScreen() {
  const setSelectedProject = useAppStore((s) => s.setSelectedProject);

  const { data: projects = [], isLoading, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  });

  function handlePress(project: Project) {
    setSelectedProject(project.id);
    if (project.status === 'Processing') {
      router.push(`/processing/${project.id}`);
    } else {
      router.push(`/projects/${project.id}`);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Projects</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(tabs)/upload')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00D4AA" />
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProjectCard project={item} onPress={() => handlePress(item)} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="#00D4AA"
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="videocam-outline" size={48} color="#AEAEB2" />
              </View>
              <Text style={styles.emptyTitle}>No projects yet</Text>
              <Text style={styles.emptyBody}>
                Upload your first video to start{'\n'}creating viral clips with AI.
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/(tabs)/upload')}
              >
                <Text style={styles.emptyBtnText}>Create Project</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00D4AA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  list: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
  },
  cardInner: {
    flexDirection: 'row',
    padding: 12,
    gap: 14,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyBtn: {
    marginTop: 28,
    backgroundColor: '#00D4AA',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
