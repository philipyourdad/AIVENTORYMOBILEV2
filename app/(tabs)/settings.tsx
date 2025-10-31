import { StyleSheet, View, Switch, TouchableOpacity, Alert, ScrollView, Modal, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dexter Morgan',
    role: 'Administrator'
  });
  const [tempProfile, setTempProfile] = useState({
    name: 'Dexter Morgan',
    role: 'Administrator'
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const textTertiaryColor = useThemeColor({}, 'textTertiary');
  const primaryColor = useThemeColor({}, 'primary');
  const dangerColor = useThemeColor({}, 'danger');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Navigate to login screen
            router.replace('/login');
          }
        }
      ]
    );
  };

  const openEditProfileModal = () => {
    setTempProfile({ ...profile });
    setIsEditProfileModalVisible(true);
  };

  const saveProfile = () => {
    setProfile({ ...tempProfile });
    setIsEditProfileModalVisible(false);
  };

  const cancelEditProfile = () => {
    setIsEditProfileModalVisible(false);
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    // Simulate password change - in a real app, you would call an API
    console.log('Password changed successfully');
    Alert.alert('Success', 'Password changed successfully');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setIsChangePasswordModalVisible(false);
  };

  const cancelChangePassword = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setIsChangePasswordModalVisible(false);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <ThemedText type="title" style={[styles.title, { color: textColor }]}>Settings</ThemedText>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* User Profile Section */}
        <Card style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <MaterialIcons name="account-circle" size={60} color={textTertiaryColor} />
            </View>
            <ThemedText type="subtitle" style={[styles.profileName, { color: textColor }]}>{profile.name}</ThemedText>
            <ThemedText style={[styles.profileRole, { color: textTertiaryColor }]}>{profile.role}</ThemedText>
            <TouchableOpacity style={[styles.editButton, { borderColor: primaryColor }]} onPress={openEditProfileModal}>
              <MaterialIcons name="edit" size={16} color={primaryColor} />
              <ThemedText style={[styles.editButtonText, { color: primaryColor }]}>Edit Profile</ThemedText>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="notifications" size={20} color={primaryColor} />
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>Notifications</ThemedText>
          </View>
          
          <View style={[styles.settingRow, { borderBottomColor: borderColor }]}>
            <ThemedText style={[styles.settingText, { color: textSecondaryColor }]}>Enable notifications</ThemedText>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: borderColor, true: primaryColor }}
              thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          
          <View style={[styles.settingRow, { borderBottomColor: borderColor }]}>
            <ThemedText style={[styles.settingText, { color: textSecondaryColor }]}>Low stock alerts</ThemedText>
            <Switch
              value={true}
              disabled
              trackColor={{ false: borderColor, true: primaryColor }}
              thumbColor={'#ffffff'}
            />
          </View>
        </Card>
        
        <Card style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="sync" size={20} color={primaryColor} />
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>Data Sync</ThemedText>
          </View>
          
          <View style={[styles.settingRow, { borderBottomColor: borderColor }]}>
            <ThemedText style={[styles.settingText, { color: textSecondaryColor }]}>Auto-sync inventory</ThemedText>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: borderColor, true: primaryColor }}
              thumbColor={autoSync ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity style={[styles.syncButton, { backgroundColor: borderColor }]} onPress={() => Alert.alert('Sync', 'Manual sync initiated')}>
            <MaterialIcons name="sync" size={20} color={primaryColor} />
            <ThemedText style={[styles.syncButtonText, { color: primaryColor }]}>Sync Now</ThemedText>
          </TouchableOpacity>
        </Card>
        
        {/* Accounts Card */}
        <Card style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="account-circle" size={20} color={primaryColor} />
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>Accounts</ThemedText>
          </View>
          
          <TouchableOpacity 
            style={[styles.accountButton, { borderBottomColor: borderColor }]} 
            onPress={() => setIsChangePasswordModalVisible(true)}
          >
            <MaterialIcons name="lock" size={20} color={primaryColor} />
            <ThemedText style={[styles.accountButtonText, { color: textColor }]}>Change Password</ThemedText>
            <MaterialIcons name="chevron-right" size={20} color={textTertiaryColor} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color={dangerColor} />
            <ThemedText style={[styles.logoutButtonText, { color: dangerColor }]}>Logout</ThemedText>
          </TouchableOpacity>
        </Card>

        {/* About Card - Moved to the bottom */}
        <Card style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="info" size={20} color={primaryColor} />
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>About</ThemedText>
          </View>
          
          <View style={styles.aboutRow}>
            <ThemedText style={[styles.aboutText, { color: textTertiaryColor }]}>AIVENTORY v1.0.0</ThemedText>
          </View>
          
          <View style={styles.aboutRow}>
            <ThemedText style={[styles.aboutText, { color: textTertiaryColor }]}>© 2025 AIVENTORY. All rights reserved.</ThemedText>
          </View>
        </Card>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditProfileModalVisible}
        onRequestClose={cancelEditProfile}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: cardBackgroundColor }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={[styles.modalTitle, { color: textColor }]}>Edit Profile</ThemedText>
              <TouchableOpacity onPress={cancelEditProfile}>
                <MaterialIcons name="close" size={24} color={textTertiaryColor} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Name</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: borderColor, color: textColor, backgroundColor: backgroundColor }]}
                value={tempProfile.name}
                onChangeText={(text) => setTempProfile({ ...tempProfile, name: text })}
                placeholder="Enter name"
                placeholderTextColor={textTertiaryColor}
              />
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Role</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: borderColor, color: textColor, backgroundColor: backgroundColor }]}
                value={tempProfile.role}
                onChangeText={(text) => setTempProfile({ ...tempProfile, role: text })}
                placeholder="Enter role"
                placeholderTextColor={textTertiaryColor}
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: borderColor }]} 
                onPress={cancelEditProfile}
              >
                <ThemedText style={[styles.modalButtonText, { color: textSecondaryColor }]}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton, { backgroundColor: primaryColor }]} 
                onPress={saveProfile}
              >
                <ThemedText style={[styles.modalButtonText, { color: '#ffffff' }]}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isChangePasswordModalVisible}
        onRequestClose={cancelChangePassword}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: cardBackgroundColor }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={[styles.modalTitle, { color: textColor }]}>Change Password</ThemedText>
              <TouchableOpacity onPress={cancelChangePassword}>
                <MaterialIcons name="close" size={24} color={textTertiaryColor} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Current Password</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: borderColor, color: textColor, backgroundColor: backgroundColor }]}
                value={passwordForm.currentPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
                placeholder="Enter current password"
                placeholderTextColor={textTertiaryColor}
                secureTextEntry
              />
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={[styles.label, { color: textSecondaryColor }]}>New Password</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: borderColor, color: textColor, backgroundColor: backgroundColor }]}
                value={passwordForm.newPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
                placeholder="Enter new password"
                placeholderTextColor={textTertiaryColor}
                secureTextEntry
              />
            </View>
            
            <View style={styles.formGroup}>
              <ThemedText style={[styles.label, { color: textSecondaryColor }]}>Confirm New Password</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: borderColor, color: textColor, backgroundColor: backgroundColor }]}
                value={passwordForm.confirmNewPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmNewPassword: text })}
                placeholder="Confirm new password"
                placeholderTextColor={textTertiaryColor}
                secureTextEntry
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: borderColor }]} 
                onPress={cancelChangePassword}
              >
                <ThemedText style={[styles.modalButtonText, { color: textSecondaryColor }]}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton, { backgroundColor: primaryColor }]} 
                onPress={handleChangePassword}
              >
                <ThemedText style={[styles.modalButtonText, { color: '#ffffff' }]}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  profileAvatar: {
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  editButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingText: {
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 16,
    gap: 8,
  },
  syncButtonText: {
    fontWeight: '600',
  },
  aboutRow: {
    paddingVertical: 8,
  },
  aboutText: {
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  
  logoutButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  
  accountButtonText: {
    flex: 1,
    marginLeft: 16,
    fontWeight: '500',
    fontSize: 16,
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
  },
  modalButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});